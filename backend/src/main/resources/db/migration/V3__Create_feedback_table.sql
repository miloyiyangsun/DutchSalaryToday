-- V3__Create_feedback_table.sql
-- 创建平台反馈系统表，支持极简用户评价功能
-- 单表设计，6个核心字段，完整CRUD操作支持

-- 创建platform_feedback主表
CREATE TABLE platform_feedback (
    -- 主键和核心标识字段
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    
    -- 评价数据字段 
    overall_rating INTEGER NOT NULL,
    comment TEXT,
    
    -- 系统管理字段
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- 添加数据完整性约束
-- 评分范围约束 (1-5分)
ALTER TABLE platform_feedback 
ADD CONSTRAINT check_overall_rating_range CHECK (overall_rating >= 1 AND overall_rating <= 5);

-- UUID格式约束 (标准36字符UUID格式)
ALTER TABLE platform_feedback 
ADD CONSTRAINT check_user_id_format CHECK (user_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');

-- 评论长度约束 (最大500字符)
ALTER TABLE platform_feedback 
ADD CONSTRAINT check_comment_length CHECK (comment IS NULL OR LENGTH(comment) <= 500);

-- 创建性能优化索引
-- 用户查询索引 - 支持按用户CRUD操作
CREATE INDEX idx_platform_feedback_user_id ON platform_feedback (user_id);

-- 活跃数据索引 - 支持软删除数据筛选  
CREATE INDEX idx_platform_feedback_active ON platform_feedback (is_active) WHERE is_active = true;

-- 时间序列索引 - 支持按时间排序和分页
CREATE INDEX idx_platform_feedback_created_at ON platform_feedback (created_at);

-- 用户唯一活跃反馈约束 - 每个用户只能有一个活跃的反馈
CREATE UNIQUE INDEX idx_platform_feedback_user_active ON platform_feedback (user_id) WHERE is_active = true;

-- 添加表和字段注释
COMMENT ON TABLE platform_feedback IS '平台用户反馈表 - 支持极简1-5分评价和可选评论的CRUD操作';

COMMENT ON COLUMN platform_feedback.id IS '反馈记录主键';
COMMENT ON COLUMN platform_feedback.user_id IS '用户UUID标识 (无需注册登录)';
COMMENT ON COLUMN platform_feedback.overall_rating IS '整体评分 (1-5分)';
COMMENT ON COLUMN platform_feedback.comment IS '可选文字评论 (最大500字符)';
COMMENT ON COLUMN platform_feedback.created_at IS '创建时间';
COMMENT ON COLUMN platform_feedback.updated_at IS '最后更新时间';
COMMENT ON COLUMN platform_feedback.is_active IS '软删除标记 (true=活跃, false=已删除)';