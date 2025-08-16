package com.dutchsalarytoday.dutch_salary_today.service;

import com.dutchsalarytoday.dutch_salary_today.entity.SalaryRecord;
import com.dutchsalarytoday.dutch_salary_today.repository.SalaryRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 薪资数据业务逻辑服务
 * 
 * 参考业务逻辑: /data_analysis/interactive_crosstab_app.py
 * 核心功能: 增长冠军计算、薪资差距分析、行业排名统计
 */
@Service
@Transactional(readOnly = true)
public class SalaryService {
    
    private final SalaryRecordRepository salaryRecordRepository;
    
    // 业务常量 - 基于interactive_crosstab_app.py分析
    private static final int START_YEAR = 2010;
    private static final int END_YEAR = 2024;
    
    @Autowired
    public SalaryService(SalaryRecordRepository salaryRecordRepository) {
        this.salaryRecordRepository = salaryRecordRepository;
    }
    
    /**
     * 获取核心洞察数据
     * 参考: interactive_crosstab_app.py的display_core_insights()方法
     * 
     * @return 包含增长冠军、增长最慢、薪资差距倍数的核心洞察
     */
    public Map<String, Object> getCoreInsights() {
        // 获取2010-2024年有效数据
        List<SalaryRecord> validRecords = salaryRecordRepository
            .findByYearPeriodBetweenAndWagesPerFteNotNull(START_YEAR, END_YEAR);
        
        // 按行业分组计算增长率
        Map<String, List<SalaryRecord>> industryRecords = validRecords.stream()
            .collect(Collectors.groupingBy(SalaryRecord::getTitle));
        
        // 计算各行业的增长率
        List<Map<String, Object>> growthData = calculateGrowthRates(industryRecords);
        
        // 筛选有效行业（2010和2024年都有数据）
        List<Map<String, Object>> validGrowthData = growthData.stream()
            .filter(data -> data.get("startSalary") != null && data.get("endSalary") != null)
            .collect(Collectors.toList());
        
        if (validGrowthData.isEmpty()) {
            return createEmptyInsights();
        }
        
        // 1. Growth Champion (增长冠军)
        Map<String, Object> growthChampion = validGrowthData.stream()
            .max(Comparator.comparing(data -> (Double) data.get("growthRate")))
            .orElse(null);
        
        // 2. Growth Slowest (增长最慢)
        Map<String, Object> growthSlowest = validGrowthData.stream()
            .min(Comparator.comparing(data -> (Double) data.get("growthRate")))
            .orElse(null);
        
        // 3. Salary Gap Ratio (薪资差距倍数)
        double salaryGapRatio = calculateSalaryGapRatio(validRecords);
        
        Map<String, Object> coreInsights = new HashMap<>();
        coreInsights.put("growthChampion", growthChampion);
        coreInsights.put("growthSlowest", growthSlowest);
        coreInsights.put("salaryGapRatio", Math.round(salaryGapRatio * 100.0) / 100.0);
        coreInsights.put("timeRange", START_YEAR + "-" + END_YEAR);
        coreInsights.put("validIndustries", validGrowthData.size());
        
        return coreInsights;
    }
    
    /**
     * 获取增长排名数据
     * 参考: interactive_crosstab_app.py的get_growth_champion_data()方法
     * 
     * @param isGrowthMode true=增长模式(降序), false=衰退模式(升序)
     * @return 按增长率排序的行业列表
     */
    public List<Map<String, Object>> getGrowthRankings(boolean isGrowthMode) {
        List<SalaryRecord> validRecords = salaryRecordRepository
            .findByYearPeriodBetweenAndWagesPerFteNotNull(START_YEAR, END_YEAR);
        
        Map<String, List<SalaryRecord>> industryRecords = validRecords.stream()
            .collect(Collectors.groupingBy(SalaryRecord::getTitle));
        
        List<Map<String, Object>> growthData = calculateGrowthRates(industryRecords);
        
        // 筛选有效行业并排序
        return growthData.stream()
            .filter(data -> data.get("startSalary") != null && data.get("endSalary") != null)
            .sorted(isGrowthMode ? 
                Comparator.comparing((Map<String, Object> data) -> (Double) data.get("growthRate")).reversed() :
                Comparator.comparing((Map<String, Object> data) -> (Double) data.get("growthRate")))
            .collect(Collectors.toList());
    }
    
