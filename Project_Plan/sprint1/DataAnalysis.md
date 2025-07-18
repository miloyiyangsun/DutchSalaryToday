# Sprint 1 - 数据分析任务：详细执行计划

**目标**: 在 Jupyter Notebook 中，验证并计算出故事所需的三个确切的“大数字”：“增长冠军 (Growth Champion)”、“衰退之王 (Recession King)”和“差距倍数 (Gap Multiplier)”。

**核心工具栈 (Core Tool Stack)**:

*   **编程语言 (Programming Language)**: Python 3.11+
*   **核心库 (Core Libraries)**:
    *   `pandas`: 用于数据处理和分析 (for data manipulation and analysis)。
    *   `jupyterlab`: 用于交互式数据探索和文档记录 (for interactive data exploration and documentation)。
    *   `matplotlib` / `seaborn`: 用于数据可视化，以验证我们的发现 (for data visualization to validate our findings)。
*   **数据源 (Data Source)**: `/data_acquisition/raw_data/` 目录下的 JSON 文件。

---

## 详细步骤 (Step-by-Step To-Do List)

### 第 1 阶段：环境设置 (Phase 1: Environment Setup)

*   [ ] **任务 1.1: 创建并激活 Python 虚拟环境 (Create and Activate Python Virtual Environment)**
    *   **目的**: 隔离项目依赖，避免与其他项目的冲突。
    *   **操作**:
        1.  在项目根目录打开终端。
        2.  运行命令 `python3 -m venv .venv` 来创建一个名为 `.venv` 的虚拟环境。
        3.  运行命令 `source .venv/bin/activate` 来激活虚拟环境。

*   [ ] **任务 1.2: 安装必要的 Python 库 (Install Necessary Python Libraries)**
    *   **目的**: 获取数据分析所需的所有工具。
    *   **操作**: 在激活的虚拟环境中，运行 `pip install pandas jupyterlab matplotlib seaborn`。

*   [ ] **任务 1.3: 启动 JupyterLab (Launch JupyterLab)**
    *   **目的**: 启动我们的交互式开发环境。
    *   **操作**: 在终端中运行 `jupyter lab`。这将在您的浏览器中打开 JupyterLab 界面。

*   [ ] **任务 1.4: 创建新的 Jupyter Notebook (Create a New Jupyter Notebook)**
    *   **目的**: 为我们的分析工作创建一个专门的文件。
    *   **操作**: 在 JupyterLab 界面中，导航到 `/data_acquisition/` 目录，然后创建一个新的 Notebook，并将其命名为 `Sprint1_Industry_Analysis.ipynb`。

### 第 2 阶段：数据加载与预处理 (Phase 2: Data Loading and Preprocessing)

*   [ ] **任务 2.1: 加载数据集 (Load Datasets)**
    *   **目的**: 将原始数据读入 Pandas DataFrames。
    *   **操作**: 在 Notebook 的第一个单元格中，编写 Python 代码以加载以下 JSON 文件：
        *   `TypedDataSet.json`: 核心数据。
        *   `DataProperties.json`: 描述数据列（例如，行业）。
        *   `Periods.json`: 描述时间周期。
        *   `SectorBranchesSIC2008.json`: 行业代码和名称的映射。

*   [ ] **任务 2.2: 数据理解与探索 (Data Understanding and Exploration)**
    *   **目的**: 初步了解数据的结构、内容和质量。
    *   **操作**: 使用 `.head()`, `.info()`, `.describe()` 等 Pandas 函数来检查每个 DataFrame。

*   [ ] **任务 2.3: 数据清洗与转换 (Data Cleaning and Transformation)**
    *   **目的**: 将分散的数据合并成一个单一的、可分析的 DataFrame。
    *   **操作**:
        1.  **合并 (Merge)**: 将 `TypedDataSet` 与 `SectorBranchesSIC2008` 和 `Periods` 合并，以获得包含行业名称和年份的完整数据集。
        2.  **数据类型转换 (Type Conversion)**: 确保薪资和年份列是数字类型，以便进行计算。
        3.  **处理缺失值 (Handle Missing Values)**: 检查并决定如何处理任何缺失的数据（例如，删除或填充）。

### 第 3 阶段：核心指标计算 (Phase 3: Core Metric Calculation)

*   [ ] **任务 3.1: 筛选相关数据 (Filter Relevant Data)**
    *   **目的**: 将分析范围缩小到我们的故事所需的数据。
    *   **操作**: 筛选出 `Periods` 为 **2010** 和 **2024** 的数据。

*   [ ] **任务 3.2: 计算每个行业的薪资增长率 (Calculate Salary Growth Rate for Each Industry)**
    *   **目的**: 找出每个行业在 15 年间的变化。
    *   **操作**:
        1.  使用 `.pivot_table()` 或 `.groupby()` 来重塑数据，使每个行业有一行，列为 2010 年和 2024 年的薪资。
        2.  计算增长率：`(Salary_2024 - Salary_2010) / Salary_2010`。

*   [ ] **任务 3.3: 识别“增长冠军”和“衰退之王” (Identify 'Growth Champion' and 'Recession King')**
    *   **目的**: 找到增长最快和最慢（或下降最多）的行业。
    *   **操作**:
        1.  对计算出的增长率进行排序。
        2.  找到增长率最高和最低的行业。

*   [ ] **任务 3.4: 计算“差距倍数” (Calculate 'Gap Multiplier')**
    *   **目的**: 量化 2024 年薪资最高和最低行业之间的差距。
    *   **操作**:
        1.  找到 2024 年薪资最高和最低的行业。
        2.  计算倍数：`Highest_Salary_2024 / Lowest_Salary_2024`。

### 第 4 阶段：结果验证与文档记录 (Phase 4: Validation and Documentation)

*   [ ] **任务 4.1: 可视化验证 (Visual Validation)**
    *   **目的**: 使用图表直观地确认我们的计算结果。
    *   **操作**: 使用 `matplotlib` 或 `seaborn` 创建条形图，显示增长率最高和最低的几个行业，以及 2024 年薪资最高和最低的行业。

*   [ ] **任务 4.2: 记录最终的“大数字” (Document the Final 'Big Numbers')**
    *   **目的**: 清晰地呈现我们的最终发现，以便后端开发人员使用。
    *   **操作**: 在 Notebook 的末尾，使用 Markdown 单元格清晰地写下三个“大数字”及其对应的行业。

*   [ ] **任务 4.3: 代码审查和清理 (Code Review and Cleanup)**
    *   **目的**: 确保 Notebook 代码清晰、可读且可重现。
    *   **操作**: 删除不必要的代码，添加注释，并确保整个分析流程逻辑清晰。

---

**可交付成果 (Deliverable)**: 一个名为 `Sprint1_Industry_Analysis.ipynb` 的 Jupyter Notebook，其中包含所有代码、可视化图表和最终计算出的三个“大数字”。