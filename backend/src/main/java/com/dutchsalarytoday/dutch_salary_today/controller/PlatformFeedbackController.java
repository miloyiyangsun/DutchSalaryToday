package com.dutchsalarytoday.dutch_salary_today.controller;

import com.dutchsalarytoday.dutch_salary_today.service.PlatformFeedbackService;
import com.dutchsalarytoday.dutch_salary_today.dto.FeedbackRequest;
import com.dutchsalarytoday.dutch_salary_today.dto.FeedbackResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * 平台反馈REST API控制器 - 简洁实现
 * 模仿SalaryController架构，提供完整CRUD API端点
 */
@RestController
@RequestMapping("/api/v1/feedback")
@CrossOrigin(origins = {
    "http://localhost:3000", 
    "http://localhost:5173",
    "https://frontend-webapp-16283450340.azurewebsites.net"
})
public class PlatformFeedbackController {
    
    private final PlatformFeedbackService feedbackService;
    
    @Autowired
    public PlatformFeedbackController(PlatformFeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }
    
    /**
     * 创建新反馈 - CREATE操作
     * POST /api/v1/feedback
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createFeedback(@Valid @RequestBody FeedbackRequest request) {
        try {
            FeedbackResponse response = feedbackService.createFeedback(request);
            return ResponseEntity.ok(createSuccessResponse(response));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(createErrorResponse("Failed to create feedback: " + e.getMessage()));
        }
    }
    
    /**
     * 获取用户反馈 - READ操作
     * GET /api/v1/feedback/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserFeedback(@PathVariable String userId) {
        try {
            Optional<FeedbackResponse> feedback = feedbackService.getUserFeedback(userId);
            if (feedback.isPresent()) {
                return ResponseEntity.ok(createSuccessResponse(feedback.get()));
            } else {
                return ResponseEntity.ok(createSuccessResponse(null));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(createErrorResponse("Failed to get user feedback: " + e.getMessage()));
        }
    }
    
    /**
     * 获取反馈统计 - 统计查询
     * GET /api/v1/feedback/statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getFeedbackStatistics() {
        try {
            Map<String, Object> statistics = feedbackService.getFeedbackStatistics();
            return ResponseEntity.ok(createSuccessResponse(statistics));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(createErrorResponse("Failed to get feedback statistics: " + e.getMessage()));
        }
    }
    
    /**
     * 更新反馈 - UPDATE操作
     * PUT /api/v1/feedback/{feedbackId}
     */
    @PutMapping("/{feedbackId}")
    public ResponseEntity<Map<String, Object>> updateFeedback(
            @PathVariable Long feedbackId, 
            @Valid @RequestBody FeedbackRequest request) {
        try {
            FeedbackResponse response = feedbackService.updateFeedback(feedbackId, request);
            return ResponseEntity.ok(createSuccessResponse(response));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(createErrorResponse("Failed to update feedback: " + e.getMessage()));
        }
    }
    
    /**
     * 删除反馈 - DELETE操作
     * DELETE /api/v1/feedback/{feedbackId}
     */
    @DeleteMapping("/{feedbackId}")
    public ResponseEntity<Map<String, Object>> deleteFeedback(@PathVariable Long feedbackId) {
        try {
            feedbackService.deleteFeedback(feedbackId);
            return ResponseEntity.ok(createSuccessResponse(Map.of("message", "Feedback deleted successfully")));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(createErrorResponse("Failed to delete feedback: " + e.getMessage()));
        }
    }
    
    /**
     * 健康检查端点
     * GET /api/v1/feedback/health
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = Map.of(
            "status", "UP",
            "service", "Platform Feedback API",
            "version", "1.0.0",
            "timestamp", System.currentTimeMillis()
        );
        return ResponseEntity.ok(createSuccessResponse(health));
    }
    
    // 私有辅助方法 (复用SalaryController模式)
    private Map<String, Object> createSuccessResponse(Object data) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", data);  // HashMap允许null值
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
    
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("error", message);
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
}