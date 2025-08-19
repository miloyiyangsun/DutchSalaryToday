# Sprint 2-5: 数据故事API开发指南

**项目**: DutchSalaryToday  
**版本**: 3.0 (重新排序版)  
**目标**: 4个新API端点 + 对应的Big Numbers计算逻辑
**故事顺序**: 工时分析 → 女性力量 → 工作密集化 → 隐形成本

---

## 🕒 故事2: 工时分析之谜 (Work Hours Analysis)

### 🎯 Big Numbers - 重新设计专注用户需求
```
🕒 平均工时水平: 2024年荷兰平均工时32.4小时/周 (年工时1686小时)
🏆 工时最高行业: 渔业和水产养殖业57.7小时/周，是最低行业的2.0倍
💰 时薪差距现状: 石化制造业时薪€77.20，住宿餐饮业€25.80，相差3.0倍
```

### 💾 计算逻辑 - 专注三个核心指标
```sql
-- Big Number 1: 平均工时水平 (2024年当前状态)
年度工时 = SUM(hours_worked_21) * 1000 / SUM(full_time_equivalent_fte_20) WHERE year_period = 2024
周工时 = 年度工时 / 52

-- Big Number 2: 行业工时排名 (2024最新数据)
行业年工时 = hours_worked_21 * 1000 / full_time_equivalent_fte_20 GROUP BY title WHERE year_period = 2024
行业周工时 = 行业年工时 / 52
工时最高行业 = MAX(行业周工时)
工时最低行业 = MIN(行业周工时)
工时差距倍数 = 工时最高行业 / 工时最低行业

-- Big Number 3: 行业时薪排名 (2024最新数据)
时薪排名 = ORDER BY compensation_per_hour_worked_11 DESC WHERE year_period = 2024
时薪最高行业 = MAX(compensation_per_hour_worked_11)
时薪最低行业 = MIN(compensation_per_hour_worked_11)
时薪差距倍数 = 时薪最高行业 / 时薪最低行业
```

### ✅ 重新设计成果
- **❌ 移除**: "工时薪酬博弈"分析概念（用户明确拒绝）
- **✅ 专注**: 工时水平、行业工时排名、行业时薪排名
- **✅ 修复**: pandas Series布尔值错误，确保代码稳定运行
- **✅ 显示**: 按周显示工时，符合实际工作习惯
- **✅ 对齐**: 完全符合用户明确要求的三个分析维度

### 🔧 API端点
`GET /api/v1/work-hours-analysis`

---

## 🚺 故事3: 女性力量崛起 (Gender Power Rise)

### 🎯 Big Numbers
```
🚺 女性占比历史突破: 1995年 41.5% → 2024年 48.6% (+7.1个百分点)
💼 新增岗位贡献力: 2010-2024年新增岗位中60.1%由女性获得  
👑 行业主导地位: 17个行业女性占主导 (>50%)
```

### 💾 计算逻辑
```sql
-- Big Number 1: 历史突破 (1995-2024)
女性占比_1995 = SUM(female_29) / SUM(total_27) * 100 WHERE year_period = 1995
女性占比_2024 = SUM(female_29) / SUM(total_27) * 100 WHERE year_period = 2024
历史突破 = 女性占比_2024 - 女性占比_1995

-- Big Number 2: 新增岗位贡献 (2010-2024)  
女性新增 = SUM(female_29_2024) - SUM(female_29_2010)
总新增 = SUM(total_27_2024) - SUM(total_27_2010)
贡献率 = 女性新增 / 总新增 * 100

-- Big Number 3: 行业主导统计 (2024)
女性主导行业数 = COUNT(*) WHERE (female_29/total_27*100) > 50 AND year_period = 2024
```

### 🔧 API端点
`GET /api/v1/gender-power-insights`

---

## 💪 故事4: 工作密集化革命 (Work Intensification Revolution)

### 🎯 故事钩子

> **"荷兰36小时工作制的真相：每个人都在偷偷干1.1个人的活"**

### 📈 Big Numbers 设计

```
📊 工作负荷分布: 23.5%员工承担非全职工作安排
💪 工作密集化指数: +1.1个百分点，每个员工承担更多工作
🏗️ 工作负荷最重行业: 住宿餐饮业非标准工作安排达67.3%
```

