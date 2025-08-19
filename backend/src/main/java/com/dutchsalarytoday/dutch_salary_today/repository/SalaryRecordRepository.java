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
    
    // 9. 工时分析专用查询 - 查询特定年份工时和FTE数据完整的记录
    @Query("SELECT s FROM SalaryRecord s WHERE s.yearPeriod = :year AND s.hoursWorked IS NOT NULL AND s.fullTimeEquivalentFte IS NOT NULL")
    List<SalaryRecord> findByYearPeriodAndWorkHoursNotNull(@Param("year") Integer year);
    
    // 10. 时薪分析专用查询 - 查询特定年份时薪数据完整的记录
    @Query("SELECT s FROM SalaryRecord s WHERE s.yearPeriod = :year AND s.compensationPerHourWorked IS NOT NULL")
    List<SalaryRecord> findByYearPeriodAndHourlyCompensationNotNull(@Param("year") Integer year);
    
    // 11. 综合工时时薪分析查询 - 获取工时、FTE、时薪三项数据都完整的记录
    @Query("SELECT s FROM SalaryRecord s WHERE s.yearPeriod = :year AND s.hoursWorked IS NOT NULL AND s.fullTimeEquivalentFte IS NOT NULL AND s.compensationPerHourWorked IS NOT NULL")
    List<SalaryRecord> findByYearPeriodAndCompleteWorkHoursData(@Param("year") Integer year);
    
    // 12. 性别分析专用查询 - Story 3: Gender Power Rise
    // 查询特定年份性别数据完整的记录
    @Query("SELECT s FROM SalaryRecord s WHERE s.yearPeriod = :year AND s.male IS NOT NULL AND s.female IS NOT NULL AND s.total IS NOT NULL")
    List<SalaryRecord> findByYearPeriodAndGenderDataNotNull(@Param("year") Integer year);
    
    // 13. 查询年份区间内性别数据完整的记录 - 用于女性力量历史趋势分析
    @Query("SELECT s FROM SalaryRecord s WHERE s.yearPeriod BETWEEN :startYear AND :endYear AND s.male IS NOT NULL AND s.female IS NOT NULL AND s.total IS NOT NULL")
    List<SalaryRecord> findByYearPeriodBetweenAndGenderDataNotNull(
        @Param("startYear") Integer startYear, 
        @Param("endYear") Integer endYear
    );
    
    // 14. 查询指定年份列表中性别数据完整的记录 - 用于跨年份对比分析
    @Query("SELECT s FROM SalaryRecord s WHERE s.yearPeriod IN :years AND s.male IS NOT NULL AND s.female IS NOT NULL AND s.total IS NOT NULL ORDER BY s.yearPeriod, s.title")
    List<SalaryRecord> findByYearPeriodInAndGenderDataNotNull(@Param("years") List<Integer> years);
    
    // 15. 工作密集化分析专用查询 - Story 4: Work Intensification Revolution
    // 查询特定年份工作密集化数据完整的记录 (FTE + Total字段)
    @Query("SELECT s FROM SalaryRecord s WHERE s.yearPeriod = :year AND s.fullTimeEquivalentFte IS NOT NULL AND s.total IS NOT NULL")
    List<SalaryRecord> findByYearPeriodAndWorkIntensificationDataNotNull(@Param("year") Integer year);
    
    // 16. 隐形成本分析专用查询 - Story 5: Hidden Labor Costs
    // 查询特定年份隐形成本数据完整的记录 (雇主社保支出 + 总薪酬)
    @Query("SELECT s FROM SalaryRecord s WHERE s.yearPeriod = :year AND s.employersSocialContributions IS NOT NULL AND s.compensationOfEmployees IS NOT NULL")
    List<SalaryRecord> findByYearPeriodAndHiddenCostDataNotNull(@Param("year") Integer year);
    
    // 17. 查询年份区间内隐形成本数据完整的记录 - 用于趋势分析(2010-2024)
    @Query("SELECT s FROM SalaryRecord s WHERE s.yearPeriod BETWEEN :startYear AND :endYear AND s.employersSocialContributions IS NOT NULL AND s.compensationOfEmployees IS NOT NULL")
    List<SalaryRecord> findByYearPeriodBetweenAndHiddenCostDataNotNull(
        @Param("startYear") Integer startYear, 
        @Param("endYear") Integer endYear
    );
    
    // 18. 查询指定年份列表中隐形成本数据完整的记录 - 用于跨年份对比分析
    @Query("SELECT s FROM SalaryRecord s WHERE s.yearPeriod IN :years AND s.employersSocialContributions IS NOT NULL AND s.compensationOfEmployees IS NOT NULL ORDER BY s.yearPeriod, s.title")
    List<SalaryRecord> findByYearPeriodInAndHiddenCostDataNotNull(@Param("years") List<Integer> years);
}