-- V4__Simplify_feedback_to_emoji_only.sql
-- 简化反馈表结构：去掉评论字段，只保留emoji评分 (1-5)
-- Simplify feedback table: remove comment field, keep only emoji rating (1-5)

-- 删除comment列 - Remove comment column
ALTER TABLE platform_feedback DROP COLUMN IF EXISTS comment;

-- 添加约束确保评分在1-5范围内 - Add constraint to ensure rating is between 1-5
ALTER TABLE platform_feedback ADD CONSTRAINT check_emoji_rating_range 
    CHECK (overall_rating >= 1 AND overall_rating <= 5);

-- 更新表注释 - Update table comment
COMMENT ON TABLE platform_feedback IS 'Platform feedback with emoji rating (1-5) only';
COMMENT ON COLUMN platform_feedback.overall_rating IS 'Emoji rating: 1=😞, 2=😐, 3=😊, 4=😃, 5=🤩';