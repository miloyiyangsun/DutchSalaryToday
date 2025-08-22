package com.dutchsalarytoday.dutch_salary_today.dto;

import java.time.LocalDateTime;

/**
 * 平台反馈响应DTO - Emoji简化版
 * 用于返回emoji评分数据给前端
 */
public class FeedbackResponse {
    
    private Long id;
    private String userId;
    private Integer overallRating;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // 构造函数
    public FeedbackResponse() {}
    
    public FeedbackResponse(Long id, String userId, Integer overallRating, 
                          LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.userId = userId;
        this.overallRating = overallRating;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public Integer getOverallRating() { return overallRating; }
    public void setOverallRating(Integer overallRating) { this.overallRating = overallRating; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}