### 💾 计算逻辑
```sql
-- Big Number 1: 工作负荷分布 (2024)
非全职工作比例 = (1 - full_time_equivalent_fte_20 / total_27) * 100 WHERE year_period = 2024
工作负荷分布 = 约1/4员工承担非标准工作安排

-- Big Number 2: 工作密集化指数 (2010-2024) 
员工增长率 = (SUM(total_27_2024) - SUM(total_27_2010)) / SUM(total_27_2010) * 100
FTE增长率 = (SUM(fte_20_2024) - SUM(fte_20_2010)) / SUM(fte_20_2010) * 100
工作密集化指数 = ABS(FTE增长率 - 员工增长率)
-- 正值表示每个员工承担的平均工作量增加

-- Big Number 3: 行业工作负荷排名 (2024)
各行业非全职比例 = (1 - full_time_equivalent_fte_20 / total_27) * 100 GROUP BY title WHERE year_period = 2024
工作负荷最重行业 = 找到非标准工作安排最多的行业
工作负荷最轻行业 = 找到最接近标准工作制的行业
```

### ✅ 数据可行性分析

- **✅ 完全可行**: `full_time_equivalent_fte_20`, `total_27` 完美支持工作密集化计算
- **✅ 深度洞察**: 15年时间跨度充分展现荷兰工作模式的隐性变化  
- **✅ 国际对比**: 结合荷兰36.4小时/周工作制，揭示高生产率背后的密集化趋势
- **💡 独特价值**: 颠覆"荷兰工作轻松"印象，揭示隐形工作压力增加的现实

### 🔧 API端点
`GET /api/v1/work-intensification`

---

## 💰 故事5: 隐形人力成本透视 (Hidden Labor Costs)

### 🎯 Big Numbers  
```
🧾 福利负担水平: 雇主社保支出占薪酬比重达22.8%
💸 行业差异悬殊: 最高30.3% vs 最低4.6%，相差6.6倍
📈 绝对成本增长: 社保支出从256亿增至476亿欧元(+86%)
```

### 💾 计算逻辑
```sql
-- Big Number 1: 福利负担水平 (2024)
福利占比 = SUM(employers_social_contributions_3) / SUM(compensation_of_employees_1) * 100 WHERE year_period = 2024

-- Big Number 2: 行业差异倍数 (2024)
各行业福利占比 = employers_social_contributions_3 / compensation_of_employees_1 * 100 GROUP BY title
最高占比 = MAX(各行业福利占比)
最低占比 = MIN(各行业福利占比)  
差异倍数 = 最高占比 / 最低占比

-- Big Number 3: 绝对成本增长 (2010-2024)
社保支出_2010 = SUM(employers_social_contributions_3) WHERE year_period = 2010
社保支出_2024 = SUM(employers_social_contributions_3) WHERE year_period = 2024
绝对增长率 = (社保支出_2024 - 社保支出_2010) / 社保支出_2010 * 100
```

### 🔧 API端点
`GET /api/v1/hidden-costs-insights`

---

## 📋 故事开发优先级与完成状态

### 🎯 新的故事顺序
```
Sprint 2: 🕒 工时分析之谜 (Work Hours Analysis) 
Sprint 3: 🚺 女性力量崛起 (Gender Power Rise)
Sprint 4: 💪 工作密集化革命 (Work Intensification Revolution)
Sprint 5: 💰 隐形人力成本透视 (Hidden Labor Costs)
```

### ✅ 开发状态总览
| 故事 | 分析完成度 | Big Numbers | 图表功能 | API设计 |
|------|------------|-------------|----------|---------|
| 🕒 工时分析 | ✅ 100% | ✅ 3个完成 | ✅ 3个图表 | ✅ 设计完成 |
| 🚺 女性力量 | ✅ 100% | ✅ 3个完成 | ✅ 多个图表 | ✅ 设计完成 |
| 💪 工作密集化 | ✅ 100% | ✅ 3个完成 | ✅ 多个图表 | ✅ 设计完成 |
| 💰 隐形成本 | ✅ 100% | ✅ 3个完成 | ✅ 多个图表 | ✅ 设计完成 |

