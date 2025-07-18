# Sprint 1 - 数据分析任务：详细执行计划！！

**目标**: 在 Jupyter Notebook 中，验证并计算出故事所需的三个确切的“大数字”：“增长冠军 (Growth Champion)”、“衰退之王 (Recession King)”和“差距倍数 (Gap Multiplier)”。

**核心工具栈 (Core Tool Stack)**:

- **编程语言 (Programming Language)**: Python 3.11+
- **核心库 (Core Libraries)**:
  - `pandas`: 用于数据处理和分析 (for data manipulation and analysis)。
  - `jupyterlab`: 用于交互式数据探索和文档记录 (for interactive data exploration and documentation)。
  - `matplotlib` / `seaborn`: 用于数据可视化，以验证我们的发现 (for data visualization to validate our findings)。
- **数据源 (Data Source)**: `/data_acquisition/raw_data/` 目录下的 JSON 文件。

---

## 详细步骤 (Step-by-Step To-Do List)

### ✅ 第 1 阶段：环境设置 (Phase 1: Environment Setup)

- ✅ **任务 1.1: 创建并激活 Python 虚拟环境 (Create and Activate Python Virtual Environment)**

  - **目的**: 隔离项目依赖，避免与其他项目的冲突。
  - **操作**:
    1.  在项目根目录打开终端。
    2.  运行命令 `python3 -m venv .venv` 来创建一个名为 `.venv` 的虚拟环境。
    3.  运行命令 `source .venv/bin/activate` 来激活虚拟环境。

- ✅ **任务 1.2: 安装必要的 Python 库 (Install Necessary Python Libraries)**

  - **目的**: 获取数据分析所需的所有工具。
  - **操作**: 在激活的虚拟环境中，运行 `pip install pandas jupyterlab matplotlib seaborn`。

- ✅ **任务 1.3: 启动 JupyterLab (Launch JupyterLab)**

  - **目的**: 启动我们的交互式开发环境。
  - **操作**: 在终端中运行 `jupyter lab`。这将在您的浏览器中打开 JupyterLab 界面。

- ✅ **任务 1.4: 创建新的 Jupyter Notebook (Create a New Jupyter Notebook)**
  - **目的**: 为我们的分析工作创建一个专门的文件。
  - **操作**: 在 JupyterLab 界面中，导航到 `/Users/sunyiyang/Desktop/DutchSalaryToday/data_analysis` 目录，然后创建一个新的 Notebook，并将其命名为 `Sprint1_Industry_Analysis.ipynb`。

### 第 2 阶段：数据加载与预处理 (Phase 2: Data Loading and Preprocessing)

- [ ] **任务 2.1: 正确加载JSON数据 (Correctly Load JSON Data)**

  - **目的**: 基于实际数据结构正确加载数据。
  - **操作**: 
    1. 创建函数 `load_typed_dataset(file_path)` 正确处理 TypedDataSet.json（这是一个列表，不是字典）：
       ```python
       # 加载主数据集 - 注意这是一个列表结构
       with open(file_path, 'r') as f:
           typed_data = json.load(f)  # 直接是列表
       df = pd.DataFrame(typed_data)
       ```
    2. 加载辅助数据文件：
       - `SectorBranchesSIC2008.json`: 行业代码映射
       - `Periods.json`: 年份映射
  - **验收标准**: 
    - TypedDataSet 正确加载为 DataFrame，包含所有年份数据
    - 行业和年份映射表正确加载
    - 无 "list indices must be integers" 错误

- [ ] **任务 2.2: 数据结构分析与清理 (Data Structure Analysis and Cleaning)**

  - **目的**: 理解实际数据结构并进行必要的清理。
  - **操作**: 
    1. 创建函数 `analyze_data_structure(df)` 分析：
       - 检查列名模式（CompensationOfEmployees_1, WagesAndSalaries_2 等）
       - 识别薪酬相关的关键列
       - 统计空值分布
    2. 创建函数 `clean_salary_data(df)` 执行：
       - 将薪酬列转换为数值类型
       - 处理空值（null）
       - 过滤掉数据质量差的记录
  - **验收标准**: 
    - 清楚了解数据结构和字段含义
    - 薪酬数据正确转换为数值类型
    - 空值得到合理处理

- [ ] **任务 2.3: 行业映射与数据整合 (Industry Mapping and Data Integration)**

  - **目的**: 将行业代码转换为可读的行业名称。
  - **操作**: 
    1. 创建函数 `map_industries(main_df, sector_df)` 执行：
       - 使用 SectorBranchesSIC2008 字段进行映射
       - 将行业代码替换为行业名称
       - 保留原始代码用于验证
    2. 创建函数 `map_periods(df, periods_df)` 执行：
       - 将 Periods 字段映射为具体年份
       - 确保年份格式正确
  - **验收标准**: 
    - 所有行业代码成功映射为可读名称
    - 年份信息正确提取和格式化
    - 映射过程无数据丢失

### 第 3 阶段：核心指标计算 (Phase 3: Core Metric Calculation)

- [ ] **任务 3.1: 筛选2010-2024年数据 (Filter 2010-2024 Data)**

  - **目的**: 筛选出故事所需的时间范围数据。
  - **操作**: 
    1. 创建函数 `filter_target_years(df, periods_df)` 执行：
       - 从 Periods 映射中找到2010和2024对应的 Key 值
       - 筛选主数据集中对应这两个年份的记录
       - 验证数据完整性和质量
    2. 创建函数 `validate_year_data(filtered_df)` 检查：
       - 确保两个年份都有足够的行业数据
       - 识别缺失数据的行业
       - 报告数据覆盖情况
  - **验收标准**: 
    - 成功提取2010和2024年的完整数据
    - 数据质量检查通过
    - 明确记录哪些行业有完整的两年数据

