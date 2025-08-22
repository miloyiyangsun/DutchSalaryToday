// FeedbackWidget.tsx - Emoji反馈系统主组件
// Main emoji feedback system component - simplified interaction

import React, { useState, useRef } from 'react';
import { useFeedback, useFeedbackStatistics } from '../hooks';
import { EMOJI_RATINGS, type EmojiRating } from '../types/feedback';

interface FeedbackWidgetProps {
  className?: string;
}

const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({ className = '' }) => {
  // 状态管理 - State Management
  const { feedback, loading: feedbackLoading, error: feedbackError, submitFeedback, updateFeedback, deleteFeedback } = useFeedback();
  const { statistics, loading: statsLoading, error: statsError, refetch: refetchStatistics } = useFeedbackStatistics();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 长按检测 - Long Press Detection
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [pressedEmoji, setPressedEmoji] = useState<EmojiRating | null>(null);

  // Emoji点击处理 - Emoji Click Handler
  const handleEmojiClick = async (rating: EmojiRating) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      
      const feedbackRequest = {
        userId: '', // UUID将在useFeedback hook中自动填充
        overallRating: rating
      };

      if (feedback?.id) {
        // UPDATE - 更新现有反馈
        await updateFeedback(feedback.id, feedbackRequest);
      } else {
        // CREATE - 创建新反馈
        await submitFeedback(feedbackRequest);
      }
      
      // 反馈提交成功后，立即刷新统计数据
      await refetchStatistics();
    } catch (err) {
      console.error('Emoji feedback submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 长按开始 - Long Press Start
  const handleMouseDown = (rating: EmojiRating) => {
    if (!feedback || feedback.overallRating !== rating) return;
    
    setPressedEmoji(rating);
    pressTimerRef.current = setTimeout(async () => {
      // 长按1秒后撤销反馈
      if (feedback?.id) {
        try {
          setIsSubmitting(true);
          await deleteFeedback(feedback.id);
          
          // 反馈删除成功后，立即刷新统计数据
          await refetchStatistics();
        } catch (err) {
          console.error('Emoji feedback deletion error:', err);
        } finally {
          setIsSubmitting(false);
          setPressedEmoji(null);
        }
      }
    }, 1000); // 1秒长按
  };

  // 长按结束 - Long Press End
  const handleMouseUp = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    setPressedEmoji(null);
  };

  // Emoji按钮组件 - Emoji Button Component
  const EmojiButton: React.FC<{ rating: EmojiRating }> = ({ rating }) => {
    const emoji = EMOJI_RATINGS[rating];
    const count = statistics?.emojiDistribution[rating] || 0;
    const isSelected = feedback?.overallRating === rating;
    const isPressed = pressedEmoji === rating;
    
    return (
      <div className="emoji-button-container">
        <button
          className={`emoji-button ${isSelected ? 'selected' : ''} ${isPressed ? 'pressed' : ''}`}
          onClick={() => handleEmojiClick(rating)}
          onMouseDown={() => handleMouseDown(rating)}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={() => handleMouseDown(rating)}
          onTouchEnd={handleMouseUp}
          disabled={isSubmitting}
        >
          <span className="emoji">{emoji}</span>
        </button>
        <div className="emoji-count">{count}</div>
      </div>
    );
  };

  // 加载状态 - Loading State
  if (feedbackLoading || statsLoading) {
    return (
      <div className={`feedback-widget loading ${className}`}>
        <div className="loading-spinner">Loading emoji feedback...</div>
      </div>
    );
  }

  return (
    <div className={`feedback-widget ${className}`}>
      {/* 反馈系统标题 - Feedback Header */}
      <div className="feedback-header">
        <h3>😊 How do you feel about Dutch Salary Insights?</h3>
        <p>{feedback ? 'Tap emoji to change • Long press to remove' : 'Tap an emoji to share your feedback'}</p>
      </div>

      {/* 错误显示 - Error Display */}
      {(feedbackError || statsError) && (
        <div className="error-message">
          {feedbackError || statsError}
        </div>
      )}

      {/* Emoji选择器 - Emoji Selector */}
      <div className="emoji-selector">
        <div className="emoji-grid">
          {[1, 2, 3, 4, 5].map((rating) => (
            <EmojiButton key={rating} rating={rating as EmojiRating} />
          ))}
        </div>
      </div>

      {/* 平台统计信息 - Platform Statistics */}
      {statistics && !statsError && (
        <div className="feedback-stats">
          <div className="stats-summary">
            <span className="total-feedback">{statistics.totalFeedback} total responses</span>
            <span className="average-rating">Avg: {statistics.averageRating.toFixed(1)}/5</span>
          </div>
        </div>
      )}

      {/* 用户反馈确认 - User Feedback Confirmation */}
      {feedback && (
        <div className="user-feedback-status">
          <div className="status-message">
            ✅ Your feedback: {EMOJI_RATINGS[feedback.overallRating]} 
            <span className="feedback-date">
              {new Date(feedback.createdAt || '').toLocaleDateString()}
            </span>
          </div>
        </div>
      )}

      {/* 长按提示 - Long Press Hint */}
      {feedback && pressedEmoji && (
        <div className="long-press-hint">
          🗑️ Keep holding to remove your feedback...
        </div>
      )}

      {/* 提交状态 - Submission Status */}
      {isSubmitting && (
        <div className="submission-status">
          Updating your feedback...
        </div>
      )}

      {/* 底部说明 - Footer Note */}
      <div className="feedback-footer">
        <p className="privacy-note">
          Anonymous feedback • Helps improve our platform
        </p>
      </div>
    </div>
  );
};

export default FeedbackWidget;