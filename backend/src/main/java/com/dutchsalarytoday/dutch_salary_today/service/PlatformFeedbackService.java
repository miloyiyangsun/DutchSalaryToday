package com.dutchsalarytoday.dutch_salary_today.service;

import com.dutchsalarytoday.dutch_salary_today.entity.PlatformFeedback;
import com.dutchsalarytoday.dutch_salary_today.repository.PlatformFeedbackRepository;
import com.dutchsalarytoday.dutch_salary_today.dto.FeedbackRequest;
import com.dutchsalarytoday.dutch_salary_today.dto.FeedbackResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;

/**
 * 平台反馈业务逻辑服务 - Emoji简化版
 * 模仿SalaryService架构模式，提供完整CRUD操作
 */
@Service
@Transactional(readOnly = true)
public class PlatformFeedbackService {
    
    private final PlatformFeedbackRepository feedbackRepository;
    
    @Autowired
    public PlatformFeedbackService(PlatformFeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }
    
    /**
     * 创建新反馈 - CREATE操作
     */
    @Transactional
    public FeedbackResponse createFeedback(FeedbackRequest request) {
        // 简单验证
        validateFeedbackRequest(request);
        
        // 检查用户是否已有活跃反馈
        if (feedbackRepository.existsByUserIdAndIsActiveTrue(request.getUserId())) {
            throw new IllegalArgumentException("User already has active feedback");
        }
        
        // 创建实体 - emoji评分版
        PlatformFeedback feedback = new PlatformFeedback(
            request.getUserId(), 
            request.getOverallRating()
        );
        
        // 保存并返回
        PlatformFeedback saved = feedbackRepository.save(feedback);
        return convertToResponse(saved);
    }
    
    /**
     * 获取用户反馈 - READ操作
     */
    public Optional<FeedbackResponse> getUserFeedback(String userId) {
        return feedbackRepository.findByUserIdAndIsActiveTrue(userId)
                .map(this::convertToResponse);
    }
    
    /**
     * 更新反馈 - UPDATE操作
     */
    @Transactional
    public FeedbackResponse updateFeedback(Long feedbackId, FeedbackRequest request) {
        validateFeedbackRequest(request);
        
        PlatformFeedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new IllegalArgumentException("Feedback not found"));
        
        if (!feedback.isActive()) {
            throw new IllegalArgumentException("Cannot update deleted feedback");
        }
        
        // 更新emoji评分
        feedback.setOverallRating(request.getOverallRating());
        
        PlatformFeedback saved = feedbackRepository.save(feedback);
        return convertToResponse(saved);
    }
    
    /**
     * 删除反馈 - DELETE操作 (软删除)
     */
    @Transactional
    public void deleteFeedback(Long feedbackId) {
        PlatformFeedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new IllegalArgumentException("Feedback not found"));
        
        feedback.markAsDeleted();
        feedbackRepository.save(feedback);
    }
    
    /**
     * 获取emoji反馈统计信息
     */
    public Map<String, Object> getFeedbackStatistics() {
        Double avgRating = feedbackRepository.findAverageRating();
        Long totalCount = feedbackRepository.countActiveFeedback();
        
        // 获取emoji分布统计
        Map<Integer, Long> emojiDistribution = Map.of(
            1, feedbackRepository.countByOverallRatingAndIsActiveTrue(1),
            2, feedbackRepository.countByOverallRatingAndIsActiveTrue(2),
            3, feedbackRepository.countByOverallRatingAndIsActiveTrue(3),
            4, feedbackRepository.countByOverallRatingAndIsActiveTrue(4),
            5, feedbackRepository.countByOverallRatingAndIsActiveTrue(5)
        );
        
        return Map.of(
            "totalFeedback", totalCount != null ? totalCount : 0L,
            "averageRating", avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0,
            "emojiDistribution", emojiDistribution
        );
    }
    
    // 私有辅助方法
    private void validateFeedbackRequest(FeedbackRequest request) {
        if (request.getUserId() == null || request.getUserId().trim().isEmpty()) {
            throw new IllegalArgumentException("User ID cannot be empty");
        }
        if (request.getOverallRating() == null || request.getOverallRating() < 1 || request.getOverallRating() > 5) {
            throw new IllegalArgumentException("Emoji rating must be between 1-5");
        }
    }
    
    private FeedbackResponse convertToResponse(PlatformFeedback feedback) {
        return new FeedbackResponse(
            feedback.getId(),
            feedback.getUserId(),
            feedback.getOverallRating(),
            feedback.getCreatedAt(),
            feedback.getUpdatedAt()
        );
    }
}