- [ ] **任务 3.2: 计算薪酬增长率 (Calculate Compensation Growth Rate)**

  - **目的**: 计算每个行业2010-2024年间的薪酬增长。
  - **操作**: 
    1. 创建函数 `calculate_industry_growth(df_2010, df_2024, salary_column='CompensationOfEmployees_1')` 执行：
       - 按行业匹配2010和2024年的薪酬数据
       - 计算绝对增长：`salary_2024 - salary_2010`
       - 计算相对增长率：`(salary_2024 - salary_2010) / salary_2010 * 100`
       - 处理除零错误和异常值
    2. 创建函数 `rank_growth_performance(growth_df)` 执行：
       - 按增长率排序所有行业
       - 计算增长率的统计分布
       - 标识异常值和可能的数据错误
  - **验收标准**: 
    - 所有有效行业的增长率计算正确
    - 增长率数据合理，无明显计算错误
    - 结果按增长率排序，便于识别极值

- [ ] **任务 3.3: 识别增长冠军和衰退之王 (Identify Growth Champions and Decline Kings)**

  - **目的**: 找出增长最快和下降最多的行业。
  - **操作**: 
    1. 创建函数 `identify_growth_champion(growth_df)` 执行：
       - 找出增长率最高的行业
       - 提取其2010和2024年的具体薪酬数值
       - 计算具体的增长金额和百分比
    2. 创建函数 `identify_decline_king(growth_df)` 执行：
       - 找出增长率最低（可能为负）的行业
       - 提取其2010和2024年的具体薪酬数值
       - 计算具体的下降金额和百分比
  - **验收标准**: 
    - 准确识别增长冠军和衰退之王
    - 提供完整的数值支撑（行业名、具体金额、增长率）
    - 数据经过验证，确保准确性

- [ ] **任务 3.4: 计算2024年薪酬差距倍数 (Calculate 2024 Salary Gap Multiplier)**

  - **目的**: 量化2024年薪酬最高和最低行业间的差距。
  - **操作**: 
    1. 创建函数 `find_salary_extremes_2024(df_2024, salary_column='CompensationOfEmployees_1')` 执行：
       - 找出2024年薪酬最高的行业及其数值
       - 找出2024年薪酬最低的行业及其数值
       - 验证数据有效性（非空、非零）
    2. 创建函数 `calculate_gap_multiplier(highest_salary, lowest_salary)` 执行：
       - 计算倍数：`highest_salary / lowest_salary`
       - 格式化结果为易读格式
       - 提供上下文解释
  - **验收标准**: 
    - 准确计算薪酬差距倍数
    - 提供最高和最低薪酬行业的详细信息
    - 结果数值合理且经过验证

### 第 4 阶段：结果验证与文档记录 (Phase 4: Validation and Documentation)

- [ ] **任务 4.1: 可视化验证 (Visual Validation)**

  - **目的**: 使用图表直观地确认我们的计算结果。
  - **操作**: 
    1. 创建函数 `visualize_growth_rates(growth_rate_df, top_n=5)` 执行以下操作：
       - 绘制增长率最高和最低的 N 个行业的条形图。
       - 添加标题、坐标轴标签和图例。
       - 保存图表为 PNG 文件。
    2. 创建函数 `visualize_salary_comparison(filtered_df, end_year)` 执行以下操作：
       - 绘制结束年份薪资最高和最低的 N 个行业的条形图。
       - 添加标题、坐标轴标签和图例。
       - 保存图表为 PNG 文件。
  - **验收标准**: 
    - 成功生成清晰的可视化图表。
    - 图表能够直观地展示增长率和薪资差异。
    - 图表保存到指定位置，文件格式正确。

- [ ] **任务 4.2: 记录最终的“大数字” (Document the Final 'Big Numbers')**

  - **目的**: 清晰地呈现我们的最终发现，以便后端开发人员使用。
  - **操作**: 
    1. 创建函数 `document_big_numbers(growth_champion, recession_king, gap_multiplier, highest_salary, lowest_salary)` 执行以下操作：
       - 在 Notebook 的末尾创建一个 Markdown 单元格。
       - 以清晰的格式记录三个“大数字”及其对应的行业。
       - 添加简短的解释和洞察。
  - **验收标准**: 
    - 成功创建包含所有“大数字”的 Markdown 单元格。
    - 信息准确无误，格式清晰易读。
    - 解释简洁明了，提供有价值的洞察。

- [ ] **任务 4.3: 代码审查和清理 (Code Review and Cleanup)**

  - **目的**: 确保 Notebook 代码清晰、可读且可重现。
  - **操作**: 
    1. 创建函数 `cleanup_notebook(notebook_path)` 执行以下操作：
       - 删除不必要的代码和输出。
       - 为所有函数和关键代码段添加详细注释。
       - 确保代码逻辑清晰，顺序合理。
       - 添加目录和导航链接。
  - **验收标准**: 
    - 代码整洁，无冗余或无用的部分。
    - 所有关键代码都有清晰的注释。
    - Notebook 结构清晰，易于导航和理解。
    - 代码可重现，其他人能够按照步骤获得相同的结果。

---

**可交付成果 (Deliverable)**: 一个名为 `Sprint1_Industry_Analysis.ipynb` 的 Jupyter Notebook，其中包含所有代码、可视化图表和最终计算出的三个“大数字”。
