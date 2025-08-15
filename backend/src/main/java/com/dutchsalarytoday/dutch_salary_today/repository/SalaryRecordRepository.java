package com.dutchsalarytoday.dutch_salary_today.repository;

import com.dutchsalarytoday.dutch_salary_today.entity.SalaryRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * SalaryRecord数据访问层接口
 * 提供荷兰薪资数据的查询方法，支持业务逻辑层的数据需求
 */
@Repository
public interface SalaryRecordRepository extends JpaRepository<SalaryRecord, Long> {
    
    // 1. 按年份查询 - 用于特定年份数据获取
    List<SalaryRecord> findByYearPeriod(Integer yearPeriod);
    
    // 2. 按行业名称查询 - 支持模糊匹配
    List<SalaryRecord> findByTitleContainingIgnoreCase(String title);
    
    // 3. 按年份区间查询 - 用于增长率计算 (2010-2024年)
    List<SalaryRecord> findByYearPeriodBetween(Integer startYear, Integer endYear);
    
    // 4. 按年份区间查询且薪资非空 - 确保数据完整性
    @Query("SELECT s FROM SalaryRecord s WHERE s.yearPeriod BETWEEN :startYear AND :endYear AND s.wagesPerFte IS NOT NULL")
    List<SalaryRecord> findByYearPeriodBetweenAndWagesPerFteNotNull(
        @Param("startYear") Integer startYear, 
        @Param("endYear") Integer endYear
    );
    
    // 5. 查询特定年份范围内的特定行业数据 - 用于增长冠军计算
    @Query("SELECT s FROM SalaryRecord s WHERE s.yearPeriod IN :years AND s.title = :title AND s.wagesPerFte IS NOT NULL")
    List<SalaryRecord> findByYearPeriodInAndTitleAndWagesPerFteNotNull(
        @Param("years") List<Integer> years, 
        @Param("title") String title
    );
    
    // 6. 按年份查询且薪资非空 - 用于单年份统计
    @Query("SELECT s FROM SalaryRecord s WHERE s.yearPeriod = :year AND s.wagesPerFte IS NOT NULL")
    List<SalaryRecord> findByYearPeriodAndWagesPerFteNotNull(@Param("year") Integer year);
    
    // 7. 查询所有有效的行业名称 - 用于行业列表
    @Query("SELECT DISTINCT s.title FROM SalaryRecord s WHERE s.wagesPerFte IS NOT NULL ORDER BY s.title")
    List<String> findDistinctValidIndustries();
    
    // 8. 查询指定年份区间内所有有效的行业名称
    @Query("SELECT DISTINCT s.title FROM SalaryRecord s WHERE s.yearPeriod BETWEEN :startYear AND :endYear AND s.wagesPerFte IS NOT NULL ORDER BY s.title")
    List<String> findDistinctValidIndustriesByYearRange(
        @Param("startYear") Integer startYear, 
        @Param("endYear") Integer endYear
    );
}