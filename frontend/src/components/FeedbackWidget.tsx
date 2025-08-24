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

  // Emoji按钮组件 - 完全按照SuperDesign样式
  const EmojiButton: React.FC<{ rating: EmojiRating }> = ({ rating }) => {
    const emoji = EMOJI_RATINGS[rating];
    const count = statistics?.emojiDistribution[rating] || 0;
    const isSelected = feedback?.overallRating === rating;
    const isPressed = pressedEmoji === rating;
    
    return (
      <div className="emoji-feedback-container text-center">
        <span 
          className={`emoji-feedback ${isSelected ? 'selected' : ''} ${isPressed ? 'pressed' : ''}`}
          onClick={() => handleEmojiClick(rating)}
          onMouseDown={() => handleMouseDown(rating)}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={() => handleMouseDown(rating)}
          onTouchEnd={handleMouseUp}
          style={{ 
            pointerEvents: isSubmitting ? 'none' : 'auto',
            opacity: isSubmitting ? 0.5 : undefined 
          }}
          title={rating === 1 ? 'Poor' : rating === 2 ? 'Okay' : rating === 3 ? 'Good' : rating === 4 ? 'Great' : 'Love it!'}
        >
          {emoji}
        </span>
        <div className="emoji-count mt-2 text-sm text-gray-400">
          <span className="count">{count}</span>
        </div>
      </div>
    );
  };

  // 加载状态 - Loading State
  if (feedbackLoading || statsLoading) {
    return (
      <div className={`feedback-section ${className}`}>
        <div className="small-annotation">Loading emoji feedback...</div>
      </div>
    );
  }

  return (
    <div className={`dutch-gradient-card rounded-3xl p-8 border-2 border-orange-500/30 text-center ${className}`}>
      {/* 反馈系统标题 - 匹配参考设计 */}
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center justify-center">
        <span className="mr-3">💬</span>
        Your Feedback
      </h3>
      <p className="text-gray-300 text-lg mb-8">How useful were these salary insights?</p>

      {/* 错误显示 - Error Display */}
      {(feedbackError || statsError) && (
        <div className="error-display">
          {feedbackError || statsError}
        </div>
      )}

      {/* Emoji选择器 - 匹配参考设计 */}
      <div className="flex justify-center gap-8 mb-6">
        {[1, 2, 3, 4, 5].map((rating) => (
          <EmojiButton key={rating} rating={rating as EmojiRating} />
        ))}
      </div>
      
      {/* 底部说明 - 匹配参考设计 */}
      <p className="text-gray-500 text-sm mt-4">Tap an emoji to share your feedback</p>
    </div>
  );
};

export default FeedbackWidget;