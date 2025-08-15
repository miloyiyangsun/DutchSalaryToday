-- V1__Create_salary_tables.sql
-- 创建荷兰薪资数据完整表，存储CBS统计局原始CSV的所有43个字段
-- 支持NULL值处理，为所有未来分析需求提供完整数据基础

-- 创建salary_records完整主表
CREATE TABLE salary_records (
    -- 主键和核心标识字段 (NOT NULL)
    id BIGSERIAL PRIMARY KEY,
    csv_id INTEGER,
    sector_code VARCHAR(50),
    periods VARCHAR(20),
    year_period INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category_group_id VARCHAR(50),
    
    -- 薪酬数据组 - 绝对值 (允许NULL，支持缺失数据)
    compensation_of_employees_1 DECIMAL(15,2),
    wages_and_salaries_2 DECIMAL(15,2),
    employers_social_contributions_3 DECIMAL(15,2),
    wage_costs_4 DECIMAL(15,2),
    compensation_of_employees_5 DECIMAL(15,2),
    wages_and_salaries_6 DECIMAL(15,2),
    wage_costs_7 DECIMAL(15,2),
    
    -- 薪酬数据组 - 每FTE指标 (允许NULL)
    compensation_per_fte_8 DECIMAL(10,2),
    wages_per_fte_9 DECIMAL(10,2),
    wage_costs_per_fte_10 DECIMAL(10,2),
    compensation_per_fte_14 DECIMAL(10,2),
    wages_per_fte_15 DECIMAL(10,2),
    wage_costs_per_fte_16 DECIMAL(10,2),
    
    -- 薪酬数据组 - 每小时指标 (允许NULL)
    compensation_per_hour_worked_11 DECIMAL(8,2),
    wages_per_hour_worked_12 DECIMAL(8,2),
    wage_costs_per_hour_worked_13 DECIMAL(8,2),
    compensation_per_hour_worked_17 DECIMAL(8,2),
    wages_per_hour_worked_18 DECIMAL(8,2),
    wage_costs_per_hour_worked_19 DECIMAL(8,2),
    
    -- 就业数据组 (允许NULL)
    full_time_equivalent_fte_20 DECIMAL(10,2),
    hours_worked_21 DECIMAL(12,2),
    hours_paid_22 DECIMAL(12,2),
    hours_agreed_23 DECIMAL(12,2),
    paid_extra_hours_24 DECIMAL(10,2),
    full_time_equivalent_fte_25 DECIMAL(10,2),
    hours_worked_26 DECIMAL(12,2),
    
    -- 人口统计数据组 - 总计 (允许NULL)
    total_27 DECIMAL(10,2),
    total_30 DECIMAL(10,2),
    total_33 DECIMAL(10,2),
    total_36 DECIMAL(10,2),
    
    -- 人口统计数据组 - 按性别分组 (允许NULL)
    male_28 DECIMAL(10,2),
    female_29 DECIMAL(10,2),
    male_31 DECIMAL(10,2),
    female_32 DECIMAL(10,2),
    male_34 DECIMAL(10,2),
    female_35 DECIMAL(10,2),
    
    -- 系统字段
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 添加唯一性约束防止重复数据
-- 同一行业同一年份只能有一条记录
ALTER TABLE salary_records 
ADD CONSTRAINT unique_title_year UNIQUE (title, year_period);

-- 创建查询优化索引
-- 核心查询索引 - 支持按行业和年份的联合查询
CREATE INDEX idx_salary_records_title_year ON salary_records (title, year_period);

-- 时间序列分析索引 - 支持按年份范围查询
CREATE INDEX idx_salary_records_year ON salary_records (year_period);

-- 行业分析索引 - 支持按行业对比
CREATE INDEX idx_salary_records_title ON salary_records (title);

-- 行业代码索引 - 支持SIC2008标准查询
CREATE INDEX idx_salary_records_sector_code ON salary_records (sector_code);

-- 薪资分析索引 - 支持薪资排序和聚合查询
CREATE INDEX idx_salary_records_compensation_fte ON salary_records (compensation_per_fte_8);
CREATE INDEX idx_salary_records_wages_fte ON salary_records (wages_per_fte_9);

-- NULL值友好索引 - 支持NULL/非NULL数据分析
CREATE INDEX idx_salary_records_compensation_notnull ON salary_records (compensation_per_fte_8) WHERE compensation_per_fte_8 IS NOT NULL;

-- 添加数据完整性约束
-- 年份范围约束 (1995-2030，预留未来数据空间)
ALTER TABLE salary_records 
ADD CONSTRAINT check_year_range CHECK (year_period >= 1995 AND year_period <= 2030);

-- 薪资数据非负约束 (仅对非NULL值生效)
ALTER TABLE salary_records 
ADD CONSTRAINT check_positive_compensation_8 CHECK (compensation_per_fte_8 IS NULL OR compensation_per_fte_8 >= 0);

ALTER TABLE salary_records 
ADD CONSTRAINT check_positive_wages_9 CHECK (wages_per_fte_9 IS NULL OR wages_per_fte_9 >= 0);

-- 添加表和字段注释 (便于团队理解和维护)
COMMENT ON TABLE salary_records IS '荷兰薪资完整数据表 - 存储CBS统计局1995-2024年43字段完整数据，支持NULL值';

-- 标识字段注释
COMMENT ON COLUMN salary_records.csv_id IS 'CSV原始ID';
COMMENT ON COLUMN salary_records.sector_code IS 'SIC2008行业代码 (如T001081)';
COMMENT ON COLUMN salary_records.periods IS 'CBS时间周期格式 (如1995JJ00)';
COMMENT ON COLUMN salary_records.year_period IS '数据年份 (1995-2024)';
COMMENT ON COLUMN salary_records.title IS '行业名称 (英文，如Information and communication)';
COMMENT ON COLUMN salary_records.description IS '行业详细描述';
COMMENT ON COLUMN salary_records.category_group_id IS '分类组ID';

-- 薪酬数据字段注释
COMMENT ON COLUMN salary_records.compensation_per_fte_8 IS '每FTE薪酬_8 (千欧元，核心分析指标)';
COMMENT ON COLUMN salary_records.wages_per_fte_9 IS '每FTE工资_9 (千欧元，核心分析指标)';
COMMENT ON COLUMN salary_records.compensation_per_hour_worked_11 IS '每小时薪酬_11 (欧元)';
COMMENT ON COLUMN salary_records.wages_per_hour_worked_12 IS '每小时工资_12 (欧元)';

-- 就业数据字段注释  
COMMENT ON COLUMN salary_records.full_time_equivalent_fte_20 IS '全职等价人数_20';
COMMENT ON COLUMN salary_records.hours_worked_21 IS '工作小时数_21';

-- 人口统计字段注释
COMMENT ON COLUMN salary_records.total_27 IS '总计_27';
COMMENT ON COLUMN salary_records.male_28 IS '男性_28';
COMMENT ON COLUMN salary_records.female_29 IS '女性_29';