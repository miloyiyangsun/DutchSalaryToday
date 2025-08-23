// 平台反馈系统类型定义 - Emoji评分版本
// Platform Feedback System Type Definitions - Emoji Rating Version
// API endpoints: /api/v1/feedback/*

/**
 * Emoji评分映射 - 1-5对应不同emoji (按照SuperDesign标准)
 */
export const EMOJI_RATINGS = {
  1: '😞', // Poor
  2: '😕', // Okay
  3: '😐', // Good
  4: '😊', // Great
  5: '😍'  // Love it!
} as const;

export type EmojiRating = keyof typeof EMOJI_RATINGS;

/**
 * 反馈数据接口 - 对应后端FeedbackResponse
 */
export interface FeedbackData {
  id?: number;
  userId: string;
  overallRating: EmojiRating; // 1-5 emoji评分
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 反馈请求接口 - 对应后端FeedbackRequest  
 */
export interface FeedbackRequest {
  userId: string;
  overallRating: EmojiRating; // 1-5 emoji评分
}

/**
 * 平台统计数据接口 - 对应GET /api/v1/feedback/statistics
 */
export interface FeedbackStatistics {
  totalFeedback: number;           // 总反馈数
  averageRating: number;           // 平均评分
  emojiDistribution: {             // Emoji分布统计
    1: number;  // 😞 数量
    2: number;  // 😕 数量
    3: number;  // 😐 数量
    4: number;  // 😊 数量
    5: number;  // 😍 数量
  };
}

/**
 * 反馈Hook返回类型 - useFeedback
 */
export interface FeedbackHookResult {
  feedback: FeedbackData | null;
  loading: boolean;
  error: string | null;
  submitFeedback: (request: FeedbackRequest) => Promise<void>;
  updateFeedback: (feedbackId: number, request: FeedbackRequest) => Promise<void>;
  deleteFeedback: (feedbackId: number) => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * 统计Hook返回类型 - useFeedbackStatistics
 */
export interface FeedbackStatisticsHookResult {
  statistics: FeedbackStatistics | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * 反馈表单状态类型 - 简化版
 */
export interface FeedbackFormState {
  selectedEmoji: EmojiRating | null;
  isSubmitting: boolean;
}

/**
 * 用户状态类型
 */
export interface UserState {
  userId: string;
  hasExistingFeedback: boolean;
  existingFeedback?: FeedbackData;
}

/**
 * Emoji按钮状态类型
 */
export interface EmojiButtonState {
  emoji: string;
  rating: EmojiRating;
  count: number;
  isSelected: boolean;
  isActive: boolean;
}