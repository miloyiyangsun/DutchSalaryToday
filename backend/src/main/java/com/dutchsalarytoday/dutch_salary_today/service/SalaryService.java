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
    
    /**
     * 获取工时分析数据 - Story 2
     * 参考: sprint2-5.md工时分析需求
     * 
     * @return 包含三个Big Numbers的工时分析数据
     */
    public Map<String, Object> getWorkHoursAnalysis() {
        // 获取2024年最新数据用于分析
        List<SalaryRecord> currentYearData = salaryRecordRepository
            .findByYearPeriodAndCompleteWorkHoursData(END_YEAR);
        
        if (currentYearData.isEmpty()) {
            return createEmptyWorkHoursAnalysis();
        }
        
        // Big Number 1: 平均工时水平 (2024年)
        Map<String, Object> averageHours = calculateAverageWorkHours(currentYearData);
        
        // Big Number 2: 行业工时排名
        Map<String, Object> hoursRanking = calculateIndustryHoursRanking(currentYearData);
        
        // Big Number 3: 行业时薪排名  
        Map<String, Object> wageRanking = calculateIndustryWageRanking(currentYearData);
        
        Map<String, Object> analysis = new HashMap<>();
        analysis.put("averageHours", averageHours);
        analysis.put("hoursRanking", hoursRanking);  
        analysis.put("wageRanking", wageRanking);
        analysis.put("analysisYear", END_YEAR);
        analysis.put("totalIndustries", currentYearData.size());
        analysis.put("dataSource", "CBS Netherlands Statistics");
        
        return analysis;
    }
    
    /**
     * 计算平均工时水平 - Big Number 1
     * 公式: 年度工时 = SUM(hours_worked_21) * 1000 / SUM(full_time_equivalent_fte_20)
     */
    private Map<String, Object> calculateAverageWorkHours(List<SalaryRecord> data) {
        // 计算全国总工时和总FTE
        double totalHoursMillions = data.stream()
            .mapToDouble(record -> record.getHoursWorked().doubleValue())
            .sum();
        
        double totalFteThousands = data.stream()
            .mapToDouble(record -> record.getFullTimeEquivalentFte().doubleValue()) 
            .sum();
        
        // 计算年度工时和周工时
        double annualHours = (totalHoursMillions * 1000) / totalFteThousands;
        double weeklyHours = annualHours / 52;
        
        Map<String, Object> result = new HashMap<>();
        result.put("weeklyHours", Math.round(weeklyHours * 10.0) / 10.0); // 保留1位小数
        result.put("annualHours", Math.round(annualHours));
        result.put("description", "Netherlands Average Work Hours 2024");
        result.put("unit", "hours/week");
        
        return result;
    }
    
    /**
     * 计算行业工时排名 - Big Number 2
     * 找到工时最高和最低的行业，计算差距倍数
     */
    private Map<String, Object> calculateIndustryHoursRanking(List<SalaryRecord> data) {
        // 计算各行业的周工时
        List<Map<String, Object>> industryHours = data.stream()
            .map(record -> {
                double annualHours = (record.getHoursWorked().doubleValue() * 1000) / 
                                   record.getFullTimeEquivalentFte().doubleValue();
                double weeklyHours = annualHours / 52;
                
                Map<String, Object> industry = new HashMap<>();
                industry.put("industry", record.getTitle());
                industry.put("weeklyHours", Math.round(weeklyHours * 10.0) / 10.0);
                industry.put("annualHours", Math.round(annualHours));
                return industry;
            })
            .sorted(Comparator.comparing((Map<String, Object> m) -> (Double) m.get("weeklyHours")).reversed())
            .collect(Collectors.toList());
        
        if (industryHours.isEmpty()) {
            return new HashMap<>();
        }
        
        Map<String, Object> highest = industryHours.get(0);
        Map<String, Object> lowest = industryHours.get(industryHours.size() - 1);
        
        double gapRatio = (Double) highest.get("weeklyHours") / (Double) lowest.get("weeklyHours");
        
        Map<String, Object> result = new HashMap<>();
        result.put("highest", highest);
        result.put("lowest", lowest);
        result.put("gapRatio", Math.round(gapRatio * 10.0) / 10.0);
        result.put("description", "Industry Work Hours Ranking");
        result.put("unit", "hours/week");
        
        return result;
    }
    
    /**
     * 计算行业时薪排名 - Big Number 3
     * 找到时薪最高和最低的行业，计算差距倍数
     */
    private Map<String, Object> calculateIndustryWageRanking(List<SalaryRecord> data) {
        // 按时薪排序
        List<Map<String, Object>> industryWages = data.stream()
            .map(record -> {
                Map<String, Object> industry = new HashMap<>();
                industry.put("industry", record.getTitle());
                industry.put("hourlyWage", record.getCompensationPerHourWorked().doubleValue());
                return industry;
            })
            .sorted(Comparator.comparing((Map<String, Object> m) -> (Double) m.get("hourlyWage")).reversed())
            .collect(Collectors.toList());
        
        if (industryWages.isEmpty()) {
            return new HashMap<>();
        }
        
        Map<String, Object> highest = industryWages.get(0);
        Map<String, Object> lowest = industryWages.get(industryWages.size() - 1);
        
        double gapRatio = (Double) highest.get("hourlyWage") / (Double) lowest.get("hourlyWage");
        
        Map<String, Object> result = new HashMap<>();
        result.put("highest", highest);
        result.put("lowest", lowest);
        result.put("gapRatio", Math.round(gapRatio * 10.0) / 10.0);
        result.put("description", "Industry Hourly Wage Ranking");
        result.put("unit", "euros/hour");
        
        return result;
    }
    
    /**
     * 创建空的工时分析数据（无有效数据时使用）
     */
    private Map<String, Object> createEmptyWorkHoursAnalysis() {
        Map<String, Object> empty = new HashMap<>();
        empty.put("averageHours", null);
        empty.put("hoursRanking", null);
        empty.put("wageRanking", null);
        empty.put("analysisYear", END_YEAR);
        empty.put("totalIndustries", 0);
        empty.put("error", "No complete work hours data available for " + END_YEAR);
        return empty;
    }
    
    /**
     * 获取性别力量洞察数据 - Story 3: Gender Power Rise
     * 参考: data_analysis/gender_power_analysis.py
     * 
     * @return 包含三个Big Numbers的性别力量分析数据
     */
    public Map<String, Object> getGenderPowerInsights() {
        // 关键年份定义，参考sprint2-5.md
        final int HISTORICAL_START = 1995; // 历史突破起点
        final int GROWTH_START = 2010;     // 新增岗位计算起点
        final int CURRENT_YEAR = 2024;     // 当前年份
        
        // 获取关键年份的性别数据
        List<SalaryRecord> data1995 = salaryRecordRepository.findByYearPeriodAndGenderDataNotNull(HISTORICAL_START);
        List<SalaryRecord> data2010 = salaryRecordRepository.findByYearPeriodAndGenderDataNotNull(GROWTH_START);
        List<SalaryRecord> data2024 = salaryRecordRepository.findByYearPeriodAndGenderDataNotNull(CURRENT_YEAR);
        
        if (data1995.isEmpty() || data2010.isEmpty() || data2024.isEmpty()) {
            return createEmptyGenderPowerAnalysis();
        }
        
        // Big Number 1: 女性占比历史突破 (1995-2024)
        Map<String, Object> historicalBreakthrough = calculateHistoricalBreakthrough(data1995, data2024);
        
        // Big Number 2: 新增岗位贡献力 (2010-2024)
        Map<String, Object> newJobsContribution = calculateNewJobsContribution(data2010, data2024);
        
        // Big Number 3: 行业主导地位 (2024年现状)
        Map<String, Object> industryDominance = calculateIndustryDominance(data2024);
        
        Map<String, Object> insights = new HashMap<>();
        insights.put("historicalBreakthrough", historicalBreakthrough);
        insights.put("newJobsContribution", newJobsContribution);
        insights.put("industryDominance", industryDominance);
        insights.put("analysisYears", Map.of(
            "historical", "1995-2024",
            "growth", "2010-2024", 
            "current", CURRENT_YEAR
        ));
        insights.put("totalIndustries2024", data2024.size());
        insights.put("dataSource", "CBS Netherlands Statistics - Gender Employment Data");
        
        return insights;
    }
    
    /**
     * Big Number 1: 计算女性占比历史突破
     * 公式: 女性占比 = SUM(female_29) / SUM(total_27) * 100
     */
    private Map<String, Object> calculateHistoricalBreakthrough(List<SalaryRecord> data1995, List<SalaryRecord> data2024) {
        // 1995年全国女性占比
        double female1995 = data1995.stream().mapToDouble(r -> r.getFemale().doubleValue()).sum();
        double total1995 = data1995.stream().mapToDouble(r -> r.getTotal().doubleValue()).sum();
        double percentage1995 = (female1995 / total1995) * 100;
        
        // 2024年全国女性占比
        double female2024 = data2024.stream().mapToDouble(r -> r.getFemale().doubleValue()).sum();
        double total2024 = data2024.stream().mapToDouble(r -> r.getTotal().doubleValue()).sum();
        double percentage2024 = (female2024 / total2024) * 100;
        
        // 计算变化
        double changePoints = percentage2024 - percentage1995;
        
        Map<String, Object> result = new HashMap<>();
        result.put("percentage1995", Math.round(percentage1995 * 10.0) / 10.0);
        result.put("percentage2024", Math.round(percentage2024 * 10.0) / 10.0);
        result.put("changePoints", Math.round(changePoints * 10.0) / 10.0);
        result.put("description", "Female workforce historical breakthrough");
        result.put("trend", changePoints > 0 ? "increasing" : "decreasing");
        
        return result;
    }
    
    /**
     * Big Number 2: 计算新增岗位贡献力
     * 公式: 贡献率 = (女性新增岗位 / 总新增岗位) * 100
     */
    private Map<String, Object> calculateNewJobsContribution(List<SalaryRecord> data2010, List<SalaryRecord> data2024) {
        // 2010年总计
        double female2010 = data2010.stream().mapToDouble(r -> r.getFemale().doubleValue()).sum();
        double total2010 = data2010.stream().mapToDouble(r -> r.getTotal().doubleValue()).sum();
        
        // 2024年总计
        double female2024 = data2024.stream().mapToDouble(r -> r.getFemale().doubleValue()).sum();
        double total2024 = data2024.stream().mapToDouble(r -> r.getTotal().doubleValue()).sum();
        
        // 计算新增岗位
        double femaleNewJobs = female2024 - female2010;
        double totalNewJobs = total2024 - total2010;
        
        // 计算贡献率
        double contributionRate = totalNewJobs > 0 ? (femaleNewJobs / totalNewJobs) * 100 : 0.0;
        
        Map<String, Object> result = new HashMap<>();
        result.put("contributionRate", Math.round(contributionRate * 10.0) / 10.0);
        result.put("femaleNewJobs", Math.round(femaleNewJobs));
        result.put("totalNewJobs", Math.round(totalNewJobs));
        result.put("description", "Female contribution to new jobs (2010-2024)");
        result.put("unit", "percentage of new positions");
        
        return result;
    }
    
    /**
     * Big Number 3: 计算行业主导地位
     * 女性占比>50%的行业数量统计
     */
    private Map<String, Object> calculateIndustryDominance(List<SalaryRecord> data2024) {
        // 计算各行业女性占比
        List<Map<String, Object>> industryGenderData = data2024.stream()
            .map(record -> {
                double femalePercentage = (record.getFemale().doubleValue() / record.getTotal().doubleValue()) * 100;
                Map<String, Object> industry = new HashMap<>();
                industry.put("industry", record.getTitle());
                industry.put("femalePercentage", Math.round(femalePercentage * 10.0) / 10.0);
                industry.put("femaleCount", record.getFemale().doubleValue());
                industry.put("totalCount", record.getTotal().doubleValue());
                return industry;
            })
            .collect(Collectors.toList());
        
        // 统计女性主导行业 (>50%)
        List<Map<String, Object>> femaleDominantIndustries = industryGenderData.stream()
            .filter(industry -> (Double) industry.get("femalePercentage") > 50.0)
            .sorted(Comparator.comparing((Map<String, Object> i) -> (Double) i.get("femalePercentage")).reversed())
            .collect(Collectors.toList());
        
        // 找到女性占比最高的行业
        Map<String, Object> topFemaleIndustry = industryGenderData.stream()
            .max(Comparator.comparing(i -> (Double) i.get("femalePercentage")))
            .orElse(null);
        
        Map<String, Object> result = new HashMap<>();
        result.put("dominantIndustryCount", femaleDominantIndustries.size());
        result.put("totalIndustries", industryGenderData.size());
        result.put("topFemaleIndustry", topFemaleIndustry);
        result.put("description", "Industries where women dominate (>50%)");
        result.put("analysisYear", 2024);
        
        return result;
    }
    
    /**
     * 创建空的性别力量分析数据（无有效数据时使用）
     */
    private Map<String, Object> createEmptyGenderPowerAnalysis() {
        Map<String, Object> empty = new HashMap<>();
        empty.put("historicalBreakthrough", null);
        empty.put("newJobsContribution", null);
        empty.put("industryDominance", null);
        empty.put("totalIndustries2024", 0);
        empty.put("error", "No complete gender data available for analysis years");
        return empty;
    }
    
    /**
     * 获取工作密集化洞察数据 - Story 4: Work Intensification Revolution
     * 参考: data_analysis/interactive_crosstab_app.py calculate_parttime_big_numbers()
     * 
     * @return 包含三个Big Numbers的工作密集化分析数据
     */
    public Map<String, Object> getWorkIntensificationInsights() {
        final int ANALYSIS_START = 2010; // 分析起点
        final int CURRENT_YEAR = 2024;   // 当前年份
        
        // 获取关键年份的工作数据 (需要FTE和Total字段)
        List<SalaryRecord> data2010 = salaryRecordRepository.findByYearPeriodAndWorkIntensificationDataNotNull(ANALYSIS_START);
        List<SalaryRecord> data2024 = salaryRecordRepository.findByYearPeriodAndWorkIntensificationDataNotNull(CURRENT_YEAR);
        
        if (data2010.isEmpty() || data2024.isEmpty()) {
            return createEmptyWorkIntensificationAnalysis();
        }
        
        // Big Number 1: 工作负荷分布 (2024年现状)
        Map<String, Object> workloadDistribution = calculateWorkloadDistribution(data2024);
        
        // Big Number 2: 工作密集化指数 (2010-2024年变化)
        Map<String, Object> intensificationIndex = calculateIntensificationIndex(data2010, data2024);
        
        // Big Number 3: 行业工作负荷排名 (2024年对比)
        Map<String, Object> industryWorkloadRanking = calculateIndustryWorkloadRanking(data2024);
        
        Map<String, Object> insights = new HashMap<>();
        insights.put("workloadDistribution", workloadDistribution);
        insights.put("intensificationIndex", intensificationIndex);
        insights.put("industryWorkloadRanking", industryWorkloadRanking);
        insights.put("analysisYears", ANALYSIS_START + "-" + CURRENT_YEAR);
        insights.put("totalIndustries2024", data2024.size());
        insights.put("dataSource", "CBS Netherlands Statistics - Work Intensification Analysis");
        
        return insights;
    }
    
    /**
     * Big Number 1: 计算工作负荷分布
     * 公式: 非全职工作比例 = (1 - SUM(FTE) / SUM(Total)) * 100
     */
    private Map<String, Object> calculateWorkloadDistribution(List<SalaryRecord> data2024) {
        // 全国总计
        double totalFte = data2024.stream().mapToDouble(r -> r.getFullTimeEquivalentFte().doubleValue()).sum();
        double totalEmployees = data2024.stream().mapToDouble(r -> r.getTotal().doubleValue()).sum();
        
        // 计算非全职工作比例
        double parttimeRatio = (1 - (totalFte / totalEmployees)) * 100;
        
        Map<String, Object> result = new HashMap<>();
        result.put("parttimeRatio", Math.round(parttimeRatio * 10.0) / 10.0);
        result.put("totalFte", Math.round(totalFte));
        result.put("totalEmployees", Math.round(totalEmployees));
        result.put("description", "Non-standard work arrangements distribution");
        result.put("unit", "percentage of workforce");
        result.put("analysisYear", 2024);
        
        return result;
    }
    
    /**
     * Big Number 2: 计算工作密集化指数
     * 公式: |员工增长率 - FTE增长率| = 工作密集化程度
     */
    private Map<String, Object> calculateIntensificationIndex(List<SalaryRecord> data2010, List<SalaryRecord> data2024) {
        // 2010年总计
        double totalEmployees2010 = data2010.stream().mapToDouble(r -> r.getTotal().doubleValue()).sum();
        double totalFte2010 = data2010.stream().mapToDouble(r -> r.getFullTimeEquivalentFte().doubleValue()).sum();
        
        // 2024年总计
        double totalEmployees2024 = data2024.stream().mapToDouble(r -> r.getTotal().doubleValue()).sum();
        double totalFte2024 = data2024.stream().mapToDouble(r -> r.getFullTimeEquivalentFte().doubleValue()).sum();
        
        // 计算增长率
        double employeeGrowthRate = ((totalEmployees2024 - totalEmployees2010) / totalEmployees2010) * 100;
        double fteGrowthRate = ((totalFte2024 - totalFte2010) / totalFte2010) * 100;
        
        // 工作密集化指数 = 员工增长率与FTE增长率的差异
        double intensificationIndex = Math.abs(employeeGrowthRate - fteGrowthRate);
        
        Map<String, Object> result = new HashMap<>();
        result.put("intensificationIndex", Math.round(intensificationIndex * 10.0) / 10.0);
        result.put("employeeGrowthRate", Math.round(employeeGrowthRate * 10.0) / 10.0);
        result.put("fteGrowthRate", Math.round(fteGrowthRate * 10.0) / 10.0);
        result.put("description", "Work intensification index (2010-2024)");
        result.put("interpretation", employeeGrowthRate > fteGrowthRate ? "increasing_workload" : "decreasing_workload");
        result.put("unit", "percentage points difference");
        
        return result;
    }
    
    /**
     * Big Number 3: 计算行业工作负荷排名
     * 找到非标准工作安排最重和最轻的行业
     */
    private Map<String, Object> calculateIndustryWorkloadRanking(List<SalaryRecord> data2024) {
        // 计算各行业的非全职工作比例
        List<Map<String, Object>> industryWorkloadData = data2024.stream()
            .map(record -> {
                double parttimeRatio = (1 - (record.getFullTimeEquivalentFte().doubleValue() / record.getTotal().doubleValue())) * 100;
                Map<String, Object> industry = new HashMap<>();
                industry.put("industry", record.getTitle());
                industry.put("parttimeRatio", Math.round(parttimeRatio * 10.0) / 10.0);
                industry.put("fteCount", record.getFullTimeEquivalentFte().doubleValue());
                industry.put("totalEmployees", record.getTotal().doubleValue());
                return industry;
            })
            .collect(Collectors.toList());
        
        // 找到工作负荷最重和最轻的行业
        Map<String, Object> heaviestWorkload = industryWorkloadData.stream()
            .max(Comparator.comparing(i -> (Double) i.get("parttimeRatio")))
            .orElse(null);
            
        Map<String, Object> lightestWorkload = industryWorkloadData.stream()
            .min(Comparator.comparing(i -> (Double) i.get("parttimeRatio")))
            .orElse(null);
        
        Map<String, Object> result = new HashMap<>();
        result.put("heaviestWorkload", heaviestWorkload);
        result.put("lightestWorkload", lightestWorkload);
        result.put("totalIndustries", industryWorkloadData.size());
        result.put("description", "Industry workload intensity ranking");
        result.put("analysisYear", 2024);
        result.put("unit", "percentage non-standard work arrangements");
        
        return result;
    }
    
    /**
     * 创建空的工作密集化分析数据（无有效数据时使用）
     */
    private Map<String, Object> createEmptyWorkIntensificationAnalysis() {
        Map<String, Object> empty = new HashMap<>();
        empty.put("workloadDistribution", null);
        empty.put("intensificationIndex", null);
        empty.put("industryWorkloadRanking", null);
        empty.put("totalIndustries2024", 0);
        empty.put("error", "No complete work intensification data available");
        return empty;
    }
    
    /**
     * 获取隐形人力成本洞察数据 - Story 5
     * 参考: interactive_crosstab_app.py的calculate_hidden_cost_big_numbers()方法
     * 
     * @return 包含福利负担水平、行业差异悬殊、绝对成本增长的隐形成本洞察
     */
    public Map<String, Object> getHiddenCostInsights() {
        final int ANALYSIS_START = 2010;
        final int CURRENT_YEAR = 2024;
        
        try {
            // 获取2024年和2010年的隐形成本数据
            List<SalaryRecord> data2024 = salaryRecordRepository.findByYearPeriodAndHiddenCostDataNotNull(CURRENT_YEAR);
            List<SalaryRecord> data2010 = salaryRecordRepository.findByYearPeriodAndHiddenCostDataNotNull(ANALYSIS_START);
            
            if (data2024.isEmpty() || data2010.isEmpty()) {
                return createEmptyHiddenCostAnalysis();
            }
            
            // 计算三个Big Numbers
            Map<String, Object> benefitBurdenLevel = calculateBenefitBurdenLevel(data2024);
            Map<String, Object> industryGapMultiple = calculateIndustryGapMultiple(data2024);
            Map<String, Object> absoluteCostGrowth = calculateAbsoluteCostGrowth(data2010, data2024);
            
            // 组装完整响应
            Map<String, Object> insights = new HashMap<>();
            insights.put("benefitBurdenLevel", benefitBurdenLevel);
            insights.put("industryGapMultiple", industryGapMultiple);
            insights.put("absoluteCostGrowth", absoluteCostGrowth);
            insights.put("analysisYear", CURRENT_YEAR);
            insights.put("comparisonBaseYear", ANALYSIS_START);
            insights.put("totalIndustriesAnalyzed", data2024.size());
            insights.put("dataComplete", true);
            
            return insights;
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = createEmptyHiddenCostAnalysis();
            errorResponse.put("error", "Failed to calculate hidden cost insights: " + e.getMessage());
            return errorResponse;
        }
    }
    
    /**
     * Big Number 1: 计算福利负担水平
     * 公式: 雇主社保支出占总薪酬比重 = EmployersSocialContributions / CompensationOfEmployees * 100
     */
    private Map<String, Object> calculateBenefitBurdenLevel(List<SalaryRecord> data2024) {
        // 计算2024年总体福利负担水平
        double totalSocialContributions = data2024.stream()
            .mapToDouble(r -> r.getEmployersSocialContributions().doubleValue())
            .sum();
            
        double totalCompensation = data2024.stream()
            .mapToDouble(r -> r.getCompensationOfEmployees().doubleValue())
            .sum();
        
        double benefitRatio = (totalSocialContributions / totalCompensation) * 100;
        
        Map<String, Object> result = new HashMap<>();
        result.put("benefitRatio", Math.round(benefitRatio * 10.0) / 10.0);
        result.put("totalSocialContributions", Math.round(totalSocialContributions));
        result.put("totalCompensation", Math.round(totalCompensation));
        result.put("description", "Employer social contributions burden level");
        result.put("unit", "percentage of total compensation");
        result.put("interpretation", String.format("For every €100 salary, employers pay €%.0f in hidden costs", benefitRatio));
        
        return result;
    }
    
    /**
     * Big Number 2: 计算行业差异悬殊
     * 找到福利占比最高和最低的行业，计算差异倍数
     */
    private Map<String, Object> calculateIndustryGapMultiple(List<SalaryRecord> data2024) {
        // 计算各行业的福利占比
        List<Map<String, Object>> industryBenefitRatios = data2024.stream()
            .map(record -> {
                double benefitRatio = (record.getEmployersSocialContributions().doubleValue() / 
                                     record.getCompensationOfEmployees().doubleValue()) * 100;
                Map<String, Object> industry = new HashMap<>();
                industry.put("industry", record.getTitle());
                industry.put("benefitRatio", Math.round(benefitRatio * 10.0) / 10.0);
                industry.put("socialContributions", record.getEmployersSocialContributions().doubleValue());
                industry.put("totalCompensation", record.getCompensationOfEmployees().doubleValue());
                return industry;
            })
            .collect(Collectors.toList());
        
        // 找到最高和最低福利占比的行业
        Map<String, Object> highestBenefitIndustry = industryBenefitRatios.stream()
            .max(Comparator.comparing(i -> (Double) i.get("benefitRatio")))
            .orElse(null);
            
        Map<String, Object> lowestBenefitIndustry = industryBenefitRatios.stream()
            .min(Comparator.comparing(i -> (Double) i.get("benefitRatio")))
            .orElse(null);
        
        // 计算差异倍数
        double gapMultiple = 0.0;
        if (highestBenefitIndustry != null && lowestBenefitIndustry != null) {
            double highestRatio = (Double) highestBenefitIndustry.get("benefitRatio");
            double lowestRatio = (Double) lowestBenefitIndustry.get("benefitRatio");
            gapMultiple = highestRatio / lowestRatio;
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("highestBenefitIndustry", highestBenefitIndustry);
        result.put("lowestBenefitIndustry", lowestBenefitIndustry);
        result.put("gapMultiple", Math.round(gapMultiple * 10.0) / 10.0);
        result.put("description", "Industry benefit burden disparity");
        result.put("unit", "multiple difference between highest and lowest");
        result.put("totalIndustries", industryBenefitRatios.size());
        
        return result;
    }
    
    /**
     * Big Number 3: 计算绝对成本增长
     * 计算2010-2024年社保支出的绝对增长幅度
     */
    private Map<String, Object> calculateAbsoluteCostGrowth(List<SalaryRecord> data2010, List<SalaryRecord> data2024) {
        // 计算2010年总社保支出
        double totalSocialContributions2010 = data2010.stream()
            .mapToDouble(r -> r.getEmployersSocialContributions().doubleValue())
            .sum();
            
        // 计算2024年总社保支出
        double totalSocialContributions2024 = data2024.stream()
            .mapToDouble(r -> r.getEmployersSocialContributions().doubleValue())
            .sum();
        
        // 计算增长率和绝对增长额
        double growthRate = ((totalSocialContributions2024 - totalSocialContributions2010) / totalSocialContributions2010) * 100;
        double absoluteGrowth = totalSocialContributions2024 - totalSocialContributions2010;
        
        Map<String, Object> result = new HashMap<>();
        result.put("startAmount", Math.round(totalSocialContributions2010 / 1000.0)); // 转换为十亿欧元
        result.put("endAmount", Math.round(totalSocialContributions2024 / 1000.0));   // 转换为十亿欧元
        result.put("growthRate", Math.round(growthRate * 10.0) / 10.0);
        result.put("absoluteGrowth", Math.round(absoluteGrowth));
        result.put("description", "Absolute social contribution cost growth (2010-2024)");
        result.put("unit", "billion euros and percentage growth");
        result.put("startYear", 2010);
        result.put("endYear", 2024);
        
        return result;
    }
    
    /**
     * 创建空的隐形成本分析数据（无有效数据时使用）
     */
    private Map<String, Object> createEmptyHiddenCostAnalysis() {
        Map<String, Object> empty = new HashMap<>();
        empty.put("benefitBurdenLevel", null);
        empty.put("industryGapMultiple", null);
        empty.put("absoluteCostGrowth", null);
        empty.put("totalIndustriesAnalyzed", 0);
        empty.put("dataComplete", false);
        empty.put("error", "No complete hidden cost data available");
        return empty;
    }
}