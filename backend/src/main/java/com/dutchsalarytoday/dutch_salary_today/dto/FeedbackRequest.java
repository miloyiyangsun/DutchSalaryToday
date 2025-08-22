package com.dutchsalarytoday.dutch_salary_today.dto;

import jakarta.validation.constraints.*;

/**
 * 平台反馈请求DTO - Emoji简化版
 * 用于接收前端提交的emoji评分数据
 */
public class FeedbackRequest {
    
    @NotBlank(message = "User ID cannot be empty")
    private String userId;
    
    @NotNull(message = "Emoji rating cannot be null")
    @Min(value = 1, message = "Emoji rating must be between 1-5")
    @Max(value = 5, message = "Emoji rating must be between 1-5")
    private Integer overallRating;
    
    // 构造函数
    public FeedbackRequest() {}
    
    public FeedbackRequest(String userId, Integer overallRating) {
        this.userId = userId;
        this.overallRating = overallRating;
    }
    
    // Getters & Setters
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public Integer getOverallRating() { return overallRating; }
    public void setOverallRating(Integer overallRating) { this.overallRating = overallRating; }
}