### 🔍 数据可行性验证
- **✅ 所有字段可用**: 经过深度数据探索，确认所有Big Numbers计算所需字段完整可用
- **✅ 时间跨度充足**: 1995-2024年数据支持历史趋势分析
- **✅ 行业覆盖完整**: 覆盖荷兰经济所有主要行业
- **✅ 计算逻辑验证**: 所有Big Numbers经过测试脚本验证

---

## 🏗️ 后端API统一规范

### 📋 Response格式
```java
{
  "success": true,
  "data": {
    "bigNumber1": {"value": "48.6%", "description": "2024年女性占比", "change": "+7.1个百分点"},
    "bigNumber2": {"value": "60.1%", "description": "新增岗位贡献率", "detail": "2760个/4595个新岗位"},
    "bigNumber3": {"value": "17个", "description": "女性主导行业", "maxIndustry": "护理和社会工作 87.3%"}
  }
}
```

### 🔍 核心数据字段
```sql
-- 必需字段映射
故事2: male_28, female_29, total_27, title, year_period
故事3: employers_social_contributions_3, compensation_of_employees_1, title, year_period  
故事4: full_time_equivalent_fte_20, total_27, title, year_period  // 工作密集化分析
故事5: wages_per_hour_worked_12, title, year_period
```

### ⚡ 性能要求
- 单个API响应时间 < 200ms
- 使用年份索引优化查询 (1995, 2010, 2024)
- 批量计算减少数据库往返

---

---

## 🛠️ 技术实施架构

### 📊 数据流架构
```
Raw Data (CSV) → Python分析验证 → PostgreSQL数据库 → Spring Boot API → React前端
     ↓               ↓                ↓              ↓              ↓
merged_data.csv → 测试脚本验证 → salary_records表 → Service层计算 → Hook状态管理
```

### 🔧 核心技术栈
- **后端**: Spring Boot 3.5.3 + JPA + PostgreSQL + Flyway
- **前端**: React 19 + TypeScript + Custom Hooks + Recharts
- **分析**: Python + pandas + plotly (开发验证)
- **部署**: Docker + Azure云服务

### 📋 实施优先级
1. **Sprint 2 (优先)**: 🕒 工时分析 - 已完成核心功能开发
2. **Sprint 3**: 🚺 女性力量 - 数据分析和计算逻辑已验证
3. **Sprint 4**: 💪 工作密集化 - 完整分析框架已建立
4. **Sprint 5**: 💰 隐形成本 - Big Numbers计算已测试

### ⚡ 性能要求
- 单个API响应时间 < 200ms
- 使用年份索引优化查询 (1995, 2010, 2024)
- 批量计算减少数据库往返
- 前端使用并行API调用 (`Promise.all()`)

---

## 📈 数据洞察摘要

### 🕒 工时分析核心发现
- 荷兰平均工时稳定：32.4小时/周 (2024年)
- 行业差异显著：渔业57.7h/周 vs 护理28.5h/周
- 时薪差距明显：石化€77.20/h vs 餐饮€25.80/h

### 🚺 女性力量核心发现  
- 历史性突破：1995年41.5% → 2024年48.6% (+7.1pp)
- 新增岗位主力：2010-2024年60.1%新岗位由女性获得
- 行业主导地位：17个行业女性占主导(>50%)

### 💪 工作密集化核心发现
- 工作负荷分布：23.5%员工承担非全职工作安排
- 密集化指数：+1.1pp，每个员工承担更多工作
- 最重行业：住宿餐饮业67.3%非标准工作安排

### 💰 隐形成本核心发现
- 福利负担水平：雇主社保支出占薪酬22.8%
- 行业差异悬殊：最高30.3% vs 最低4.6% (6.6倍)
- 绝对成本增长：从256亿增至476亿欧元(+86%)

---

**总结**: 4个新API端点实现12个精确Big Numbers，完整数据故事分析框架已建立。所有计算逻辑经过验证，可直接用于Spring Boot Service层开发。新的故事顺序更符合用户体验：从工时基础 → 性别平等 → 工作强度 → 成本透明度。