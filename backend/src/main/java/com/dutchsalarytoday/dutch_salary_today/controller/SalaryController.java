package com.dutchsalarytoday.dutch_salary_today.controller;

import com.dutchsalarytoday.dutch_salary_today.service.SalaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 薪资数据REST API控制器
 * 
 * 提供3个核心API端点，支持前端React应用的数据需求
 * 配置CORS跨域支持本地开发环境
 */
@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = {
    "http://localhost:3000", 
    "http://localhost:5173",
    "https://frontend-webapp-16283450340.azurewebsites.net"
})
public class SalaryController {
    
    private final SalaryService salaryService;
    
    @Autowired
    public SalaryController(SalaryService salaryService) {
        this.salaryService = salaryService;
    }
    
    /**
     * 获取核心洞察数据API
     * 
     * 端点: GET /api/v1/core-insights
     * 返回: 增长冠军、增长最慢、薪资差距倍数等核心洞察
     * 
     * 前端调用: fetchCoreInsights()
     */
    @GetMapping("/core-insights")
    public ResponseEntity<Map<String, Object>> getCoreInsights() {
        try {
            Map<String, Object> coreInsights = salaryService.getCoreInsights();
            
            // 检查是否有有效数据
            if (coreInsights.get("validIndustries").equals(0)) {
                return ResponseEntity.ok(createErrorResponse("No valid data found for 2010-2024 period"));
            }
            
            return ResponseEntity.ok(createSuccessResponse(coreInsights));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(createErrorResponse("Failed to fetch core insights: " + e.getMessage()));
        }
    }
    
    /**
     * 获取增长排名数据API
     * 
     * 端点: GET /api/v1/growth-rankings?mode={growth|slowest}
     * 参数: mode - "growth"(增长模式) 或 "slowest"(衰退模式)，默认为"growth"
     * 返回: 按增长率排序的行业列表
     * 
     * 前端调用: fetchGrowthRankings()
     */
    @GetMapping("/growth-rankings")
    public ResponseEntity<Map<String, Object>> getGrowthRankings(
            @RequestParam(value = "mode", defaultValue = "growth") String mode) {
        try {
            boolean isGrowthMode = !"slowest".equalsIgnoreCase(mode);
            List<Map<String, Object>> rankings = salaryService.getGrowthRankings(isGrowthMode);
            
            if (rankings.isEmpty()) {
                return ResponseEntity.ok(createErrorResponse("No ranking data available for the specified period"));
            }
            
            // 提取所有10个行业名称用于生成趋势数据
            List<String> allIndustries = rankings.stream()
                .map(ranking -> (String) ranking.get("industry"))
                .collect(Collectors.toList());
            
            // 生成10个行业的趋势数据
            List<Map<String, Object>> trendData = salaryService.generateTrendData(allIndustries);
            
            Map<String, Object> response = Map.of(
                "title", "Industry Growth Rankings (Top 5 + Bottom 5)",
                "rankings", rankings,
                "trendData", trendData, // 10个行业的完整趋势数据
                "mode", "combined", // 新增：表示包含最快+最慢
                "totalIndustries", 10, // 固定为10个行业
                "timeRange", "2010-2024"
            );
            
            return ResponseEntity.ok(createSuccessResponse(response));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(createErrorResponse("Failed to fetch growth rankings: " + e.getMessage()));
        }
    }
    
    /**
     * 获取薪资差距趋势数据API
     * 
     * 端点: GET /api/v1/salary-gap-trends
     * 返回: 2010-2024年每年的薪资差距趋势数据
     * 
     * 前端调用: fetchSalaryGapTrends()
     */
    @GetMapping("/salary-gap-trends")
    public ResponseEntity<Map<String, Object>> getSalaryGapTrends() {
        try {
            List<Map<String, Object>> trends = salaryService.getSalaryGapTrends();
            
            if (trends.isEmpty()) {
                return ResponseEntity.ok(createErrorResponse("No trend data available for the specified period"));
            }
            
            Map<String, Object> response = Map.of(
                "trends", trends,
                "timeRange", "2010-2024",
                "dataPoints", trends.size()
            );
            
            return ResponseEntity.ok(createSuccessResponse(response));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(createErrorResponse("Failed to fetch salary gap trends: " + e.getMessage()));
        }
    }
    
    /**
     * 获取工时分析数据API - Story 2
     * 
     * 端点: GET /api/v1/work-hours-analysis
     * 返回: 包含三个Big Numbers的工时分析数据
     * 
     * 前端调用: fetchWorkHoursAnalysis()
     */
    @GetMapping("/work-hours-analysis")
    public ResponseEntity<Map<String, Object>> getWorkHoursAnalysis() {
        try {
            Map<String, Object> analysis = salaryService.getWorkHoursAnalysis();
            
            // 检查是否有有效数据
            if (analysis.get("totalIndustries").equals(0)) {
                return ResponseEntity.ok(createErrorResponse("No complete work hours data found for 2024"));
            }
            
            return ResponseEntity.ok(createSuccessResponse(analysis));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(createErrorResponse("Failed to fetch work hours analysis: " + e.getMessage()));
        }
    }
    
    /**
     * 健康检查端点
     * 
     * 端点: GET /api/v1/health
     * 返回: API服务状态信息
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = Map.of(
            "status", "UP",
            "service", "DutchSalaryToday API",
            "version", "1.0.0",
            "timestamp", System.currentTimeMillis()
        );
        return ResponseEntity.ok(createSuccessResponse(health));
    }
    
    /**
     * 创建成功响应格式
     * 统一API响应结构，便于前端处理
     */
    private Map<String, Object> createSuccessResponse(Object data) {
        return Map.of(
            "success", true,
            "data", data,
            "timestamp", System.currentTimeMillis()
        );
    }
    
    /**
     * 创建错误响应格式
     * 统一错误响应结构，便于前端错误处理
     */
    private Map<String, Object> createErrorResponse(String message) {
        return Map.of(
            "success", false,
            "error", message,
            "timestamp", System.currentTimeMillis()
        );
    }
}