// FeedbackWidget.tsx - Emoji反馈系统主组件
// Main emoji feedback system component - simplified interaction

import React from 'react';
import { useOptimisticFeedback } from '../hooks';
import { EMOJI_RATINGS, type EmojiRating } from '../types/feedback';

interface FeedbackWidgetProps {
  className?: string;
}

const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({ className = '' }) => {
  // 乐观更新状态管理 - Optimistic Update State Management
  const {
    optimisticStats,
    currentUserRating,
    isInitialLoading,
    isUpdating,
    error,
    handleOptimisticClick,
    pressedEmoji,
    handleMouseDown,
    handleMouseUp,
  } = useOptimisticFeedback();

  // Emoji点击处理 - 使用乐观更新
  // Emoji Click Handler - Using optimistic updates
  const handleEmojiClick = async (rating: EmojiRating) => {
    await handleOptimisticClick(rating);
  };

  // 长按处理已经在useOptimisticFeedback hook中实现
  // Long press handling is already implemented in useOptimisticFeedback hook

  // Emoji按钮组件 - 使用乐观状态数据
  const EmojiButton: React.FC<{ rating: EmojiRating }> = ({ rating }) => {
    const emoji = EMOJI_RATINGS[rating];
    const count = optimisticStats?.emojiDistribution[rating] || 0;
    const isSelected = currentUserRating === rating;
    const isPressed = pressedEmoji === rating;
    
    return (
      <div className="emoji-feedback-container text-center">
        <span 
          className={`emoji-feedback ${isSelected ? 'selected' : ''} ${isPressed ? 'pressed' : ''} ${isUpdating ? 'updating' : ''}`}
          onClick={() => handleEmojiClick(rating)}
          onMouseDown={() => handleMouseDown(rating)}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={() => handleMouseDown(rating)}
          onTouchEnd={handleMouseUp}
          style={{ 
            pointerEvents: isInitialLoading ? 'none' : 'auto',
            opacity: isInitialLoading ? 0.5 : undefined 
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

  // 初始加载状态 - 只有在初始加载时显示loading UI
  // Initial Loading State - Only show loading UI during initial load
  if (isInitialLoading) {
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
      {error && (
        <div className="error-display mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Emoji选择器 - 匹配参考设计 */}
      <div className="flex justify-center gap-8 mb-6">
        {[1, 2, 3, 4, 5].map((rating) => (
          <EmojiButton key={rating} rating={rating as EmojiRating} />
        ))}
      </div>
      
      {/* 底部说明 - 匹配参考设计 */}
      <p className="text-gray-500 text-sm mt-4">
        Tap an emoji to share your feedback
      </p>
    </div>
  );
};

export default FeedbackWidget;