// useOptimisticFeedback.ts - 乐观更新emoji反馈系统Hook
// Optimistic emoji feedback system custom hook with immediate UI updates

import { useState, useCallback, useRef } from 'react';
import { useFeedback, useFeedbackStatistics } from './index';
import type { FeedbackStatistics, EmojiRating, FeedbackRequest } from '../types/feedback';

interface OptimisticFeedbackResult {
  // 乐观状态数据 - Optimistic State Data
  optimisticStats: FeedbackStatistics | null;
  currentUserRating: EmojiRating | null;
  
  // 加载和错误状态 - Loading & Error States
  isInitialLoading: boolean;  // 初始加载：显示loading UI
  isUpdating: boolean;        // 交互更新：显示微妙spinner
  error: string | null;
  
  // 操作函数 - Action Functions
  handleOptimisticClick: (rating: EmojiRating) => Promise<void>;
  handleOptimisticDelete: () => Promise<void>;
  
  // 长按相关 - Long Press Related
  pressedEmoji: EmojiRating | null;
  handleMouseDown: (rating: EmojiRating) => void;
  handleMouseUp: () => void;
}

export function useOptimisticFeedback(): OptimisticFeedbackResult {
  // 原始Hook状态 - Original Hook States
  const { 
    feedback, 
    loading: feedbackLoading, 
    error: feedbackError, 
    submitFeedback, 
    updateFeedback, 
    deleteFeedback 
  } = useFeedback();
  
  const { 
    statistics, 
    loading: statsLoading, 
    error: statsError, 
    refetch: refetchStatistics 
  } = useFeedbackStatistics();

  // 乐观更新状态 - Optimistic Update States
  const [optimisticStats, setOptimisticStats] = useState<FeedbackStatistics | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [optimisticError, setOptimisticError] = useState<string | null>(null);
  
  // 长按检测状态 - Long Press Detection States
  const [pressedEmoji, setPressedEmoji] = useState<EmojiRating | null>(null);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 初始化时同步数据 - Initialize optimistic stats with real data
  if (!optimisticStats && statistics) {
    setOptimisticStats(statistics);
  }

  // 同步乐观状态与真实统计数据 - Sync optimistic state when not updating
  if (statistics && optimisticStats && !isUpdating) {
    // 确保不在更新状态时才同步，避免覆盖乐观状态
    if (JSON.stringify(statistics) !== JSON.stringify(optimisticStats)) {
      setOptimisticStats(statistics);
    }
  }

  // 创建乐观统计数据 - Create optimistic statistics
  const createOptimisticStats = useCallback((
    baseStats: FeedbackStatistics,
    newRating: EmojiRating,
    oldRating: EmojiRating | null
  ): FeedbackStatistics => {
    const newDistribution = { ...baseStats.emojiDistribution };
    
    // 移除旧评分 - Remove old rating
    if (oldRating) {
      newDistribution[oldRating] = Math.max(0, newDistribution[oldRating] - 1);
    }
    
    // 添加新评分 - Add new rating
    newDistribution[newRating] = newDistribution[newRating] + 1;
    
    // 重新计算总数和平均值 - Recalculate total and average
    const totalFeedback = Object.values(newDistribution).reduce((sum, count) => sum + count, 0);
    const weightedSum = Object.entries(newDistribution).reduce(
      (sum, [rating, count]) => sum + (parseInt(rating) * count), 0
    );
    const averageRating = totalFeedback > 0 ? weightedSum / totalFeedback : 0;
    
    return {
      totalFeedback,
      averageRating,
      emojiDistribution: newDistribution
    };
  }, []);

  // 乐观点击处理 - Optimistic Click Handler
  const handleOptimisticClick = useCallback(async (rating: EmojiRating) => {
    if (isUpdating || !optimisticStats) return;

    const currentRating = feedback?.overallRating || null;
    
    // 如果点击相同的emoji，不做任何操作
    if (currentRating === rating) return;

    try {
      setIsUpdating(true);
      setOptimisticError(null);

      // 立即更新乐观状态 - Immediately update optimistic state
      const newOptimisticStats = createOptimisticStats(optimisticStats, rating, currentRating);
      setOptimisticStats(newOptimisticStats);

      // 后台同步数据 - Background data sync
      const feedbackRequest: FeedbackRequest = {
        userId: '', // 将在useFeedback hook中填充
        overallRating: rating
      };

      if (feedback?.id) {
        await updateFeedback(feedback.id, feedbackRequest);
      } else {
        await submitFeedback(feedbackRequest);
      }

      // 成功后刷新真实数据 - Refresh real data on success
      await refetchStatistics();
      
    } catch (error) {
      console.error('Optimistic emoji feedback error:', error);
      
      // 错误回滚 - Error rollback
      if (statistics) {
        setOptimisticStats(statistics);
      }
      setOptimisticError(error instanceof Error ? error.message : 'Failed to update feedback');
    } finally {
      setIsUpdating(false);
    }
  }, [isUpdating, optimisticStats, feedback, createOptimisticStats, updateFeedback, submitFeedback, refetchStatistics, statistics]);

  // 乐观删除处理 - Optimistic Delete Handler
  const handleOptimisticDelete = useCallback(async () => {
    if (!feedback?.id || !optimisticStats) return;

    const currentRating = feedback.overallRating;

    try {
      setIsUpdating(true);
      setOptimisticError(null);

      // 立即更新乐观状态 - Immediately update optimistic state
      const newDistribution = { ...optimisticStats.emojiDistribution };
      newDistribution[currentRating] = Math.max(0, newDistribution[currentRating] - 1);
      
      const totalFeedback = Math.max(0, optimisticStats.totalFeedback - 1);
      const newOptimisticStats: FeedbackStatistics = {
        totalFeedback,
        averageRating: totalFeedback > 0 ? optimisticStats.averageRating : 0, // 简化计算
        emojiDistribution: newDistribution
      };
      
      setOptimisticStats(newOptimisticStats);

      // 后台删除数据 - Background delete operation
      await deleteFeedback(feedback.id);
      
      // 成功后刷新真实数据 - Refresh real data on success
      await refetchStatistics();
      
    } catch (error) {
      console.error('Optimistic emoji feedback deletion error:', error);
      
      // 错误回滚 - Error rollback
      if (statistics) {
        setOptimisticStats(statistics);
      }
      setOptimisticError(error instanceof Error ? error.message : 'Failed to delete feedback');
    } finally {
      setIsUpdating(false);
      setPressedEmoji(null);
    }
  }, [feedback, optimisticStats, deleteFeedback, refetchStatistics, statistics]);

  // 长按开始 - Long Press Start
  const handleMouseDown = useCallback((rating: EmojiRating) => {
    if (!feedback || feedback.overallRating !== rating) return;
    
    setPressedEmoji(rating);
    pressTimerRef.current = setTimeout(async () => {
      await handleOptimisticDelete();
    }, 1000); // 1秒长按
  }, [feedback, handleOptimisticDelete]);

  // 长按结束 - Long Press End
  const handleMouseUp = useCallback(() => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    setPressedEmoji(null);
  }, []);

  // 确定初始加载状态 - Determine initial loading state
  const isInitialLoading = (feedbackLoading || statsLoading) && !optimisticStats;
  
  // 合并错误状态 - Merge error states
  const combinedError = optimisticError || feedbackError || statsError;

  return {
    // 状态数据 - State Data
    optimisticStats: optimisticStats || statistics,
    currentUserRating: feedback?.overallRating || null,
    
    // 状态标志 - State Flags
    isInitialLoading,
    isUpdating,
    error: combinedError,
    
    // 操作函数 - Action Functions
    handleOptimisticClick,
    handleOptimisticDelete,
    
    // 长按相关 - Long Press Related
    pressedEmoji,
    handleMouseDown,
    handleMouseUp,
  };
}