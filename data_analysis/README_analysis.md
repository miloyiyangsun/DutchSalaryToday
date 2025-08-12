# 🇳🇱 荷兰薪酬数据交叉表分析

## 概述

这个分析工具包提供了荷兰薪酬数据的**交叉表分析（Cross-tabulation）**功能，支持：

- 📊 **行业×指标交叉表**: 100+行业 × 36个薪酬指标
- 📅 **年份筛选**: 1995-2024年度数据选择
- 🔍 **缺失值可视化**: 热力图显示数据完整性
- 🎛️ **交互式分析**: Streamlit web应用 + Jupyter notebook

## 🚀 快速开始

### 1. 安装依赖

```bash
cd data_analysis
pip install -r requirements.txt
```

### 2. 运行分析

**选项A: 命令行脚本分析**
```bash
python cross_tab_analysis_phase4.py
```

**选项B: 交互式Web应用**
```bash
streamlit run interactive_crosstab_app.py
```

**推荐**: 使用Streamlit进行所有交互式分析

## 📂 文件说明

### 核心分析文件

| 文件 | 功能 | 使用场景 |
|------|------|----------|
| `cross_tab_analysis_phase4.py` | 数据预处理和交叉表生成 | 批量分析，数据导出 |
| `interactive_crosstab_app.py` | Streamlit交互式应用 | 实时数据探索 |

### 输入数据文件

| 文件 | 描述 |
|------|------|
| `merged_data.csv` | 合并后的完整数据（来自Phase 1） |
| `compensation_matrix.csv` | 薪酬数据矩阵 |
| `industry_year_matrix.csv` | 行业年份记录矩阵 |

### 输出结果文件

| 文件 | 描述 |
|------|------|
| `crosstab_YYYY_complete.csv` | 指定年份完整交叉表 |
| `year_completeness_analysis.csv` | 年份数据完整性分析 |
| `metric_completeness_analysis.csv` | 指标数据完整性分析 |
| `multi_year_comparison.csv` | 多年份对比分析 |

## 🎛️ 使用指南

### Streamlit Web应用

启动后访问 `http://localhost:8501`

**功能特性**:
- 🎯 年份选择器（1995-2024）
- 📊 指标分组选择（薪酬相关、工时相关、性别统计、全部指标）
- 🔍 行业关键词筛选
- 📈 缺失值趋势图
- 💾 数据导出功能

### Python脚本

**批量分析功能**:
- 自动生成所有年份的交叉表
- 数据完整性统计
- CSV结果导出

## 📊 数据结构

### 交叉表维度
- **行（Y轴）**: ~100个行业分类
- **列（X轴）**: 36个薪酬相关指标
- **筛选器**: 年份选择（1995-2024）

### 36个指标类别

| 指标类型 | 示例指标 | 数量 |
|----------|----------|------|
| 薪酬总额 | CompensationOfEmployees_1, WagesAndSalaries_2 | ~7个 |
| 人均指标 | CompensationPerFte_8, WagesPerFte_9 | ~12个 |
| 工时数据 | HoursWorked_21, HoursPaid_22 | ~6个 |
| 人力统计 | FullTimeEquivalentFte_20, Total_27 | ~11个 |

### 缺失值处理
- **显示方式**: "缺失" 文本标记
- **可视化**: 红色=缺失，蓝色=有数据
- **统计**: 缺失率百分比计算

## 🔍 分析方法论

### 交叉表分析（Cross-tabulation）

这是一种**主流的数据分析方法**，广泛应用于：
- 📈 市场研究和商业智能
- 🏭 行业指标对比分析
- 👥 员工数据分析
- 📊 供应链管理

**优势**:
- 直观展示分类变量间关系
- 支持多维度数据探索
- 便于发现数据模式和趋势
- 适合缺失值模式分析

## 🛠️ 技术栈

| 组件 | 技术 | 用途 |
|------|------|------|
| 数据处理 | pandas, numpy | 交叉表生成，数据转换 |
| 可视化 | plotly, seaborn, matplotlib | 交互式图表，热力图 |
| Web界面 | streamlit | 交互式数据应用 |
| 缺失值分析 | missingno | 专业缺失值可视化 |

## 📈 使用示例

### 1. 查看2023年制造业薪酬数据

```python
# 在Python脚本中
python cross_tab_analysis_phase4.py

# 在Streamlit应用中
# 年份选择: 2023
# 指标组: 薪酬相关
# 行业筛选: Manufacturing
```

### 2. 查看所有36个指标

```bash
# 在Streamlit应用中
# 指标组: 全部指标
# 点击: ✅ 全选按钮
# 查看完整的行业×指标矩阵
```

## 🚀 扩展功能

### 即将支持的功能
- 🔄 数据刷新和更新机制
- 📱 移动端响应式布局
- 📊 更多图表类型（散点图、箱线图）
- 🎯 行业对比和排名功能
- 📈 趋势预测和分析

### 集成计划
- 🌐 集成到主应用的frontend/backend
- 🗄️ 连接PostgreSQL数据库
- ☁️ 部署到Azure云平台

## 📞 使用支持

如果遇到问题，请检查：
1. 📦 依赖是否正确安装 (`pip install -r requirements.txt`)
2. 📁 数据文件是否存在 (`merged_data.csv`)
3. 🐍 Python版本兼容性 (推荐Python 3.9+)

---

**📊 这就是你要的行业×指标交叉表分析工具！现在可以开始探索荷兰薪酬数据的深层模式了。**