    /**
     * 获取薪资差距趋势数据
     * 参考: interactive_crosstab_app.py的calculate_yearly_gap_ratios()方法
     * 
     * @return 2010-2024年每年的薪资差距数据
     */
    public List<Map<String, Object>> getSalaryGapTrends() {
        List<Map<String, Object>> trends = new ArrayList<>();
        
        for (int year = START_YEAR; year <= END_YEAR; year++) {
            List<SalaryRecord> yearRecords = salaryRecordRepository
                .findByYearPeriodAndWagesPerFteNotNull(year);
            
            if (!yearRecords.isEmpty()) {
                // 计算该年最高和最低薪资
                BigDecimal maxSalary = yearRecords.stream()
                    .map(SalaryRecord::getWagesPerFte)
                    .max(BigDecimal::compareTo)
                    .orElse(BigDecimal.ZERO);
                
                BigDecimal minSalary = yearRecords.stream()
                    .map(SalaryRecord::getWagesPerFte)
                    .min(BigDecimal::compareTo)
                    .orElse(BigDecimal.ONE);
                
                // 计算差距倍数
                double gapRatio = minSalary.equals(BigDecimal.ZERO) ? 0.0 : 
                    maxSalary.divide(minSalary, 2, RoundingMode.HALF_UP).doubleValue();
                
                Map<String, Object> yearData = new HashMap<>();
                yearData.put("year", year);
                yearData.put("gapRatio", Math.round(gapRatio * 100.0) / 100.0);
                yearData.put("maxSalary", maxSalary.doubleValue());
                yearData.put("minSalary", minSalary.doubleValue());
                yearData.put("industryCount", yearRecords.size());
                
                trends.add(yearData);
            }
        }
        
        return trends;
    }
    
    /**
     * 计算各行业的增长率
     * 私有辅助方法，基于2010年起始薪资和2024年结束薪资
     */
    private List<Map<String, Object>> calculateGrowthRates(Map<String, List<SalaryRecord>> industryRecords) {
        List<Map<String, Object>> growthData = new ArrayList<>();
        
        for (Map.Entry<String, List<SalaryRecord>> entry : industryRecords.entrySet()) {
            String industry = entry.getKey();
            List<SalaryRecord> records = entry.getValue();
            
            // 查找2010年和2024年的薪资数据
            BigDecimal startSalary = null;
            BigDecimal endSalary = null;
            
            for (SalaryRecord record : records) {
                if (record.getYearPeriod().equals(START_YEAR)) {
                    startSalary = record.getWagesPerFte();
                }
                if (record.getYearPeriod().equals(END_YEAR)) {
                    endSalary = record.getWagesPerFte();
                }
            }
            
            Map<String, Object> industryData = new HashMap<>();
            industryData.put("industry", industry);
            industryData.put("startSalary", startSalary != null ? startSalary.doubleValue() : null);
            industryData.put("endSalary", endSalary != null ? endSalary.doubleValue() : null);
            
            // 计算增长率
            if (startSalary != null && endSalary != null && startSalary.compareTo(BigDecimal.ZERO) > 0) {
                double growthRate = endSalary.subtract(startSalary)
                    .divide(startSalary, 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"))
                    .doubleValue();
                industryData.put("growthRate", Math.round(growthRate * 100.0) / 100.0);
            } else {
                industryData.put("growthRate", null);
            }
            
            growthData.add(industryData);
        }
        
        return growthData;
    }
    
    /**
     * 计算薪资差距倍数
     * 基于2010-2024年各行业平均薪资的最大值/最小值
     */
    private double calculateSalaryGapRatio(List<SalaryRecord> validRecords) {
        // 按行业计算平均薪资
        Map<String, Double> industryAvgSalaries = validRecords.stream()
            .collect(Collectors.groupingBy(
                SalaryRecord::getTitle,
                Collectors.averagingDouble(record -> record.getWagesPerFte().doubleValue())
            ));
        
        if (industryAvgSalaries.isEmpty()) {
            return 1.0;
        }
        
        double maxAvgSalary = industryAvgSalaries.values().stream()
            .mapToDouble(Double::doubleValue)
            .max()
            .orElse(0.0);
        
        double minAvgSalary = industryAvgSalaries.values().stream()
            .mapToDouble(Double::doubleValue)
            .min()
            .orElse(1.0);
        
        return minAvgSalary == 0.0 ? 1.0 : maxAvgSalary / minAvgSalary;
    }
    
    /**
     * 创建空的洞察数据（无有效数据时使用）
     */
    private Map<String, Object> createEmptyInsights() {
        Map<String, Object> emptyInsights = new HashMap<>();
        emptyInsights.put("growthChampion", null);
        emptyInsights.put("growthSlowest", null);
        emptyInsights.put("salaryGapRatio", 1.0);
        emptyInsights.put("timeRange", START_YEAR + "-" + END_YEAR);
        emptyInsights.put("validIndustries", 0);
        return emptyInsights;
    }
}