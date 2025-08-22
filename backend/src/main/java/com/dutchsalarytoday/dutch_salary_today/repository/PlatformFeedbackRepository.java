package com.dutchsalarytoday.dutch_salary_today.repository;

import com.dutchsalarytoday.dutch_salary_today.entity.PlatformFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 平台反馈数据访问接口 - Emoji简化版
 * 支持完整CRUD操作和emoji统计查询
 * 
 * CRUD映射:
 * CREATE - save(entity)
 * READ - findByUserIdAndIsActiveTrue()
 * UPDATE - save(entity) with existing ID
 * DELETE - markAsDeleted() (软删除)
 */
@Repository
public interface PlatformFeedbackRepository extends JpaRepository<PlatformFeedback, Long> {
    
    // ==================== CRUD 核心查询方法 ====================
    
    /**
     * 查询用户的活跃反馈记录 (READ操作)
     * 用于检查用户是否已有反馈和获取现有反馈内容
     */
    Optional<PlatformFeedback> findByUserIdAndIsActiveTrue(String userId);
    
    /**
     * 查询用户的所有反馈记录 (包含已删除)
     * 用于管理后台数据分析
     */
    List<PlatformFeedback> findByUserIdOrderByCreatedAtDesc(String userId);
    
    /**
     * 查询所有活跃的反馈记录
     * 用于统计分析和数据展示
     */
    List<PlatformFeedback> findByIsActiveTrueOrderByCreatedAtDesc();
    
    // ==================== 统计查询方法 ====================
    
    /**
     * 计算emoji平均评分
     * 用于Homepage统计展示
     */
    @Query("SELECT AVG(pf.overallRating) FROM PlatformFeedback pf WHERE pf.isActive = true")
    Double findAverageRating();
    
    /**
     * 统计活跃emoji反馈总数
     * 用于Homepage统计展示
     */
    @Query("SELECT COUNT(pf) FROM PlatformFeedback pf WHERE pf.isActive = true")
    Long countActiveFeedback();
    
    /**
     * 按emoji评分统计分布
     * 用于分析用户emoji反馈分布
     */
    @Query("SELECT pf.overallRating, COUNT(pf) FROM PlatformFeedback pf WHERE pf.isActive = true GROUP BY pf.overallRating ORDER BY pf.overallRating")
    List<Object[]> findRatingDistribution();
    
    /**
     * 查询指定emoji评分的反馈数量
     * 用于emoji统计分布计算
     */
    Long countByOverallRatingAndIsActiveTrue(Integer overallRating);
    
    // ==================== 业务辅助查询方法 ====================
    
    /**
     * 检查用户是否已提交反馈
     * 用于前端判断显示创建或编辑表单
     */
    boolean existsByUserIdAndIsActiveTrue(String userId);
    
    /**
     * 查询最新的N条反馈 (用于展示)
     * 用于管理后台最新反馈展示
     */
    @Query("SELECT pf FROM PlatformFeedback pf WHERE pf.isActive = true ORDER BY pf.createdAt DESC")
    List<PlatformFeedback> findLatestFeedback(org.springframework.data.domain.Pageable pageable);
    
    /**
     * 查询高emoji评分反馈 (4-5分: 😃🤩)
     * 用于优质emoji反馈分析
     */
    @Query("SELECT pf FROM PlatformFeedback pf WHERE pf.isActive = true AND pf.overallRating >= 4 ORDER BY pf.createdAt DESC")
    List<PlatformFeedback> findHighRatingFeedback();
}