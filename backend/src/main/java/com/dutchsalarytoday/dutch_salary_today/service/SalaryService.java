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
     * 获取增长排名数据 - 扩展版本：返回前5+后5共10个行业
     * 参考: interactive_crosstab_app.py的get_growth_champion_data()方法
     * 
     * @param isGrowthMode 暂时保留参数兼容性，实际总是返回前5+后5
     * @return 前5个增长最快+后5个增长最慢的行业排名数据，共10个行业
     */
    public List<Map<String, Object>> getGrowthRankings(boolean isGrowthMode) {
        List<SalaryRecord> validRecords = salaryRecordRepository
            .findByYearPeriodBetweenAndWagesPerFteNotNull(START_YEAR, END_YEAR);
        
        Map<String, List<SalaryRecord>> industryRecords = validRecords.stream()
            .collect(Collectors.groupingBy(SalaryRecord::getTitle));
        
        List<Map<String, Object>> growthData = calculateGrowthRates(industryRecords);
        
        // 筛选有效行业，按增长率降序排序获取完整数据
        List<Map<String, Object>> allSortedData = growthData.stream()
            .filter(data -> data.get("startSalary") != null && data.get("endSalary") != null)
            .sorted(Comparator.comparing((Map<String, Object> data) -> (Double) data.get("growthRate")).reversed())
            .collect(Collectors.toList());
        
        if (allSortedData.size() < 10) {
            // 如果有效行业不足10个，返回所有可用的行业
            List<Map<String, Object>> rankedData = new ArrayList<>();
            for (int i = 0; i < allSortedData.size(); i++) {
                rankedData.add(createRankedItem(allSortedData.get(i), i + 1, i < 5 ? "fastest" : "slowest"));
            }
            return rankedData;
        }
        
        // 提取前5个(增长最快)和后5个(增长最慢)
        List<Map<String, Object>> top5 = allSortedData.subList(0, 5);
        List<Map<String, Object>> bottom5 = allSortedData.subList(
            Math.max(0, allSortedData.size() - 5), 
            allSortedData.size()
        );
        
        // 合并前5和后5，添加排名和分类信息
        List<Map<String, Object>> rankedData = new ArrayList<>();
        
        // 前5名：增长最快 (rank 1-5)
        for (int i = 0; i < top5.size(); i++) {
            rankedData.add(createRankedItem(top5.get(i), i + 1, "fastest"));
        }
        
        // 后5名：增长最慢 (rank 6-10)
        for (int i = 0; i < bottom5.size(); i++) {
            rankedData.add(createRankedItem(bottom5.get(i), i + 6, "slowest"));
        }
        
        return rankedData;
    }
    
    /**
     * 创建格式化的排名项目
     * 
     * @param originalData 原始行业数据
     * @param rank 排名 (1-10)
     * @param category 分类 ("fastest" 或 "slowest")
     * @return 格式化的排名数据
     */
    private Map<String, Object> createRankedItem(Map<String, Object> originalData, int rank, String category) {
        Map<String, Object> rankedItem = new HashMap<>();
        
        rankedItem.put("rank", rank);
        rankedItem.put("industry", originalData.get("industry"));
        rankedItem.put("growthRate", (Double) originalData.get("growthRate"));
        rankedItem.put("startSalary", (Double) originalData.get("startSalary"));
        rankedItem.put("endSalary", (Double) originalData.get("endSalary"));
        rankedItem.put("unit", "k€");
        rankedItem.put("category", category); // 新增：标识是最快还是最慢
        
        return rankedItem;
    }
    
    /**
     * 生成指定行业的年度薪资趋势数据
     * 用于前端LineChart图表显示
     * 
     * @param industries 行业列表 (支持10个行业：前5快+后5慢)
     * @return 2010-2024年每年的行业薪资数据，格式为: [{year: 2010, "行业A": 薪资, "行业B": 薪资}, ...]
     */
    public List<Map<String, Object>> generateTrendData(List<String> industries) {
        List<Map<String, Object>> trendData = new ArrayList<>();
        
        for (int year = START_YEAR; year <= END_YEAR; year++) {
            Map<String, Object> yearData = new HashMap<>();
            yearData.put("year", year);
            
            // 获取该年份的薪资记录
            List<SalaryRecord> yearRecords = salaryRecordRepository
                .findByYearPeriodAndWagesPerFteNotNull(year);
            
            // 为每个行业添加薪资数据 (支持10个行业)
            for (String industry : industries) {
                Double salary = yearRecords.stream()
                    .filter(record -> record.getTitle().equals(industry))
                    .map(record -> record.getWagesPerFte().doubleValue())
                    .findFirst()
                    .orElse(null);
                
                if (salary != null) {
                    yearData.put(industry, salary);
                }
            }
            
            trendData.add(yearData);
        }
        
        return trendData;
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
                // 找到该年最高薪资的行业记录
                SalaryRecord maxSalaryRecord = yearRecords.stream()
                    .max(Comparator.comparing(SalaryRecord::getWagesPerFte))
                    .orElse(null);
                
                // 找到该年最低薪资的行业记录
                SalaryRecord minSalaryRecord = yearRecords.stream()
                    .min(Comparator.comparing(SalaryRecord::getWagesPerFte))
                    .orElse(null);
                
                if (maxSalaryRecord != null && minSalaryRecord != null) {
                    BigDecimal maxSalary = maxSalaryRecord.getWagesPerFte();
                    BigDecimal minSalary = minSalaryRecord.getWagesPerFte();
                    
                    // 计算差距倍数
                    double gapRatio = minSalary.equals(BigDecimal.ZERO) ? 0.0 : 
                        maxSalary.divide(minSalary, 2, RoundingMode.HALF_UP).doubleValue();
                    
                    Map<String, Object> yearData = new HashMap<>();
                    yearData.put("year", year);
                    yearData.put("gapRatio", Math.round(gapRatio * 100.0) / 100.0);
                    yearData.put("maxSalary", maxSalary.doubleValue());
                    yearData.put("minSalary", minSalary.doubleValue());
                    yearData.put("maxIndustry", maxSalaryRecord.getTitle()); // 新增：最高薪资行业名
                    yearData.put("minIndustry", minSalaryRecord.getTitle()); // 新增：最低薪资行业名
                    yearData.put("industryCount", yearRecords.size());
                    
                    trends.add(yearData);
                }
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