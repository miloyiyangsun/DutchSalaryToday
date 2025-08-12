- [ ]

步骤 1: 环境准备

cd /Users/sunyiyang/Desktop/DutchSalaryToday/data_analysis
**pip install -r requirements.txt**

步骤 2: 数据整合

python data_integration_phase1.py
作用: 读取../data_acquisition/raw_data/中的 2 个 JSON 文件，合并后生成 merged
\_data.csv

步骤 3: 验证数据生成

ls -la merged_data.csv
head -3 merged_data.csv
确认: merged_data.csv 文件存在且有内容

步骤 4: 启动交互式应用

**streamlit run interactive_crosstab_app.py**
结果: 浏览器自动打开 http://localhost:8501

步骤 5: 使用交互界面

1. 选择年份 - 侧边栏年份下拉框
2. 选择指标组 - 薪酬相关/工时相关/性别统计/全部指标
3. 点击全选 - ✅ 全选按钮选择所有 36 个指标
4. 筛选行业 - 输入关键词过滤行业
5. 查看结果 - 100 行业 ×36 指标交叉表

📋 完整命令序列

cd data_analysis
pip install -r requirements.txt
python data_integration_phase1.py
streamlit run interactive_crosstab_app.py

总时间: 约 2-3 分钟（取决于数据大小和网络）
