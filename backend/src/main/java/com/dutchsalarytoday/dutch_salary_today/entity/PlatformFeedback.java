package com.dutchsalarytoday.dutch_salary_today.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * JPA实体类 - 平台用户反馈 (Emoji简化版)
 * 支持极简1-5 emoji评分的完整CRUD操作
 * 使用UUID用户识别，无需注册登录
 */
@Entity
@Table(name = "platform_feedback")
public class PlatformFeedback {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // 用户识别字段
    @Column(name = "user_id", nullable = false, length = 36)
    private String userId;
    
    // emoji评分字段 (1-5)
    @Column(name = "overall_rating", nullable = false)
    private Integer overallRating;
    
    // 系统管理字段
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    // 默认构造函数 (JPA要求)
    public PlatformFeedback() {}
    
    // 业务构造函数 - emoji评分版
    public PlatformFeedback(String userId, Integer overallRating) {
        this.userId = userId;
        this.overallRating = overallRating;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.isActive = true;
    }
    
    // JPA生命周期回调方法
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (isActive == null) {
            isActive = true;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Getter和Setter方法
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public Integer getOverallRating() {
        return overallRating;
    }
    
    public void setOverallRating(Integer overallRating) {
        this.overallRating = overallRating;
    }
    
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    // 业务辅助方法
    public boolean isActive() {
        return Boolean.TRUE.equals(isActive);
    }
    
    public void markAsDeleted() {
        this.isActive = false;
        this.updatedAt = LocalDateTime.now();
    }
    
    @Override
    public String toString() {
        return "PlatformFeedback{" +
                "id=" + id +
                ", userId='" + userId + '\'' +
                ", emojiRating=" + overallRating +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", isActive=" + isActive +
                '}';
    }
}