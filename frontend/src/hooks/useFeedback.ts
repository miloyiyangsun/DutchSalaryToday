// useFeedback.ts - 平台emoji反馈数据Hook
// Platform emoji feedback data custom hook

import { useState, useEffect, useCallback } from "react";
import type { FeedbackData, FeedbackRequest, FeedbackHookResult } from "../types/feedback";
import { 
  fetchUserFeedback, 
  submitFeedback, 
  updateFeedback, 
  deleteFeedback 
} from "../services/api";

// 用户UUID管理 - 本地存储
// User UUID management - localStorage
function getUserId(): string {
  const existingUserId = localStorage.getItem('platform_user_id');
  if (existingUserId) {
    return existingUserId;
  }
  
  // 生成新UUID (简化版)
  const newUserId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
  
  localStorage.setItem('platform_user_id', newUserId);
  return newUserId;
}

export function useFeedback(): FeedbackHookResult {
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const userId = getUserId(); // 获取或生成用户ID

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchUserFeedback(userId);

      if (result.error) {
        setError(result.error);
        setFeedback(null);
      } else {
        setFeedback(result.data || null);
      }
    } catch (err) {
      setError("Failed to fetch emoji feedback data");
      setFeedback(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // CREATE操作 - 提交新emoji反馈
  const handleSubmitFeedback = useCallback(async (request: FeedbackRequest) => {
    try {
      setLoading(true);
      setError(null);

      // 确保使用当前用户ID
      const feedbackRequest = { ...request, userId };
      const result = await submitFeedback(feedbackRequest);

      if (result.error) {
        setError(result.error);
        throw new Error(result.error);
      } else if (result.data) {
        setFeedback(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit emoji feedback");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // UPDATE操作 - 更新现有emoji反馈
  const handleUpdateFeedback = useCallback(async (feedbackId: number, request: FeedbackRequest) => {
    try {
      setLoading(true);
      setError(null);

      // 确保使用当前用户ID
      const feedbackRequest = { ...request, userId };
      const result = await updateFeedback(feedbackId, feedbackRequest);

      if (result.error) {
        setError(result.error);
        throw new Error(result.error);
      } else if (result.data) {
        setFeedback(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update emoji feedback");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // DELETE操作 - 删除emoji反馈
  const handleDeleteFeedback = useCallback(async (feedbackId: number) => {
    try {
      setLoading(true);
      setError(null);

      const result = await deleteFeedback(feedbackId);

      if (result.error) {
        setError(result.error);
        throw new Error(result.error);
      } else {
        setFeedback(null); // 清除本地状态
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete emoji feedback");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 组件挂载时获取数据
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    feedback,
    loading,
    error,
    submitFeedback: handleSubmitFeedback,
    updateFeedback: handleUpdateFeedback,
    deleteFeedback: handleDeleteFeedback,
    refetch: fetchData,
  };
}