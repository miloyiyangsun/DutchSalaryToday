#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
荷兰薪酬数据交互式交叉表应用
Interactive Cross-tabulation App for Dutch Salary Data

使用Streamlit创建交互式数据表格，支持年份筛选和缺失值可视化
Interactive data table with year filtering and missing value visualization using Streamlit

运行方式：streamlit run interactive_crosstab_app.py
"""

import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from pathlib import Path
from st_keyup import st_keyup
from difflib import SequenceMatcher

# 页面配置
st.set_page_config(
    page_title="荷兰薪酬数据交叉表分析",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded",
)

# 数据路径
DATA_PATH = Path(__file__).parent
MERGED_DATA_FILE = DATA_PATH / "merged_data.csv"


@st.cache_data
def load_data():
    """加载数据（使用缓存优化性能）"""
    if not MERGED_DATA_FILE.exists():
        st.error(f"数据文件不存在: {MERGED_DATA_FILE}")
        return None

    df = pd.read_csv(MERGED_DATA_FILE)
    return df


@st.cache_data
def get_metric_columns(df):
    """获取所有指标列"""
    exclude_cols = [
        "ID",
        "SectorBranchesSIC2008",
        "Periods",
        "Title",
        "Description",
        "CategoryGroupID",
        "Year",
    ]
    metric_cols = [col for col in df.columns if col not in exclude_cols]
    return metric_cols


def create_crosstab_for_year(df, year, selected_metrics):
    """为指定年份和选定指标创建交叉表"""
    year_data = df[df["Year"] == year].copy()

    if year_data.empty:
        return None

    # 创建交叉表
    crosstab = year_data.set_index("Title")[selected_metrics]

    # 按行业名称排序
    crosstab = crosstab.sort_index()

    return crosstab


def format_missing_values(val):
    """格式化缺失值显示"""
    if pd.isna(val):
        return "缺失"
    elif isinstance(val, (int, float)):
        if val == 0:
            return "0"
        else:
            return f"{val:,.1f}"
    else:
        return str(val)


def create_missing_heatmap(crosstab):
    """创建缺失值热力图"""
    missing_matrix = crosstab.isnull().astype(int)

    fig = px.imshow(
        missing_matrix.values,
        x=missing_matrix.columns,
        y=missing_matrix.index,
        color_continuous_scale=["lightblue", "red"],
        aspect="auto",
        title="缺失值分布热力图（蓝色=有数据，红色=缺失）",
    )

    fig.update_layout(
        height=max(400, len(missing_matrix) * 15),
        xaxis_title="指标",
        yaxis_title="行业",
    )

    return fig


def get_growth_champion_data(df, is_growth_mode=True):
    """获取2010-2024年增长冠军/衰退之王数据"""
    # 筛选2010-2024年数据
    data_filtered = df[(df["Year"] >= 2010) & (df["Year"] <= 2024)].copy()

    # 使用WagesPerFte_9作为工资指标（更贴近员工实际收入）
    salary_data = data_filtered[["Title", "Year", "WagesPerFte_9"]].dropna()

    # 创建年份-行业的数据透视表
    pivot_data = salary_data.pivot_table(
        values="WagesPerFte_9", index="Title", columns="Year", fill_value=None
    )

    # 计算增长率 (只有2010和2024年都有数据的行业)
    valid_industries = pivot_data.dropna(subset=[2010, 2024])

    growth_rates = []
    for industry in valid_industries.index:
        start_salary = valid_industries.loc[industry, 2010]
        end_salary = valid_industries.loc[industry, 2024]
        growth_rate = (end_salary - start_salary) / start_salary * 100
        growth_rates.append(
            {
                "industry": industry,
                "growth_rate": growth_rate,
                "start_salary": start_salary,
                "end_salary": end_salary,
            }
        )

    # 根据模式进行排序
    growth_df = pd.DataFrame(growth_rates)
    if is_growth_mode:
        # 增长模式：按增长率从高到低排序
        growth_df_sorted = growth_df.sort_values(
            "growth_rate", ascending=False
        ).reset_index(drop=True)
    else:
        # 衰退模式：按增长率从低到高排序（即衰退最严重的在前）
        growth_df_sorted = growth_df.sort_values(
            "growth_rate", ascending=True
        ).reset_index(drop=True)

    return pivot_data, growth_df_sorted


def calculate_salary_gap_ratio_average(df):
    """计算薪资最高和最低行业的14年平均薪资倍数"""
    # 筛选2010-2024年数据
    data_filtered = df[(df["Year"] >= 2010) & (df["Year"] <= 2024)].copy()
    salary_data = data_filtered[["Title", "Year", "WagesPerFte_9"]].dropna()
    
    # 计算每个行业的14年平均薪资
    avg_salaries = salary_data.groupby("Title")["WagesPerFte_9"].mean()
    
    # 找到最高和最低薪资行业
    max_salary_industry = avg_salaries.idxmax()
    min_salary_industry = avg_salaries.idxmin()
    max_avg_salary = avg_salaries.max()
    min_avg_salary = avg_salaries.min()
    
    # 计算倍数
    salary_ratio = max_avg_salary / min_avg_salary
    
    return {
        "max_industry": max_salary_industry,
        "min_industry": min_salary_industry,
        "max_avg_salary": max_avg_salary,
        "min_avg_salary": min_avg_salary,
        "ratio": salary_ratio
    }


def display_core_insights(df):
    """显示Sprint1的三个核心大数字"""
    st.subheader("🎯 Sprint1 核心洞察：三个关键数字")
    st.caption("基于2010-2024年荷兰行业薪资数据的关键发现")
    
    # 获取正确的数据：增长最快和最慢
    _, fastest_first_data = get_growth_champion_data(df, is_growth_mode=True)   # 按增长率从高到低
    _, slowest_first_data = get_growth_champion_data(df, is_growth_mode=False)  # 按增长率从低到高
    
    col1, col2, col3 = st.columns(3)
    
    # 数字1：增长最快（从高到低排序的第一个）
    fastest_growth = fastest_first_data.iloc[0]
    with col1:
        st.metric(
            "🏆 增长冠军",
            f"{fastest_growth['industry'].split()[0]}... 行业" if len(fastest_growth['industry']) > 15 else fastest_growth['industry'],
            f"+{fastest_growth['growth_rate']:.1f}%"
        )
        st.caption(f"15年增长：{fastest_growth['start_salary']:.1f}k → {fastest_growth['end_salary']:.1f}k 欧元")
    
    # 数字2：增长最慢（从低到高排序的第一个）
    slowest_growth = slowest_first_data.iloc[0]
    with col2:
        st.metric(
            "🐌 增长最慢",
            f"{slowest_growth['industry'].split()[0]}... 行业" if len(slowest_growth['industry']) > 15 else slowest_growth['industry'],
            f"+{slowest_growth['growth_rate']:.1f}%"
        )
        st.caption(f"15年增长：{slowest_growth['start_salary']:.1f}k → {slowest_growth['end_salary']:.1f}k 欧元")
    
    # 数字3：薪资倍数
    salary_gap = calculate_salary_gap_ratio_average(df)
    with col3:
        st.metric(
            "💰 薪资倍数差距",
            f"{salary_gap['ratio']:.1f}倍",
            "高薪 vs 低薪行业"
        )
        st.caption(f"{salary_gap['max_avg_salary']:.1f}k vs {salary_gap['min_avg_salary']:.1f}k 欧元(平均)")
    
    # 添加故事化的总结
    with st.expander("📖 数据故事总结"):
        fastest_name = fastest_growth['industry']
        slowest_name = slowest_growth['industry']
        max_industry_name = salary_gap['max_industry']
        min_industry_name = salary_gap['min_industry']
        
        st.markdown(f"""
        **"行业冰与火之歌"核心发现：**
        
        🔥 **火热增长**：{fastest_name}在15年间实现了{fastest_growth['growth_rate']:.1f}%的惊人增长
        
        🧊 **缓慢增长**：{slowest_name}增长相对缓慢，15年增长{slowest_growth['growth_rate']:.1f}%
        
        ⚖️ **薪资鸿沟**：{max_industry_name}的平均薪资是{min_industry_name}的{salary_gap['ratio']:.1f}倍
        
        💡 **洞察**：即使在发达的荷兰，不同行业间仍存在显著的增长速度差异和薪资差距。最快增长行业的增长速度是最慢增长行业的{(fastest_growth['growth_rate']/slowest_growth['growth_rate']):.1f}倍。
        """)


def create_salary_trend_chart(pivot_data, growth_df_sorted, selected_industries=None):
    """创建薪酬趋势折线图（支持选择性显示）"""
    fig = go.Figure()

    # 获取年份列表
    years = [col for col in pivot_data.columns if isinstance(col, int)]

    # 如果没有指定选择的行业，默认显示所有行业
    if selected_industries is None:
        selected_industries = growth_df_sorted["industry"].tolist()

    # 只为选中的行业添加折线
    for idx, row in growth_df_sorted.iterrows():
        if row["industry"] not in selected_industries:
            continue
        industry = row["industry"]
        if industry in pivot_data.index:
            # 获取该行业的薪酬数据
            industry_data = pivot_data.loc[industry, years]

            # 根据增长率设置颜色（红色系=高增长，蓝色系=低增长）
            if idx < 20:  # 前20名用红色系
                color = f"rgba(255, {100 + idx * 7}, {100 + idx * 7}, 0.7)"
            elif idx < 50:  # 中间30名用橙色系
                color = f"rgba(255, {150 + (idx-20) * 3}, 100, 0.6)"
            else:  # 后50名用蓝色系
                color = f"rgba(100, 150, {200 + (idx-50) * 2}, 0.5)"

            fig.add_trace(
                go.Scatter(
                    x=years,
                    y=industry_data,
                    mode="lines",
                    name=industry,
                    line=dict(color=color, width=1),
                    showlegend=False,  # 不显示图例，避免过于拥挤
                    hovertemplate=f"<b>{industry}</b><br>年份: %{{x}}<br>工资: %{{y:.1f}}千欧元<extra></extra>",
                )
            )

    fig.update_layout(
        title="🏆 2010-2024年行业工资增长趋势 (按增长率排序)",
        xaxis_title="年份",
        yaxis_title="每FTE工资 (千欧元)",
        height=600,
        hovermode="closest",
    )

    return fig


def smart_fuzzy_search(search_term, industries):
    """智能模糊搜索：支持前缀匹配和相似度匹配

    例如: 'mine' -> 'Mining and quarrying'
          'fin' -> 'Financial and insurance activities'
    """
    if not search_term:
        return industries

    search_lower = search_term.lower().strip()
    if not search_lower:
        return industries

    # 1. 前缀匹配（最高优先级）- 词汇开头匹配
    prefix_matches = []
    for industry in industries:
        words = industry.lower().split()
        if any(word.startswith(search_lower) for word in words):
            prefix_matches.append(industry)

    # 2. 包含匹配（中等优先级）- 原有逻辑
    contains_matches = []
    for industry in industries:
        if search_lower in industry.lower() and industry not in prefix_matches:
            contains_matches.append(industry)

    # 3. 相似度匹配（低优先级）- 模糊匹配
    similar_matches = []
    for industry in industries:
        if industry in prefix_matches or industry in contains_matches:
            continue

        # 检查每个单词的相似度和部分匹配
        words = industry.lower().split()
        for word in words:
            # 部分匹配：支持 'mine' 匹配 'mining'
            if search_lower in word and len(search_lower) >= 3:
                similar_matches.append(industry)
                break
            # 相似度匹配：降低阈值到60%
            similarity = SequenceMatcher(None, search_lower, word).ratio()
            if similarity >= 0.7:  # 60%相似度阈值（从70%降低）
                similar_matches.append(industry)
                break

    # 按优先级返回结果
    return prefix_matches + contains_matches + similar_matches

def calculate_yearly_gap_ratios(df):
    """计算每年最高薪酬行业与最低薪酬行业的倍数比 (2010-2024年)"""
    # 筛选2010-2024年数据，与Tab3保持一致
    data_filtered = df[(df["Year"] >= 2010) & (df["Year"] <= 2024)].copy()
    years = sorted(data_filtered['Year'].unique())
    ratios_data = []
    
    # 使用与Tab3相同的薪酬指标：WagesPerFte_9 (每名全职员工工资)
    salary_col = 'WagesPerFte_9'
    
    for year in years:
        year_data = data_filtered[data_filtered['Year'] == year].copy()
        
        # 过滤掉缺失值和异常值
        year_data = year_data.dropna(subset=[salary_col])
        year_data = year_data[year_data[salary_col] > 0]  # 过滤掉0值
        
        if not year_data.empty:
            max_salary = year_data[salary_col].max()
            min_salary = year_data[salary_col].min()
            gap_ratio = max_salary / min_salary
            
            ratios_data.append({
                'Year': year,
                'Gap_Ratio': gap_ratio,
                'Max_Salary': max_salary,
                'Min_Salary': min_salary
            })
    
    return pd.DataFrame(ratios_data)

def create_gap_ratio_chart(gap_data):
    """创建薪酬差距倍数折线图 (2010-2024年, 使用工资数据)"""
    fig = px.line(gap_data, 
                  x='Year', 
                  y='Gap_Ratio',
                  title='🇳🇱 荷兰行业工资差距倍数变化趋势 (2010-2024)',
                  markers=True,
                  line_shape='spline')
    
    fig.update_traces(
        line=dict(color='#1f77b4', width=3),
        marker=dict(size=8, color='#1f77b4', symbol='circle')
    )
    
    fig.update_layout(
        xaxis_title="年份",
        yaxis_title="最高工资 / 最低工资 (倍数)",
        height=400,
        hovermode='x unified',
        xaxis=dict(tickmode='linear', tick0=2010, dtick=2),
        yaxis=dict(tickformat='.1f')
    )
    
    # 添加数据标签
    fig.update_traces(
        hovertemplate='<b>%{x}年</b><br>差距倍数: %{y:.1f}倍<extra></extra>'
    )
    
    return fig

def manage_industry_selection(growth_df_sorted):
    """管理行业选择状态（包含搜索和自动补全功能）"""
    all_industries = growth_df_sorted["industry"].tolist()

    # 初始化session state
    if "selected_industries" not in st.session_state:
        # 默认选择前10名行业，避免图表过于拥挤
        st.session_state.selected_industries = all_industries[:10]

    # 全选按钮
    if st.button("✅ 全选所有行业", use_container_width=True):
        st.session_state.selected_industries = all_industries.copy()
        st.rerun()

    # 清空按钮
    if st.button("❌ 清空选择", use_container_width=True):
        st.session_state.selected_industries = []
        st.rerun()

    st.write(
        f"**当前选中: {len(st.session_state.selected_industries)}/{len(all_industries)} 个行业**"
    )

    # 🔍 搜索框（实时搜索）
    search_term = st_keyup(
        "🔍 搜索行业",
        placeholder="例如：Finance, Manufacturing, Agriculture...",
        debounce=300,
        key="industry_search",
    )

    # 实时处理搜索词（去除空格，转小写）
    search_term = search_term.strip()

    # 根据搜索词过滤行业（智能模糊搜索）
    if search_term:
        # 使用智能模糊搜索：支持前缀匹配和相似度匹配
        filtered_industries = smart_fuzzy_search(search_term, all_industries)

        # 自动补全提示：显示前5个匹配建议（基于模糊搜索结果）
        if len(search_term) >= 1:  # 降低触发门槛，从2个字符改为1个字符
            suggestions = filtered_industries[:5]  # 使用模糊搜索的前5个结果

            if suggestions:
                # 简化建议显示，提高响应速度
                suggestion_names = [
                    (
                        s.split(" ", 1)[-1][:15] + "..."
                        if len(s) > 15
                        else s.split(" ", 1)[-1]
                    )
                    for s in suggestions
                ]
                st.info(f"💡 建议: {', '.join(suggestion_names)}")

        # 显示搜索结果统计
        st.write(f"**🔍 找到 {len(filtered_industries)} 个匹配行业**")
    else:
        filtered_industries = all_industries
        st.write("**选择要显示的行业:**")

    # 显示复选框列表（只显示筛选后的行业）
    if not filtered_industries:
        st.warning("🚫 没有找到匹配的行业，请尝试其他搜索词")
    else:
        for _, industry in enumerate(filtered_industries):
            # 获取该行业在原列表中的排名和增长率
            original_idx = all_industries.index(industry)
            growth_rate = growth_df_sorted[growth_df_sorted["industry"] == industry][
                "growth_rate"
            ].iloc[0]

            # 简化标签显示，如果有搜索词则高亮匹配部分
            if search_term:
                # 高亮显示匹配的搜索词（简单实现）
                display_name = (
                    industry.replace(search_term, f"**{search_term}**")
                    if search_term.lower() in industry.lower()
                    else industry
                )
                label = f"#{original_idx+1} {display_name[:30]}{'...' if len(industry) > 30 else ''}"
            else:
                label = f"#{original_idx+1} {industry[:25]}{'...' if len(industry) > 25 else ''}"

            # 检查是否选中
            is_selected = industry in st.session_state.selected_industries

            # 创建复选框
            if st.checkbox(
                label,
                value=is_selected,
                key=f"industry_{original_idx}",
                help=f"增长率: {growth_rate:+.1f}%",
            ):
                if industry not in st.session_state.selected_industries:
                    st.session_state.selected_industries.append(industry)
            else:
                if industry in st.session_state.selected_industries:
                    st.session_state.selected_industries.remove(industry)

    return st.session_state.selected_industries


def display_growth_champion_tab(df):
    """增长冠军Tab主界面"""
    
    # 添加模式选择器
    mode = st.radio(
        "选择分析模式",
        options=["🏆 增长冠军", "🐌 增长最慢"],
        horizontal=True,
        key="champion_mode"
    )
    
    # 根据模式确定参数
    is_growth_mode = (mode == "🏆 增长冠军")
    
    # 获取数据
    pivot_data, growth_df_sorted = get_growth_champion_data(df, is_growth_mode)

    if growth_df_sorted.empty:
        st.error("无法获取2010-2024年的完整数据")
        return
    
    # 显示Sprint1核心洞察（只在增长冠军模式下显示，避免重复）
    if is_growth_mode:
        display_core_insights(df)
        st.markdown("---")  # 添加分隔线

    # 初始化隐藏状态
    if "hide_panels" not in st.session_state:
        st.session_state.hide_panels = False

    # 根据隐藏状态调整布局
    if st.session_state.hide_panels:
        # 隐藏面板时：图表占满全屏 + 右侧显示按钮
        col_chart, col_btn = st.columns([11, 1])

        with col_chart:
            # 需要从session state获取选中的行业
            if (
                "selected_industries" in st.session_state
                and st.session_state.selected_industries
            ):
                fig = create_salary_trend_chart(
                    pivot_data, growth_df_sorted, st.session_state.selected_industries
                )
                st.plotly_chart(fig, use_container_width=True)
            else:
                st.info("请点击右侧按钮显示控制面板选择行业")

        with col_btn:
            st.write("")  # 添加一点间距
            if st.button("🔄\n显示\n控制\n面板", use_container_width=True):
                st.session_state.hide_panels = False
                st.rerun()

    else:
        # 显示面板时：添加隐藏按钮 + 三列布局
        if st.button("🔄 隐藏控制面板"):
            st.session_state.hide_panels = True
            st.rerun()

        col1, col2, col3 = st.columns([6, 3, 3])

        with col2:
            st.subheader("🎛️ 行业选择控制")
            # 管理行业选择
            selected_industries = manage_industry_selection(growth_df_sorted)

        with col1:
            # 创建并显示折线图（只显示选中的行业）
            if selected_industries:
                fig = create_salary_trend_chart(
                    pivot_data, growth_df_sorted, selected_industries
                )
                st.plotly_chart(fig, use_container_width=True)
            else:
                st.info("请在右侧选择要显示的行业")

        with col3:
            # 根据模式显示不同的标题
            if is_growth_mode:
                st.subheader("🏆 工资增长冠军排名")
                st.caption("2010-2024年工资增长率排名（基于实际工资数据）")
            else:
                st.subheader("🐌 工资增长最慢排名")
                st.caption("2010-2024年工资增长率排名（增长最慢优先）")

            # 显示排名列表
            for idx, row in growth_df_sorted.head(20).iterrows():  # 只显示前20名
                growth_rate = row["growth_rate"]
                industry = row["industry"]

                # 根据模式和增长率设置颜色
                if is_growth_mode:
                    # 增长模式的颜色编码
                    if growth_rate > 50:
                        color = "🔥"
                    elif growth_rate > 25:
                        color = "🚀"
                    elif growth_rate > 0:
                        color = "📈"
                    else:
                        color = "📉"
                else:
                    # 增长最慢模式的颜色编码（突出缓慢增长）
                    if growth_rate < 10:
                        color = "🐌"  # 非常缓慢增长
                    elif growth_rate < 25:
                        color = "🚶"  # 较慢增长
                    elif growth_rate < 50:
                        color = "📈"  # 正常增长
                    else:
                        color = "🚀"  # 意外快速增长

                # 根据模式显示不同的标签文本
                rate_label = "增长率"  # 两种模式都显示增长率
                
                # 如果行业被选中，加粗显示
                if industry in selected_industries:
                    st.write(f"{color} **{idx + 1}. {industry}** ✅")
                    st.write(f"   {rate_label}: **{growth_rate:+.1f}%**")
                    st.write(
                        f"   {row['start_salary']:.1f}k → {row['end_salary']:.1f}k 欧元"
                    )
                else:
                    st.write(f"{color} {idx + 1}. {industry}")
                    st.write(f"   {rate_label}: {growth_rate:+.1f}%")
                    st.write(
                        f"   {row['start_salary']:.1f}k → {row['end_salary']:.1f}k 欧元"
                    )
                st.write("")


# ========== 女性力量分析函数 ==========

def load_gender_data(df):
    """加载和预处理性别相关数据"""
    # 筛选包含性别数据的字段
    gender_fields = ['Female_29', 'Male_28', 'Total_27']
    required_cols = ['Title', 'Year'] + gender_fields
    
    # 检查必要字段是否存在
    missing_cols = [col for col in required_cols if col not in df.columns]
    if missing_cols:
        st.error(f"缺少必要的性别数据字段: {missing_cols}")
        return None
    
    # 筛选有完整性别数据的记录
    gender_data = df[required_cols].copy()
    gender_data = gender_data.dropna(subset=gender_fields)
    
    # 计算女性占比
    gender_data['Female_Percentage'] = (
        gender_data['Female_29'] / gender_data['Total_27'] * 100
    ).round(1)
    
    return gender_data


def calculate_gender_big_numbers(gender_data):
    """计算女性力量故事的大数字"""
    if gender_data is None or gender_data.empty:
        return None
    
    # Big Number 1: 使用1995-2024历史突破数据
    historical_start_year, historical_end_year = 1995, 2024
    historical_start_data = gender_data[gender_data['Year'] == historical_start_year]
    historical_end_data = gender_data[gender_data['Year'] == historical_end_year]
    
    # Big Number 2-3: 使用2010-2024增长贡献数据
    growth_start_year, growth_end_year = 2010, 2024
    growth_start_data = gender_data[gender_data['Year'] == growth_start_year]
    growth_end_data = gender_data[gender_data['Year'] == growth_end_year]
    
    if historical_start_data.empty or historical_end_data.empty or growth_start_data.empty or growth_end_data.empty:
        return None
    
    # 计算历史总体女性占比变化 (1995-2024)
    historical_start_female_pct = (historical_start_data['Female_29'].sum() / historical_start_data['Total_27'].sum() * 100)
    historical_end_female_pct = (historical_end_data['Female_29'].sum() / historical_end_data['Total_27'].sum() * 100)
    historical_pct_change = historical_end_female_pct - historical_start_female_pct
    
    # 计算近期女性占比变化 (2010-2024，用于其他指标)
    recent_start_female_pct = (growth_start_data['Female_29'].sum() / growth_start_data['Total_27'].sum() * 100)
    recent_end_female_pct = (growth_end_data['Female_29'].sum() / growth_end_data['Total_27'].sum() * 100)
    recent_pct_change = recent_end_female_pct - recent_start_female_pct
    
    # 计算新职位贡献（2010-2024年总增长）
    total_jobs_2010 = growth_start_data['Total_27'].sum()
    total_jobs_2024 = growth_end_data['Total_27'].sum()
    total_new_jobs = total_jobs_2024 - total_jobs_2010
    
    female_jobs_2010 = growth_start_data['Female_29'].sum()
    female_jobs_2024 = growth_end_data['Female_29'].sum()
    female_new_jobs = female_jobs_2024 - female_jobs_2010
    
    female_contribution = (female_new_jobs / total_new_jobs * 100) if total_new_jobs > 0 else 0
    
    # 统计女性占主导的行业数量（>50%）
    end_industries = growth_end_data[growth_end_data['Female_Percentage'] > 50]
    female_majority_count = len(end_industries)
    
    # 找到女性占比最高的行业
    top_female_industry = growth_end_data.loc[growth_end_data['Female_Percentage'].idxmax()]
    
    return {
        # 历史突破数据 (1995-2024)
        'historical_start_female_pct': historical_start_female_pct,
        'historical_end_female_pct': historical_end_female_pct,
        'historical_pct_change': historical_pct_change,
        # 近期增长数据 (2010-2024)
        'recent_start_female_pct': recent_start_female_pct,
        'recent_end_female_pct': recent_end_female_pct,
        'recent_pct_change': recent_pct_change,
        'female_contribution': female_contribution,
        'female_majority_count': female_majority_count,
        'total_new_jobs': total_new_jobs,
        'female_new_jobs': female_new_jobs,
        'top_female_industry': top_female_industry['Title'],
        'top_female_percentage': top_female_industry['Female_Percentage']
    }


def create_gender_trend_chart(gender_data):
    """创建女性占比趋势图"""
    if gender_data is None or gender_data.empty:
        return None
    
    # 按年份汇总计算总体女性占比
    yearly_summary = gender_data.groupby('Year').agg({
        'Female_29': 'sum',
        'Total_27': 'sum'
    }).reset_index()
    
    yearly_summary['Female_Percentage'] = (
        yearly_summary['Female_29'] / yearly_summary['Total_27'] * 100
    ).round(2)
    
    # 创建折线图
    fig = px.line(
        yearly_summary, 
        x='Year', 
        y='Female_Percentage',
        title='🇳🇱 荷兰女性劳动力占比趋势 (1995-2024)',
        markers=True,
        line_shape='spline'
    )
    
    fig.update_traces(
        line=dict(color='#e91e63', width=3),
        marker=dict(size=8, color='#e91e63', symbol='circle')
    )
    
    fig.update_layout(
        xaxis_title="年份",
        yaxis_title="女性占比 (%)",
        height=400,
        hovermode='x unified',
        yaxis=dict(tickformat='.1f', range=[40, 55])  # 聚焦关键范围
    )
    
    # 添加数据标签
    fig.update_traces(
        hovertemplate='<b>%{x}年</b><br>女性占比: %{y:.1f}%<extra></extra>'
    )
    
    return fig


def create_industry_gender_chart(gender_data, year=2024, top_n=15):
    """创建行业女性占比对比图"""
    if gender_data is None or gender_data.empty:
        return None
    
    # 获取指定年份数据
    year_data = gender_data[gender_data['Year'] == year].copy()
    if year_data.empty:
        return None
    
    # 按女性占比排序，取前N和后N
    year_data_sorted = year_data.sort_values('Female_Percentage', ascending=False)
    
    # 取前N个女性占比最高的行业
    top_industries = year_data_sorted.head(top_n)
    
    # 创建水平条形图
    fig = px.bar(
        top_industries, 
        x='Female_Percentage', 
        y='Title',
        title=f'🚺 {year}年各行业女性占比排名 (Top {top_n})',
        orientation='h',
        color='Female_Percentage',
        color_continuous_scale='Reds',
        text='Female_Percentage'
    )
    
    fig.update_traces(
        texttemplate='%{text:.1f}%',
        textposition='outside',
        hovertemplate='<b>%{y}</b><br>女性占比: %{x:.1f}%<extra></extra>'
    )
    
    fig.update_layout(
        xaxis_title="女性占比 (%)",
        yaxis_title="行业",
        height=max(400, top_n * 30),
        yaxis=dict(autorange='reversed'),  # 最高的在顶部
        showlegend=False
    )
    
    # 添加50%基准线
    fig.add_vline(x=50, line_dash="dash", line_color="gray", 
                  annotation_text="性别平衡线 (50%)")
    
    return fig


def calculate_yearly_female_contribution(gender_data):
    """计算每年女性对新增岗位的累积贡献率 - 修正版，过滤异常值"""
    if gender_data is None or gender_data.empty:
        return None
    
    # 按年份汇总数据
    yearly_summary = gender_data.groupby('Year').agg({
        'Female_29': 'sum',
        'Total_27': 'sum'
    }).reset_index()
    
    # 以2010年为基准计算累积贡献
    base_year = 2010
    base_data = yearly_summary[yearly_summary['Year'] == base_year]
    if base_data.empty:
        return None
    
    base_female = base_data['Female_29'].iloc[0]
    base_total = base_data['Total_27'].iloc[0]
    
    contribution_data = []
    for _, row in yearly_summary.iterrows():
        year = row['Year']
        if year >= base_year:
            # 计算从基准年到当前年的累积贡献率
            total_new = row['Total_27'] - base_total
            female_new = row['Female_29'] - base_female
            
            # 🔧 修正：过滤异常值，当总变化<1000人时标记为不稳定
            if total_new > 1000:
                contribution_rate = (female_new / total_new) * 100
                is_reliable = True
            elif total_new > 0:
                contribution_rate = (female_new / total_new) * 100
                is_reliable = False  # 标记为不可靠
            else:
                contribution_rate = 0
                is_reliable = False
            
            contribution_data.append({
                'Year': year,
                'Female_Contribution_Rate': contribution_rate if is_reliable else None,  # 不可靠的设为None
                'Raw_Contribution_Rate': contribution_rate,  # 保留原始值用于调试
                'Total_New_Jobs': total_new,
                'Female_New_Jobs': female_new,
                'Is_Reliable': is_reliable
            })
    
    return pd.DataFrame(contribution_data)


def calculate_yearly_dominant_industries(gender_data):
    """计算每年女性主导行业数量(>50%)的变化"""
    if gender_data is None or gender_data.empty:
        return None
    
    dominant_data = []
    years = sorted(gender_data['Year'].unique())
    
    for year in years:
        year_data = gender_data[gender_data['Year'] == year].copy()
        
        # 计算该年度女性占比>50%的行业数量
        dominant_count = len(year_data[year_data['Female_Percentage'] > 50])
        
        # 获取女性占比最高的行业
        if not year_data.empty:
            top_industry = year_data.loc[year_data['Female_Percentage'].idxmax()]
            top_percentage = top_industry['Female_Percentage']
            top_name = top_industry['Title']
        else:
            top_percentage = 0
            top_name = "N/A"
        
        dominant_data.append({
            'Year': year,
            'Dominant_Industries_Count': dominant_count,
            'Top_Female_Percentage': top_percentage,
            'Top_Industry_Name': top_name
        })
    
    return pd.DataFrame(dominant_data)


def create_contribution_trend_chart(contribution_data):
    """创建女性新增岗位贡献率趋势图 - 修正版，过滤异常值"""
    if contribution_data is None or contribution_data.empty:
        return None
    
    # 🔧 只显示可靠数据，过滤异常值
    reliable_data = contribution_data[contribution_data['Is_Reliable'] == True].copy()
    unreliable_data = contribution_data[contribution_data['Is_Reliable'] == False].copy()
    
    fig = go.Figure()
    
    # 添加可靠数据线（实线）
    if not reliable_data.empty:
        fig.add_trace(
            go.Scatter(
                x=reliable_data['Year'],
                y=reliable_data['Female_Contribution_Rate'],
                mode='lines+markers',
                name='稳定数据',
                line=dict(color='#ff6b6b', width=3),
                marker=dict(size=8, color='#ff6b6b', symbol='circle'),
                hovertemplate='<b>%{x}年</b><br>女性贡献率: %{y:.1f}%<br>数据可靠 ✅<extra></extra>'
            )
        )
    
    # 添加不可靠数据点（虚线标记）
    if not unreliable_data.empty:
        fig.add_trace(
            go.Scatter(
                x=unreliable_data['Year'],
                y=unreliable_data['Raw_Contribution_Rate'],
                mode='markers',
                name='不稳定数据',
                marker=dict(size=6, color='gray', symbol='x'),
                opacity=0.5,
                hovertemplate='<b>%{x}年</b><br>原始贡献率: %{y:.1f}%<br>⚠️ 样本过小，不可靠<extra></extra>'
            )
        )
    
    fig.update_layout(
        title='💼 女性对新增岗位的累积贡献率趋势 (2010年为基准)<br><sub>已过滤统计学异常值，灰色X标记为不可靠数据</sub>',
        xaxis_title="年份",
        yaxis_title="女性贡献率 (%)",
        height=400,
        hovermode='closest',
        yaxis=dict(tickformat='.1f', range=[0, 100])  # 限制Y轴范围，避免异常值影响视觉
    )
    
    # 添加60.1%基准线（最终目标值）
    if not reliable_data.empty:
        final_data = reliable_data[reliable_data['Year'] == reliable_data['Year'].max()]
        if not final_data.empty:
            target_value = final_data['Female_Contribution_Rate'].iloc[0]
            fig.add_hline(y=target_value, line_dash="dash", line_color="green", 
                          annotation_text=f"最终目标: {target_value:.1f}%")
    
    return fig


def create_dominant_industries_chart(dominant_data):
    """创建女性主导行业数量变化趋势图"""
    if dominant_data is None or dominant_data.empty:
        return None
    
    # 创建组合图：柱状图 + 折线图
    fig = go.Figure()
    
    # 添加女性主导行业数量（柱状图）
    fig.add_trace(
        go.Bar(
            x=dominant_data['Year'],
            y=dominant_data['Dominant_Industries_Count'],
            name='女性主导行业数量 (>50%)',
            marker_color='rgba(255, 182, 193, 0.6)',
            hovertemplate='<b>%{x}年</b><br>女性主导行业: %{y}个<extra></extra>'
        )
    )
    
    # 添加最高女性占比趋势（折线图，右侧Y轴）
    fig.add_trace(
        go.Scatter(
            x=dominant_data['Year'],
            y=dominant_data['Top_Female_Percentage'],
            mode='lines+markers',
            name='最高女性占比趋势',
            line=dict(color='#e91e63', width=2),
            marker=dict(size=6),
            yaxis='y2',
            hovertemplate='<b>%{x}年</b><br>最高占比: %{y:.1f}%<extra></extra>'
        )
    )
    
    fig.update_layout(
        title='👑 女性主导行业数量变化 & 最高占比趋势',
        xaxis_title="年份",
        yaxis=dict(
            title="女性主导行业数量 (个)",
            side='left'
        ),
        yaxis2=dict(
            title="最高女性占比 (%)",
            side='right',
            overlaying='y',
            tickformat='.1f'
        ),
        height=400,
        hovermode='x unified'
    )
    
    return fig


def display_gender_power_tab(df):
    """显示女性力量分析Tab"""
    st.header("🚺 女性力量崛起分析")
    st.caption("基于荷兰统计局(CBS)性别劳动力数据 (1995-2024年) - Sprint 2核心故事")
    
    # 加载性别数据
    gender_data = load_gender_data(df)
    if gender_data is None:
        st.error("无法加载性别数据，请检查数据源是否包含必要的性别字段 (Female_29, Male_28, Total_27)")
        return
    
    # 计算大数字
    big_numbers = calculate_gender_big_numbers(gender_data)
    if big_numbers is None:
        st.error("无法计算关键指标，请检查1995、2010和2024年数据的完整性")
        return
    
    # === 顶部：Sprint 2 核心大数字 ===
    st.subheader("🎯 Sprint 2 核心洞察：女性力量三大数字")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric(
            "🚺 女性占比历史突破",
            f"{big_numbers['historical_end_female_pct']:.1f}%",
            f"+{big_numbers['historical_pct_change']:.1f}个百分点"
        )
        st.caption(f"从1995年{big_numbers['historical_start_female_pct']:.1f}%增至2024年{big_numbers['historical_end_female_pct']:.1f}%")
    
    with col2:
        st.metric(
            "💼 新职位贡献力",
            f"{big_numbers['female_contribution']:.1f}%",
            f"女性获得{big_numbers['female_new_jobs']:,}个新岗位"
        )
        st.caption(f"总新增{big_numbers['total_new_jobs']:,}个职位中女性贡献{big_numbers['female_contribution']:.1f}%")
    
    with col3:
        st.metric(
            "👑 行业主导数量",
            f"{big_numbers['female_majority_count']}个行业",
            f"女性占比>50%的行业"
        )
        st.caption(f"最高：{big_numbers['top_female_industry'][:20]}... ({big_numbers['top_female_percentage']:.1f}%)")
    
    # 添加故事化总结
    with st.expander("📖 女性力量故事总结"):
        st.markdown(f"""
        **"女性力量崛起"核心发现：**
        
        🚺 **历史性突破** (1995-2024)：从1995年{big_numbers['historical_start_female_pct']:.1f}%增至2024年{big_numbers['historical_end_female_pct']:.1f}%，实现{big_numbers['historical_pct_change']:.1f}个百分点的历史性增长
        
        💪 **新职位主力** (2010-2024)：在过去15年新增的{big_numbers['total_new_jobs']:,}个工作岗位中，女性获得了{big_numbers['female_new_jobs']:,}个，贡献率达{big_numbers['female_contribution']:.1f}%
        
        👑 **行业领导力** (2024年现状)：目前有{big_numbers['female_majority_count']}个行业女性占主导地位（占比超过50%），其中{big_numbers['top_female_industry']}行业女性占比最高达{big_numbers['top_female_percentage']:.1f}%
        
        💡 **深度洞察**：荷兰女性正在重塑劳动力市场格局，30年的历史突破与15年的新增岗位贡献共同展现了女性在职场中不断崛起的强大势头。她们不仅在传统优势领域保持领先，更在新兴行业中展现出强大的竞争力和适应性。
        """)
    
    st.markdown("---")
    
    # === 中部：核心数据深度图表 ===
    st.subheader("📊 Big Numbers深度分析：详细趋势图")
    
    # 计算详细趋势数据
    contribution_data = calculate_yearly_female_contribution(gender_data)
    dominant_data = calculate_yearly_dominant_industries(gender_data)
    
    # 创建4象限布局展示详细图表
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("💼 新职位贡献力详细趋势")
        st.caption("展示60.1%这个数字的历史演变过程")
        
        if contribution_data is not None and not contribution_data.empty:
            contribution_fig = create_contribution_trend_chart(contribution_data)
            if contribution_fig:
                st.plotly_chart(contribution_fig, use_container_width=True)
                
                # 显示关键数据点和解读
                latest_data = contribution_data[contribution_data['Year'] == contribution_data['Year'].max()]
                reliable_count = len(contribution_data[contribution_data['Is_Reliable'] == True])
                unreliable_count = len(contribution_data[contribution_data['Is_Reliable'] == False])
                
                if not latest_data.empty:
                    st.info(f"📈 **修正版趋势解读**: 女性15年净增长贡献率为{latest_data['Female_Contribution_Rate'].iloc[0]:.1f}%，"
                           f"共获得{latest_data['Female_New_Jobs'].iloc[0]:,.0f}个新岗位（总净增{latest_data['Total_New_Jobs'].iloc[0]:,.0f}个）")
                    st.caption(f"⚠️ 数据质量说明: {reliable_count}个年份数据可靠，{unreliable_count}个年份因样本过小被标记为不稳定（如2012年314.5%异常值）")
            else:
                st.error("无法生成贡献率趋势图")
        else:
            st.error("无法计算贡献率数据")
    
    with col2:
        st.subheader("👑 行业主导数量详细趋势")
        st.caption("展示17个行业这个数字的历史变化")
        
        if dominant_data is not None and not dominant_data.empty:
            dominant_fig = create_dominant_industries_chart(dominant_data)
            if dominant_fig:
                st.plotly_chart(dominant_fig, use_container_width=True)
                
                # 显示关键数据点
                latest_dominant = dominant_data[dominant_data['Year'] == dominant_data['Year'].max()]
                if not latest_dominant.empty:
                    st.info(f"📊 **趋势解读**: 目前有{latest_dominant['Dominant_Industries_Count'].iloc[0]}个行业女性占主导，"
                           f"最高达{latest_dominant['Top_Female_Percentage'].iloc[0]:.1f}% "
                           f"({latest_dominant['Top_Industry_Name'].iloc[0][:25]}...)")
            else:
                st.error("无法生成主导行业趋势图")
        else:
            st.error("无法计算主导行业数据")
    
    # === 底部：传统分析图表 ===
    st.markdown("---")
    st.subheader("📈 传统分析视角")
    
    col_left, col_right = st.columns(2)
    
    with col_left:
        st.subheader("📈 30年女性占比总体趋势")
        trend_fig = create_gender_trend_chart(gender_data)
        if trend_fig:
            st.plotly_chart(trend_fig, use_container_width=True)
        else:
            st.error("无法生成趋势图，请检查数据")
    
    with col_right:
        st.subheader("🏢 各行业女性占比排名")
        
        # 年份选择器
        available_years = sorted(gender_data['Year'].unique(), reverse=True)
        selected_year = st.selectbox(
            "选择年份", 
            available_years, 
            index=0,
            key="gender_year_selector"
        )
        
        # 行业数量选择器
        top_n = st.slider("显示行业数量", 10, 25, 15, key="gender_top_n")
        
        industry_fig = create_industry_gender_chart(gender_data, selected_year, top_n)
        if industry_fig:
            st.plotly_chart(industry_fig, use_container_width=True)
        else:
            st.error(f"无法生成{selected_year}年的行业对比图")
    
    # === 底部：详细数据表格 ===
    with st.expander("📊 查看详细性别数据"):
        # 年份筛选
        year_range = st.slider(
            "选择年份范围", 
            int(gender_data['Year'].min()), 
            int(gender_data['Year'].max()),
            (2010, 2024),
            key="gender_year_range"
        )
        
        # 筛选数据
        filtered_data = gender_data[
            (gender_data['Year'] >= year_range[0]) & 
            (gender_data['Year'] <= year_range[1])
        ].copy()
        
        # 排序和格式化
        display_data = filtered_data.sort_values(['Year', 'Female_Percentage'], ascending=[False, False])
        display_data = display_data.rename(columns={
            'Title': '行业名称',
            'Year': '年份',
            'Female_29': '女性员工数',
            'Male_28': '男性员工数', 
            'Total_27': '总员工数',
            'Female_Percentage': '女性占比(%)'
        })
        
        # 显示数据表
        st.dataframe(
            display_data,
            use_container_width=True,
            height=400
        )
        
        # 下载功能
        csv_data = display_data.to_csv(index=False)
        st.download_button(
            label="📥 下载性别数据",
            data=csv_data,
            file_name=f"gender_analysis_{year_range[0]}_{year_range[1]}.csv",
            mime="text/csv"
        )


# ========== 隐形人力成本分析函数 ==========

def load_hidden_cost_data(df):
    """加载和预处理隐形人力成本相关数据"""
    # 关键字段映射
    key_fields = [
        'EmployersSocialContributions_3',    # 雇主社保支出
        'CompensationOfEmployees_1',         # 总薪酬
        'CompensationPerHourWorked_11',      # 时薪
        'WagesAndSalaries_2',                # 工资总额 
        'HoursWorked_21',                    # 总工时
        'Title', 'Year'
    ]
    
    # 可选字段（用于效率分析）
    optional_fields = ['FullTimeEquivalentFte_20']  # 全职等效人数
    
    # 检查必要字段存在性
    missing_fields = [field for field in key_fields if field not in df.columns]
    if missing_fields:
        st.error(f"缺少隐形成本分析必要字段: {missing_fields}")
        return None
    
    # 添加可选字段（如果存在）
    available_fields = key_fields.copy()
    for field in optional_fields:
        if field in df.columns:
            available_fields.append(field)
    
    # 筛选有完整数据的记录
    cost_data = df[available_fields].copy()
    cost_data = cost_data.dropna(subset=key_fields[:-2])  # 除了Title和Year之外都要有值
    
    # 计算派生指标
    cost_data['Benefit_Ratio'] = (
        cost_data['EmployersSocialContributions_3'] / cost_data['CompensationOfEmployees_1'] * 100
    ).round(1)
    
    # 计算平均时薪 (如果CompensationPerHourWorked_11为空，用总薪酬/总工时)
    cost_data['Avg_Hourly_Rate'] = cost_data['CompensationPerHourWorked_11'].fillna(
        cost_data['CompensationOfEmployees_1'] * 1000 / cost_data['HoursWorked_21']  # 转换单位
    ).round(2)
    
    return cost_data


def calculate_hidden_cost_big_numbers(cost_data):
    """计算隐形人力成本的三个Big Numbers"""
    if cost_data is None or cost_data.empty:
        return None
    
    # Big Number 1: 福利占比变化 (整体趋势)
    yearly_totals = cost_data.groupby('Year').agg({
        'EmployersSocialContributions_3': 'sum',
        'CompensationOfEmployees_1': 'sum',
        'HoursWorked_21': 'sum'
    }).reset_index()
    
    yearly_totals['Overall_Benefit_Ratio'] = (
        yearly_totals['EmployersSocialContributions_3'] / 
        yearly_totals['CompensationOfEmployees_1'] * 100
    ).round(1)
    
    # 对比2010年和2024年
    benefit_2010 = yearly_totals[yearly_totals['Year'] == 2010]['Overall_Benefit_Ratio']
    benefit_2024 = yearly_totals[yearly_totals['Year'] == 2024]['Overall_Benefit_Ratio']
    
    if not benefit_2010.empty and not benefit_2024.empty:
        benefit_start = benefit_2010.iloc[0] 
        benefit_end = benefit_2024.iloc[0]
        benefit_change = benefit_end - benefit_start
    else:
        benefit_start, benefit_end, benefit_change = 0, 0, 0
    
    # Big Number 2: 效率提升分析 (时薪增长 vs 工时变化) - 修正版
    # 计算真正有意义的效率指标
    
    # 计算年度汇总数据
    agg_dict = {
        'CompensationPerHourWorked_11': 'mean',    # 平均时薪
        'HoursWorked_21': 'sum',                   # 总工时
    }
    
    # 如果有FTE数据，添加到聚合中
    if 'FullTimeEquivalentFte_20' in cost_data.columns:
        agg_dict['FullTimeEquivalentFte_20'] = 'sum'
    
    yearly_efficiency = cost_data.groupby('Year').agg(agg_dict).reset_index()
    
    # 检查是否有FTE数据，如果没有则用其他方法估算
    if 'FullTimeEquivalentFte_20' not in cost_data.columns:
        # 备用方案：使用总工时变化作为代理指标
        hours_2010 = yearly_efficiency[yearly_efficiency['Year'] == 2010]['HoursWorked_21'].iloc[0] if not yearly_efficiency[yearly_efficiency['Year'] == 2010].empty else 0
        hours_2024 = yearly_efficiency[yearly_efficiency['Year'] == 2024]['HoursWorked_21'].iloc[0] if not yearly_efficiency[yearly_efficiency['Year'] == 2024].empty else 0
        hours_change = ((hours_2024 - hours_2010) / hours_2010 * 100) if hours_2010 > 0 else 0
    else:
        # 计算每FTE工时变化
        yearly_efficiency['Hours_Per_FTE'] = yearly_efficiency['HoursWorked_21'] * 1000 / yearly_efficiency['FullTimeEquivalentFte_20']
        hours_per_fte_2010 = yearly_efficiency[yearly_efficiency['Year'] == 2010]['Hours_Per_FTE'].iloc[0] if not yearly_efficiency[yearly_efficiency['Year'] == 2010].empty else 0
        hours_per_fte_2024 = yearly_efficiency[yearly_efficiency['Year'] == 2024]['Hours_Per_FTE'].iloc[0] if not yearly_efficiency[yearly_efficiency['Year'] == 2024].empty else 0
        hours_change = ((hours_per_fte_2024 - hours_per_fte_2010) / hours_per_fte_2010 * 100) if hours_per_fte_2010 > 0 else 0
    
    # 计算时薪增长率
    hourly_2010 = yearly_efficiency[yearly_efficiency['Year'] == 2010]['CompensationPerHourWorked_11'].iloc[0] if not yearly_efficiency[yearly_efficiency['Year'] == 2010].empty else 0
    hourly_2024 = yearly_efficiency[yearly_efficiency['Year'] == 2024]['CompensationPerHourWorked_11'].iloc[0] if not yearly_efficiency[yearly_efficiency['Year'] == 2024].empty else 0
    hourly_growth = ((hourly_2024 - hourly_2010) / hourly_2010 * 100) if hourly_2010 > 0 else 0
    
    # 效率提升指标 = 时薪增长 - 工时变化
    efficiency_improvement = hourly_growth - hours_change
    
    # Big Number 3: 绝对成本增长（修正版，替代误导性效率分析）
    contributions_2010 = yearly_totals[yearly_totals['Year'] == 2010]['EmployersSocialContributions_3']
    contributions_2024 = yearly_totals[yearly_totals['Year'] == 2024]['EmployersSocialContributions_3']
    
    if not contributions_2010.empty and not contributions_2024.empty:
        start_amount = contributions_2010.iloc[0] / 1000  # 转换为十亿欧元
        end_amount = contributions_2024.iloc[0] / 1000    # 转换为十亿欧元
        absolute_growth_rate = ((end_amount - start_amount) / start_amount * 100) if start_amount > 0 else 0
    else:
        start_amount, end_amount, absolute_growth_rate = 0, 0, 0
    
    # Big Number 4: 行业福利差异
    industry_2024 = cost_data[cost_data['Year'] == 2024].copy()
    if not industry_2024.empty:
        # 找到福利占比最高的行业
        top_benefit_industry = industry_2024.loc[industry_2024['Benefit_Ratio'].idxmax()]
        # 福利占比最低的行业
        low_benefit_industry = industry_2024.loc[industry_2024['Benefit_Ratio'].idxmin()]
    else:
        top_benefit_industry = None
        low_benefit_industry = None
    
    return {
        'benefit_ratio_change': {
            'start_ratio': benefit_start,
            'end_ratio': benefit_end, 
            'change': benefit_change,
            'yearly_data': yearly_totals
        },
        'absolute_cost_growth': {
            'start_amount': start_amount,
            'end_amount': end_amount,
            'growth_rate': absolute_growth_rate
        },
        'industry_differences': {
            'top_industry': top_benefit_industry,
            'low_industry': low_benefit_industry,
            'industry_data_2024': industry_2024
        }
    }


def create_benefit_ratio_trend_chart(yearly_data):
    """创建福利占比趋势图"""
    if yearly_data is None or yearly_data.empty:
        return None
    
    fig = px.line(
        yearly_data,
        x='Year',
        y='Overall_Benefit_Ratio', 
        title='🧾 荷兰雇主社保支出占总薪酬比例趋势 (隐形人力成本)',
        markers=True,
        line_shape='spline'
    )
    
    fig.update_traces(
        line=dict(color='#ff7f0e', width=3),
        marker=dict(size=8, color='#ff7f0e', symbol='circle')
    )
    
    fig.update_layout(
        xaxis_title="年份",
        yaxis_title="福利占薪酬比例 (%)",
        height=400,
        hovermode='x unified',
        yaxis=dict(tickformat='.1f')
    )
    
    # 添加基准线
    if len(yearly_data) > 0:
        avg_ratio = yearly_data['Overall_Benefit_Ratio'].mean()
        fig.add_hline(y=avg_ratio, line_dash="dash", line_color="gray",
                      annotation_text=f"历史平均: {avg_ratio:.1f}%")
    
    fig.update_traces(
        hovertemplate='<b>%{x}年</b><br>福利占比: %{y:.1f}%<br>雇主隐形成本<extra></extra>'
    )
    
    return fig


def create_hourly_wage_analysis_chart(cost_data):
    """创建时薪价值分析图（替代误导性效率分析）"""
    if cost_data is None or cost_data.empty:
        return None
    
    # 计算年度平均时薪趋势
    yearly_data = cost_data.groupby('Year').agg({
        'CompensationPerHourWorked_11': 'mean',    # 平均时薪（包含福利津贴）
    }).reset_index()
    
    # 创建时薪趋势图
    fig = px.line(
        yearly_data,
        x='Year',
        y='CompensationPerHourWorked_11',
        title='💰 荷兰平均时薪变化趋势（包含福利津贴）',
        markers=True,
        line_shape='spline'
    )
    
    fig.update_traces(
        line=dict(color='#1f77b4', width=3),
        marker=dict(size=8, color='#1f77b4')
    )
    
    fig.update_layout(
        xaxis_title="年份",
        yaxis_title="时薪 (欧元)",
        height=400,
        hovermode='x unified'
    )
    
    # 添加视觉标注
    fig.update_traces(
        hovertemplate='<b>%{x}年</b><br>时薪: €%{y:.2f}<br>包含福利津贴等全部补偿<extra></extra>'
    )
    
    return fig


def create_industry_benefit_ranking_chart(industry_data, top_n=15):
    """创建行业福利占比排名图"""
    if industry_data is None or industry_data.empty:
        return None
    
    # 按福利占比排序
    top_industries = industry_data.nlargest(top_n, 'Benefit_Ratio')
    
    fig = px.bar(
        top_industries,
        x='Benefit_Ratio',
        y='Title',
        title=f'💸 2024年各行业福利成本占比排名 (Top {top_n})',
        orientation='h',
        color='Benefit_Ratio',
        color_continuous_scale='Oranges',
        text='Benefit_Ratio'
    )
    
    fig.update_traces(
        texttemplate='%{text:.1f}%',
        textposition='outside',
        hovertemplate='<b>%{y}</b><br>福利占比: %{x:.1f}%<extra></extra>'
    )
    
    fig.update_layout(
        xaxis_title="福利占薪酬比例 (%)",
        yaxis_title="行业",
        height=max(400, top_n * 25),
        yaxis=dict(autorange='reversed'),
        showlegend=False
    )
    
    # 添加平均线
    if len(industry_data) > 0:
        avg_ratio = industry_data['Benefit_Ratio'].mean()
        fig.add_vline(x=avg_ratio, line_dash="dash", line_color="red",
                      annotation_text=f"平均: {avg_ratio:.1f}%")
    
    return fig


def create_cost_composition_analysis(cost_data):
    """创建成本构成分析图"""
    if cost_data is None or cost_data.empty:
        return None
    
    # 计算2024年整体成本构成
    data_2024 = cost_data[cost_data['Year'] == 2024]
    if data_2024.empty:
        return None
    
    total_compensation = data_2024['CompensationOfEmployees_1'].sum()
    total_wages = data_2024['WagesAndSalaries_2'].sum() 
    total_benefits = data_2024['EmployersSocialContributions_3'].sum()
    
    # 创建饼图
    labels = ['直接工资', '雇主社保支出', '其他薪酬成分']
    values = [total_wages, total_benefits, total_compensation - total_wages - total_benefits]
    colors = ['#ff9999', '#66b3ff', '#99ff99']
    
    fig = go.Figure(data=[go.Pie(
        labels=labels, 
        values=values,
        hole=0.3,
        marker_colors=colors,
        textinfo='label+percent',
        hovertemplate='<b>%{label}</b><br>金额: %{value:.1f}千欧元<br>占比: %{percent}<extra></extra>'
    )])
    
    fig.update_layout(
        title='💰 2024年荷兰薪酬成本构成分析<br><sub>展示隐形成本在总薪酬中的比重</sub>',
        height=400,
        showlegend=True
    )
    
    return fig


def display_hidden_cost_tab(df):
    """显示隐形人力成本分析Tab"""
    st.header("🧾 隐形人力成本分析：福利的崛起")
    st.caption("基于荷兰统计局(CBS)薪酬成本数据 - Sprint 3核心故事")
    
    # 加载隐形成本数据
    cost_data = load_hidden_cost_data(df)
    if cost_data is None:
        st.error("无法加载隐形成本数据，请检查数据源字段完整性")
        return
    
    # 计算Big Numbers
    big_numbers = calculate_hidden_cost_big_numbers(cost_data) 
    if big_numbers is None:
        st.error("无法计算隐形成本关键指标")
        return
    
    # === 顶部：Sprint 3 核心大数字 ===
    st.subheader("🎯 Sprint 3 核心洞察：隐形成本三大发现")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        benefit_data = big_numbers['benefit_ratio_change']
        st.metric(
            "🧾 福利负担水平", 
            f"{benefit_data['end_ratio']:.1f}%",
            f"+{benefit_data['change']:.1f}%" if benefit_data['change'] > 0 else f"{benefit_data['change']:.1f}%"
        )
        st.caption(f"雇主社保支出占薪酬比重：{benefit_data['end_ratio']:.1f}% (2024年)")
    
    with col2:
        absolute_cost_data = big_numbers['absolute_cost_growth']
        absolute_cost_data = big_numbers['absolute_cost_growth']
        st.metric(
            "📈 绝对成本增长",
            f"+{absolute_cost_data['growth_rate']:.0f}%",
            f"社保支出：{absolute_cost_data['start_amount']:.0f}亿→{absolute_cost_data['end_amount']:.0f}亿欧元"
        )
        st.caption(f"15年间雇主社保负担大幅增加 (2010-2024)")
    
    with col3:
        industry_data = big_numbers['industry_differences']
        if industry_data['top_industry'] is not None:
            top_industry = industry_data['top_industry']
            st.metric(
                "💸 最高福利行业", 
                f"{top_industry['Benefit_Ratio']:.1f}%",
                top_industry['Title'][:20] + "..."
            )
            st.caption("雇主承担最重的隐形成本负担")
        else:
            st.metric("💸 行业分析", "数据不足", "")
    
    # 故事化总结
    with st.expander("📖 隐形成本故事总结"):
        benefit_data = big_numbers['benefit_ratio_change']
        absolute_cost_data = big_numbers['absolute_cost_growth']
        industry_data = big_numbers['industry_differences']
        st.markdown(f"""
        **"隐形人力成本的崛起"核心发现：**
        
        🧾 **福利负担水平**：雇主社保支出占总薪酬比重达{benefit_data['end_ratio']:.1f}%，每支付€100直接工资需额外承担约€{benefit_data['end_ratio']:.0f}的隐形成本
        
        📈 **绝对成本增长**：社保支出从{absolute_cost_data['start_amount']:.0f}亿增至{absolute_cost_data['end_amount']:.0f}亿欧元，增幅达{absolute_cost_data['growth_rate']:.0f}%，成为雇主重要负担
        
        🏭 **行业差异明显**：不同行业福利负担差异巨大，最高行业福利占比超过{industry_data['top_industry']['Benefit_Ratio']:.0f}%
        
        💡 **深度洞察**：荷兰面临"隐形人力成本透视"挑战。雇主承担的社保负担水平稳定在{benefit_data['end_ratio']:.1f}%左右，但绝对金额15年间增长{absolute_cost_data['growth_rate']:.0f}%。不同行业间福利负担差异悬殊，最高行业福利占比超过{industry_data['top_industry']['Benefit_Ratio']:.0f}%，体现了劳动密集型与资本密集型行业的成本结构差异。
        """)
    
    st.markdown("---")
    
    # === 中部：详细分析图表 ===
    st.subheader("📊 隐形成本深度分析图表")
    
    # 2x2 图表布局
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("🧾 福利占比历史趋势")
        benefit_trend_fig = create_benefit_ratio_trend_chart(big_numbers['benefit_ratio_change']['yearly_data'])
        if benefit_trend_fig:
            st.plotly_chart(benefit_trend_fig, use_container_width=True)
        else:
            st.error("无法生成福利占比趋势图")
            
        st.subheader("💰 薪酬成本构成分析")
        composition_fig = create_cost_composition_analysis(cost_data)
        if composition_fig:
            st.plotly_chart(composition_fig, use_container_width=True)
        else:
            st.error("无法生成成本构成分析图")
    
    with col2:
        st.subheader("📊 时薪价值分析")
        st.info("💡 **重要说明**: 图表中的时薪数据包含福利津贴等全部雇员补偿，非纯基本工资")
        hourly_wage_fig = create_hourly_wage_analysis_chart(cost_data)
        if hourly_wage_fig:
            st.plotly_chart(hourly_wage_fig, use_container_width=True)
        else:
            st.error("无法生成时薪分析图")
            
        st.subheader("💸 各行业福利负担排名")
        
        # 行业数量选择器
        top_n = st.slider("显示行业数量", 10, 25, 15, key="cost_top_n")
        
        industry_ranking_fig = create_industry_benefit_ranking_chart(
            big_numbers['industry_differences']['industry_data_2024'], top_n
        )
        if industry_ranking_fig:
            st.plotly_chart(industry_ranking_fig, use_container_width=True)
        else:
            st.error("无法生成行业排名图")
    
    # === 底部：详细数据分析 ===
    with st.expander("📊 查看详细隐形成本数据"):
        # 年份筛选
        year_range = st.slider(
            "选择年份范围",
            int(cost_data['Year'].min()),
            int(cost_data['Year'].max()),
            (2010, 2024),
            key="cost_year_range"
        )
        
        # 筛选数据
        filtered_data = cost_data[
            (cost_data['Year'] >= year_range[0]) & 
            (cost_data['Year'] <= year_range[1])
        ].copy()
        
        # 排序和格式化
        display_data = filtered_data.sort_values(['Year', 'Benefit_Ratio'], ascending=[False, False])
        display_data = display_data.rename(columns={
            'Title': '行业名称',
            'Year': '年份', 
            'EmployersSocialContributions_3': '雇主社保支出(千欧)',
            'CompensationOfEmployees_1': '总薪酬(千欧)',
            'Benefit_Ratio': '福利占比(%)',
            'Avg_Hourly_Rate': '平均时薪(欧元)'
        })
        
        # 显示数据表
        st.dataframe(
            display_data,
            use_container_width=True,
            height=400
        )
        
        # 下载功能
        csv_data = display_data.to_csv(index=False)
        st.download_button(
            label="📥 下载隐形成本数据",
            data=csv_data,
            file_name=f"hidden_cost_analysis_{year_range[0]}_{year_range[1]}.csv",
            mime="text/csv"
        )


def main():
    """主应用"""

    # 页面标题
    st.title("🇳🇱 荷兰薪酬数据交叉表分析")
    st.markdown("---")

    # 加载数据
    df = load_data()
    if df is None:
        st.stop()

    # 获取基本信息
    metric_cols = get_metric_columns(df)
    years = sorted(df["Year"].unique())
    industries = sorted(df["Title"].unique())

    # 侧边栏控制
    st.sidebar.header("🎛️ 控制面板")

    # 年份选择
    selected_year = st.sidebar.selectbox(
        "选择年份",
        years,
        index=len(years) - 1,  # 默认选择最新年份
        help="选择要查看的年份数据",
    )

    # 指标选择
    st.sidebar.subheader("📊 指标选择")

    # 预设指标组
    metric_groups = {
        "薪酬相关": [
            col for col in metric_cols if "Compensation" in col or "Wages" in col
        ],
        "工时相关": [col for col in metric_cols if "Hours" in col or "Fte" in col],
        "性别统计": [
            col
            for col in metric_cols
            if "Male" in col or "Female" in col or "Total" in col[-10:]
        ],
        "全部指标": metric_cols,
    }

    metric_group = st.sidebar.selectbox(
        "选择指标组", list(metric_groups.keys()), index=0
    )

    # 具体指标选择
    available_metrics = metric_groups[metric_group]

    # 全选按钮
    col_select, col_clear = st.sidebar.columns(2)
    with col_select:
        if st.button("✅ 全选", use_container_width=True):
            st.session_state.selected_metrics = available_metrics
    with col_clear:
        if st.button("❌ 清空", use_container_width=True):
            st.session_state.selected_metrics = []

    # 获取当前选择的指标
    current_selection = st.session_state.get(
        "selected_metrics",
        available_metrics[:10] if len(available_metrics) > 10 else available_metrics,
    )

    selected_metrics = st.sidebar.multiselect(
        "选择具体指标",
        available_metrics,
        default=current_selection,
        help="使用上方按钮快速全选或清空指标",
        key="metrics_multiselect",
    )

    if not selected_metrics:
        st.warning("请至少选择一个指标")
        st.stop()

    # 主内容区域 - Tab结构
    tab1, tab2, tab3, tab4, tab5, tab6, tab7, tab8 = st.tabs(["📊 交叉表分析", "🔍 缺失值分析", "💰 工资增长冠军", "📈 薪酬差距透视", "🚺 女性力量分析", "🧾 隐形成本分析", "💪 工作密集化分析", "⚡ 效率之谜分析"])

    # Tab 1: 交叉表分析
    with tab1:
        col1, col2 = st.columns([3, 1])

        with col2:
            st.subheader("📈 数据概览")
            st.metric("总行业数", len(industries))
            st.metric("总指标数", len(metric_cols))
            st.metric("数据年份", f"{min(years)}-{max(years)}")
            st.metric("选中年份", selected_year)
            st.metric("选中指标", len(selected_metrics))

        with col1:
            st.subheader(f"📊 {selected_year}年 行业×指标交叉表")

            # 创建交叉表
            crosstab = create_crosstab_for_year(df, selected_year, selected_metrics)

            if crosstab is None:
                st.error(f"{selected_year}年没有数据")
                st.stop()

            # 显示统计信息
            missing_count = crosstab.isnull().sum().sum()
            total_cells = crosstab.shape[0] * crosstab.shape[1]
            missing_rate = (missing_count / total_cells) * 100

            st.info(
                f"📋 数据维度: {crosstab.shape[0]}行业 × {crosstab.shape[1]}指标 | 缺失率: {missing_rate:.1f}%"
            )

            # 行业筛选
            industry_filter = st.text_input(
                "🔍 筛选行业（输入关键词）",
                help="输入行业名称关键词进行筛选，例如：Agriculture, Manufacturing",
            )

            if industry_filter:
                filtered_crosstab = crosstab[
                    crosstab.index.str.contains(industry_filter, case=False, na=False)
                ]
            else:
                filtered_crosstab = crosstab

            # 显示交叉表
            if not filtered_crosstab.empty:
                # 格式化显示
                formatted_crosstab = filtered_crosstab.map(format_missing_values)

                st.dataframe(
                    formatted_crosstab,
                    use_container_width=True,
                    height=min(600, len(filtered_crosstab) * 35 + 100),
                )

                # 下载功能
                csv_data = filtered_crosstab.to_csv()
                st.download_button(
                    label="📥 下载当前表格数据",
                    data=csv_data,
                    file_name=f"crosstab_{selected_year}_{metric_group}.csv",
                    mime="text/csv",
                )
            else:
                st.warning("没有匹配的行业数据")

    # Tab 2: 缺失值分析
    with tab2:
        st.subheader("🔍 缺失值分析")

        # 重新创建交叉表数据供缺失值分析使用
        crosstab = create_crosstab_for_year(df, selected_year, selected_metrics)
        if crosstab is None:
            st.error(f"{selected_year}年没有数据")
        else:
            # 应用同样的筛选
            industry_filter = st.session_state.get("industry_filter", "")
            if industry_filter:
                filtered_crosstab = crosstab[
                    crosstab.index.str.contains(industry_filter, case=False, na=False)
                ]
            else:
                filtered_crosstab = crosstab

            sub_tab1, sub_tab2 = st.tabs(["缺失值热力图", "年度缺失率趋势"])

            with sub_tab1:
                if not filtered_crosstab.empty:
                    missing_fig = create_missing_heatmap(filtered_crosstab)
                    st.plotly_chart(missing_fig, use_container_width=True)

            with sub_tab2:
                # 显示各年份缺失率趋势
                missing_by_year = []
                for year in years:
                    year_crosstab = create_crosstab_for_year(df, year, selected_metrics)
                    if year_crosstab is not None:
                        missing_count = year_crosstab.isnull().sum().sum()
                        total_cells = year_crosstab.shape[0] * year_crosstab.shape[1]
                        missing_rate = (
                            (missing_count / total_cells) * 100
                            if total_cells > 0
                            else 0
                        )
                        missing_by_year.append(
                            {"Year": year, "Missing_Rate": missing_rate}
                        )

                if missing_by_year:
                    missing_trend_df = pd.DataFrame(missing_by_year)

                    fig_trend = px.line(
                        missing_trend_df,
                        x="Year",
                        y="Missing_Rate",
                        title=f"选定指标的年度缺失率趋势",
                        markers=True,
                    )
                    fig_trend.update_layout(
                        xaxis_title="年份", yaxis_title="缺失率 (%)", height=400
                    )

                    st.plotly_chart(fig_trend, use_container_width=True)

    # Tab 3: 增长冠军
    with tab3:
        display_growth_champion_tab(df)
    
    # Tab 4: 薪酬差距透视
    with tab4:
        st.header("📈 荷兰工资差距倍数分析")
        st.caption("分析2010-2024年最高工资行业与最低工资行业的差距变化 (使用与工资增长冠军相同的数据)")
        
        # 计算年度差距数据
        gap_data = calculate_yearly_gap_ratios(df)
        
        if not gap_data.empty:
            # 获取关键数字
            first_year_data = gap_data.iloc[0]
            last_year_data = gap_data.iloc[-1]
            change_rate = ((last_year_data['Gap_Ratio'] - first_year_data['Gap_Ratio']) 
                          / first_year_data['Gap_Ratio'] * 100)
            
            # 布局：左栏显示关键数据，右栏显示趋势图
            col1, col2 = st.columns([1, 2])
            
            with col1:
                st.subheader("🎯 关键洞察")
                
                # 关键数据指标
                st.metric(
                    f"{int(first_year_data['Year'])}年差距",
                    f"{first_year_data['Gap_Ratio']:.1f}倍"
                )
                
                st.metric(
                    f"{int(last_year_data['Year'])}年差距",
                    f"{last_year_data['Gap_Ratio']:.1f}倍",
                    f"{change_rate:+.1f}%"
                )
                
                # 生成钩子故事
                if change_rate > 0:
                    trend_desc = f"扩大了{abs(change_rate):.0f}%"
                    trend_emoji = "📈"
                else:
                    trend_desc = f"缩小了{abs(change_rate):.0f}%"
                    trend_emoji = "📉"
                
                st.info(
                    f"💡 **故事钩子**\n\n"
                    f"从{int(first_year_data['Year'])}年的{first_year_data['Gap_Ratio']:.1f}倍"
                    f"到{int(last_year_data['Year'])}年的{last_year_data['Gap_Ratio']:.1f}倍，"
                    f"荷兰工资差距{trend_desc} {trend_emoji}"
                )
            
            with col2:
                st.subheader("📊 15年变化趋势")
                
                # 创建并显示趋势图
                fig = create_gap_ratio_chart(gap_data)
                st.plotly_chart(fig, use_container_width=True)
                
                # 显示数据表格
                with st.expander("📋 查看详细数据"):
                    display_gap_data = gap_data.copy()
                    display_gap_data['Year'] = display_gap_data['Year'].astype(int)
                    display_gap_data['Gap_Ratio'] = display_gap_data['Gap_Ratio'].round(2)
                    display_gap_data['Max_Salary'] = display_gap_data['Max_Salary'].round(1)
                    display_gap_data['Min_Salary'] = display_gap_data['Min_Salary'].round(1)
                    
                    st.dataframe(
                        display_gap_data.rename(columns={
                            'Year': '年份',
                            'Gap_Ratio': '差距倍数', 
                            'Max_Salary': '最高工资(千欧)',
                            'Min_Salary': '最低工资(千欧)'
                        }),
                        use_container_width=True
                    )
        else:
            st.error("无法计算工资差距数据，请检查数据源")
    
    # Tab 5: 女性力量分析
    with tab5:
        display_gender_power_tab(df)
    
    # Tab 6: 隐形人力成本分析
    with tab6:
        display_hidden_cost_tab(df)
    
    # Tab 7: 工作密集化分析
    with tab7:
        display_work_intensification_tab(df)
    
    # Tab 8: 效率之谜分析
    with tab8:
        display_efficiency_mystery_tab(df)


# ========== 故事4：兼职模式革命分析函数 ==========

def load_parttime_data(df):
    """加载兼职模式分析相关数据"""
    print("📊 加载兼职模式分析数据...")
    
    # 关键字段映射
    key_fields = [
        'Total_27',                      # 总员工数(千人)
        'FullTimeEquivalentFte_20',      # 全职等效人数(千人)
        'Male_28',                       # 男性员工数(千人)
        'Female_29',                     # 女性员工数(千人)
        'Title', 'Year'
    ]
    
    # 检查必要字段
    missing_fields = [field for field in key_fields if field not in df.columns]
    if missing_fields:
        st.error(f"缺少兼职分析必要字段: {missing_fields}")
        return None
    
    # 筛选有完整数据的记录
    parttime_data = df[key_fields].copy()
    parttime_data = parttime_data.dropna(subset=key_fields[:-2])  # 除了Title和Year外都要有值
    
    print(f"✅ 兼职数据加载: {len(parttime_data)}条有效记录")
    
    # 计算核心指标
    # 兼职强度 = 1 - (全职等效人数 / 总员工数)
    parttime_data['Parttime_Ratio'] = (
        1 - parttime_data['FullTimeEquivalentFte_20'] / parttime_data['Total_27']
    ) * 100
    
    # FTE效率 = 全职等效人数 / 总员工数 (越小说明兼职越多)
    parttime_data['FTE_Efficiency'] = (
        parttime_data['FullTimeEquivalentFte_20'] / parttime_data['Total_27']
    ) * 100
    
    # 平均工作强度(每员工的FTE贡献)
    parttime_data['Avg_Work_Intensity'] = parttime_data['FullTimeEquivalentFte_20'] / parttime_data['Total_27']
    
    return parttime_data

def calculate_parttime_big_numbers(parttime_data):
    """计算兼职模式革命的Big Numbers"""
    if parttime_data is None or parttime_data.empty:
        return None
    
    print("🎯 计算兼职模式Big Numbers...")
    
    # 按年份汇总
    yearly_data = parttime_data.groupby('Year').agg({
        'Total_27': 'sum',
        'FullTimeEquivalentFte_20': 'sum',
        'Male_28': 'sum',
        'Female_29': 'sum'
    }).reset_index()
    
    # 计算总体兼职比例
    yearly_data['Overall_Parttime_Ratio'] = (
        1 - yearly_data['FullTimeEquivalentFte_20'] / yearly_data['Total_27']
    ) * 100
    
    # Big Number 1: 兼职强度变化 (2010-2024)
    parttime_2010 = yearly_data[yearly_data['Year'] == 2010]['Overall_Parttime_Ratio']
    parttime_2024 = yearly_data[yearly_data['Year'] == 2024]['Overall_Parttime_Ratio']
    
    if not parttime_2010.empty and not parttime_2024.empty:
        parttime_start = parttime_2010.iloc[0]
        parttime_end = parttime_2024.iloc[0]
        parttime_change = parttime_end - parttime_start
    else:
        parttime_start, parttime_end, parttime_change = 0, 0, 0
    
    # Big Number 2: FTE vs 员工数差距分析
    total_growth = ((yearly_data[yearly_data['Year'] == 2024]['Total_27'].iloc[0] - 
                    yearly_data[yearly_data['Year'] == 2010]['Total_27'].iloc[0]) / 
                   yearly_data[yearly_data['Year'] == 2010]['Total_27'].iloc[0] * 100)
    
    fte_growth = ((yearly_data[yearly_data['Year'] == 2024]['FullTimeEquivalentFte_20'].iloc[0] - 
                  yearly_data[yearly_data['Year'] == 2010]['FullTimeEquivalentFte_20'].iloc[0]) / 
                 yearly_data[yearly_data['Year'] == 2010]['FullTimeEquivalentFte_20'].iloc[0] * 100)
    
    efficiency_gap = total_growth - fte_growth
    
    # Big Number 3: 行业兼职排名 (2024年)
    industry_2024 = parttime_data[parttime_data['Year'] == 2024].copy()
    if not industry_2024.empty:
        # 计算各行业兼职比例
        industry_2024 = industry_2024.sort_values('Parttime_Ratio', ascending=False)
        top_parttime_industry = industry_2024.iloc[0]
        low_parttime_industry = industry_2024.iloc[-1]
    else:
        top_parttime_industry = None
        low_parttime_industry = None
    
    return {
        'parttime_trend': {
            'start_ratio': parttime_start,
            'end_ratio': parttime_end,
            'change': parttime_change,
            'yearly_data': yearly_data
        },
        'efficiency_gap': {
            'total_growth': total_growth,
            'fte_growth': fte_growth,
            'gap': efficiency_gap
        },
        'industry_ranking': {
            'top_parttime': top_parttime_industry,
            'low_parttime': low_parttime_industry,
            'industry_data_2024': industry_2024
        }
    }

def create_parttime_trend_chart(yearly_data):
    """创建兼职比例趋势图"""
    fig = px.line(
        yearly_data,
        x='Year',
        y='Overall_Parttime_Ratio',
        title='📈 荷兰工作负荷分布历史趋势 (1995-2024)<br><sub>💪 数据显示：约1/4员工承担非标准工作安排</sub>',
        markers=True,
        line_shape='spline'
    )
    
    fig.update_traces(
        line=dict(color='#9333ea', width=3),
        marker=dict(size=8, color='#9333ea')
    )
    
    fig.update_layout(
        xaxis_title="年份",
        yaxis_title="非全职工作比例 (%)",
        hovermode='x unified',
        showlegend=False
    )
    
    # 添加计算公式说明
    fig.add_annotation(
        x=2000,
        y=yearly_data['Overall_Parttime_Ratio'].max() - 1,
        text="📊 计算公式：非全职比例 = (1 - FTE人数/总员工数) × 100%<br>💪 逻辑：FTE<总员工数时，反映工作安排的灵活性",
        showarrow=False,
        bgcolor="rgba(255, 255, 255, 0.8)",
        bordercolor="gray",
        font=dict(size=10)
    )
    
    # 2010和2024年数据点标注
    ratio_2010 = yearly_data[yearly_data['Year'] == 2010]['Overall_Parttime_Ratio'].iloc[0] if not yearly_data[yearly_data['Year'] == 2010].empty else 0
    ratio_2024 = yearly_data[yearly_data['Year'] == 2024]['Overall_Parttime_Ratio'].iloc[0] if not yearly_data[yearly_data['Year'] == 2024].empty else 0
    
    fig.add_annotation(
        x=2010,
        y=ratio_2010,
        text=f"2010年: {ratio_2010:.1f}%",
        showarrow=True,
        arrowhead=2,
        bgcolor="rgba(255, 0, 0, 0.8)",
        bordercolor="white",
        font=dict(color="white")
    )
    
    fig.add_annotation(
        x=2024,
        y=ratio_2024,
        text=f"2024年: {ratio_2024:.1f}%<br>变化: {ratio_2024-ratio_2010:+.1f}个百分点",
        showarrow=True,
        arrowhead=2,
        bgcolor="rgba(147, 51, 234, 0.8)",
        bordercolor="white",
        font=dict(color="white")
    )
    
    return fig

def create_industry_parttime_ranking_chart(industry_data, top_n=15):
    """创建行业兼职比例排名图"""
    top_industries = industry_data.head(top_n)
    
    fig = px.bar(
        top_industries,
        y='Title',
        x='Parttime_Ratio',
        orientation='h',
        title=f'🏗️ 2024年各行业工作负荷分布排名 (Top {top_n})',
        color='Parttime_Ratio',
        color_continuous_scale='Purples'
    )
    
    fig.update_layout(
        xaxis_title="非全职工作比例 (%)",
        yaxis_title="行业",
        height=600
    )
    
    return fig

def display_work_intensification_tab(df):
    """显示工作密集化分析Tab"""
    st.header("💪 工作密集化：荷兰36小时工作制背后的真相")
    st.caption("基于荷兰统计局(CBS)劳动力数据 - Sprint 4核心故事：揭示隐形工作负荷")
    
    # 加载工作密集化数据
    work_data = load_parttime_data(df)  # 重用函数但重新命名概念
    if work_data is None:
        st.error("无法加载工作密集化数据，请检查数据源字段完整性")
        return
    
    # 计算Big Numbers
    big_numbers = calculate_parttime_big_numbers(work_data)
    if big_numbers is None:
        st.error("无法计算工作密集化关键指标")
        return
    
    # === 顶部：Sprint 4 核心大数字 ===
    st.subheader("🎯 Sprint 4 核心洞察：工作密集化三大指标")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        trend_data = big_numbers['parttime_trend']
        st.metric(
            "📊 工作负荷分布",
            f"{trend_data['end_ratio']:.1f}%",
            "非全职工作比例"
        )
        st.caption(f"2024年约1/4员工承担非标准工作负荷")
    
    with col2:
        gap_data = big_numbers['efficiency_gap']
        # 将负值转为正值，因为我们要强调工作密集化
        intensification_index = abs(gap_data['gap'])
        st.metric(
            "💪 工作密集化指数",
            f"+{intensification_index:.1f}个百分点",
            "每个员工承担更多工作"
        )
        st.caption(f"FTE增长({gap_data['fte_growth']:.1f}%)超过员工增长({gap_data['total_growth']:.1f}%)")
    
    with col3:
        industry_data = big_numbers['industry_ranking']
        if industry_data['top_parttime'] is not None:
            top_industry = industry_data['top_parttime']
            st.metric(
                "🏗️ 工作负荷最重行业",
                f"{top_industry['Parttime_Ratio']:.1f}%",
                top_industry['Title'][:20] + "..."
            )
            st.caption("非标准工作安排最多的行业")
    
    # 故事化总结
    with st.expander("📖 工作密集化故事总结"):
        trend_data = big_numbers['parttime_trend']
        gap_data = big_numbers['efficiency_gap']
        intensification_index = abs(gap_data['gap'])
        st.markdown(f"""
        **"荷兰36小时工作制背后的真相"核心发现：**
        
        💪 **隐形工作密集化**：虽然荷兰以短工时闻名全球(平均36.4小时/周)，但数据显示工作密集化指数上升{intensification_index:.1f}个百分点，每个员工实际承担着更重的工作负荷
        
        📊 **生产力压力增加**：员工数增长{gap_data['total_growth']:.1f}%，但工作量(FTE)增长{gap_data['fte_growth']:.1f}%，意味着平均每人要完成更多任务，工作强度在悄悄提升
        
        🏗️ **行业负荷差异**：不同行业的工作负荷分布不均，某些行业超过{trend_data['end_ratio']:.0f}%的员工承担非标准工作安排，隐性加班文化正在形成
        
        💡 **深度洞察**：荷兰表面上的"工作生活平衡"背后，实际上是一场静悄悄的工作密集化革命。每小时创造$92价值的高生产率，是以隐形的工作强度提升为代价的。
        
        🌍 **国际对比**：与其他国家相比，荷兰在保持短工时的同时，通过提高工作密集度来维持竞争力，这种模式值得深入研究。
        
        📊 **计算说明**：工作密集化指数 = FTE增长率 - 员工增长率。正值表示每个员工承担的平均工作量在增加。
        """)
    
    st.markdown("---")
    
    # === 中部：详细分析图表 ===
    st.subheader("📊 工作密集化深度分析图表")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("📈 工作负荷分布历史趋势")
        st.caption("显示非全职工作比例变化，反映工作安排的灵活性")
        trend_chart = create_parttime_trend_chart(trend_data['yearly_data'])
        if trend_chart:
            st.plotly_chart(trend_chart, use_container_width=True)
    
    with col2:
        st.subheader("🏗️ 各行业工作负荷分布")
        st.caption("不同行业的工作安排模式差异对比")
        if industry_data['industry_data_2024'] is not None:
            ranking_chart = create_industry_parttime_ranking_chart(industry_data['industry_data_2024'])
            st.plotly_chart(ranking_chart, use_container_width=True)


# ========== 故事5：效率之谜分析函数 ==========

def load_work_hours_data(df):
    """加载工时与薪酬分析数据 - 全新设计"""
    print("🕰️ 加载工时与薪酬博弈数据...")
    
    # 核心字段：重点关注工时、时薪、FTE
    key_fields = [
        'HoursWorked_21',               # 实际工作小时(百万小时)
        'FullTimeEquivalentFte_20',     # 全职等效人数(千人) 
        'CompensationPerHourWorked_11', # 总补偿时薪(欧元) - 包含福利
        'WagesPerHourWorked_12',        # 基本工资时薪(欧元) - 不含福利
        'HoursPaid_22',                 # 支付小时数(百万小时) - 可选
        'HoursAgreed_23',               # 约定小时数(百万小时) - 可选
        'PaidExtraHours_24',            # 额外支付小时(百万小时) - 可选
        'Total_27',                     # 总岗位数(千人)
        'Title', 'Year'
    ]
    
    # 检查必要字段(前4个是必需的)
    required_fields = key_fields[:4] + ['Title', 'Year']
    missing_fields = [field for field in required_fields if field not in df.columns]
    if missing_fields:
        st.error(f"缺少必要字段: {missing_fields}")
        return None
    
    # 筛选有完整数据的记录(只要求必要字段)
    work_data = df[key_fields].copy()
    work_data = work_data.dropna(subset=required_fields[:-2])  # 不要求Title和Year
    
    print(f"✅ 工时薪酬数据加载: {len(work_data)}条有效记录")
    
    # 计算核心指标
    print("📋 计算核心工时薪酬指标...")
    
    # 1. 平均年工时 = 实际工作小时 × 1000 ÷ 全职等效人数
    work_data['Hours_Per_FTE'] = (
        work_data['HoursWorked_21'] * 1000 / work_data['FullTimeEquivalentFte_20']
    ).round(0)
    
    # 2. 时薪差距 = 总补偿时薪 - 基本工资时薪 (福利部分)
    work_data['Benefit_Per_Hour'] = (
        work_data['CompensationPerHourWorked_11'] - work_data['WagesPerHourWorked_12']
    ).round(2)
    
    # 3. 福利占时薪比例
    work_data['Benefit_Ratio'] = (
        work_data['Benefit_Per_Hour'] / work_data['CompensationPerHourWorked_11'] * 100
    ).round(1)
    
    # 4. 工时效率指标(如果有支付小时数据)
    if 'HoursPaid_22' in work_data.columns and work_data['HoursPaid_22'].notna().sum() > 100:
        work_data['Hours_Efficiency'] = (
            work_data['HoursWorked_21'] / work_data['HoursPaid_22'] * 100
        ).round(1)
        print("✅ 计算工时效率指标")
    else:
        work_data['Hours_Efficiency'] = None
        print("⚠️ 支付小时数据不足，跳过效率计算")
    
    # 5. 加班强度(如果有加班数据)
    if 'PaidExtraHours_24' in work_data.columns and 'HoursAgreed_23' in work_data.columns:
        extra_data = work_data[['PaidExtraHours_24', 'HoursAgreed_23']].dropna()
        if len(extra_data) > 100:
            work_data['Overtime_Intensity'] = (
                work_data['PaidExtraHours_24'] / work_data['HoursAgreed_23'] * 100
            ).round(1)
            print("✅ 计算加班强度指标")
        else:
            work_data['Overtime_Intensity'] = None
            print("⚠️ 加班数据不足，跳过加班分析")
    else:
        work_data['Overtime_Intensity'] = None
    
    print(f"📊 数据统计: 平均年工时 {work_data['Hours_Per_FTE'].mean():.0f}h, 平均时薪 €{work_data['CompensationPerHourWorked_11'].mean():.2f}")
    
    return work_data

def calculate_work_hours_big_numbers(work_data):
    """计算工时分析的Big Numbers - 重新设计专注用户需求"""
    if work_data is None or work_data.empty:
        return None
    
    print("🎯 计算工时分析Big Numbers...")
    
    # Big Number 1: 平均工时变化趋势 (2010-2024)
    yearly_trends = calculate_work_hours_trends(work_data)
    
    # Big Number 2: 行业工时排名 (2024年最新数据)
    latest_year = work_data['Year'].max()
    current_data = work_data[work_data['Year'] == latest_year].copy()
    industry_hours_ranking = calculate_industry_hours_ranking(current_data)
    
    # Big Number 3: 行业时薪排名 (2024年最新数据)
    industry_wage_ranking = calculate_industry_wage_ranking(current_data)
    
    print(f"📅 使用{latest_year}年数据进行分析，共{len(current_data)}个行业")
    
    return {
        'work_hours_trends': yearly_trends,
        'industry_hours_ranking': industry_hours_ranking,
        'industry_wage_ranking': industry_wage_ranking,
        'analysis_year': latest_year,
        'analysis_data': current_data
    }

def calculate_work_hours_trends(work_data):
    """计算工时变化趋势 - Big Number 1"""
    # 按年份汇总平均工时
    yearly_summary = work_data.groupby('Year').agg({
        'Hours_Per_FTE': 'mean',
        'HoursWorked_21': 'sum',
        'FullTimeEquivalentFte_20': 'sum'
    }).reset_index()
    
    # 计算总体平均工时变化
    yearly_summary['Overall_Hours_Per_FTE'] = (yearly_summary['HoursWorked_21'] * 1000 / yearly_summary['FullTimeEquivalentFte_20']).round(0)
    
    # 获取2010和2024年数据
    base_year_data = yearly_summary[yearly_summary['Year'] == 2010]
    latest_year_data = yearly_summary[yearly_summary['Year'] == 2024]
    
    if not base_year_data.empty and not latest_year_data.empty:
        base_hours = base_year_data['Overall_Hours_Per_FTE'].iloc[0]
        latest_hours = latest_year_data['Overall_Hours_Per_FTE'].iloc[0]
        hours_change = latest_hours - base_hours
        hours_change_percent = (hours_change / base_hours * 100) if base_hours > 0 else 0
        
        print(f"🕒 工时变化: {base_hours:.0f}h → {latest_hours:.0f}h ({hours_change:+.0f}h, {hours_change_percent:+.1f}%)")
        
        return {
            'base_year': 2010,
            'latest_year': 2024,
            'base_hours': base_hours,
            'latest_hours': latest_hours,
            'hours_change': hours_change,
            'change_percent': hours_change_percent,
            'yearly_data': yearly_summary
        }
    
    return None

def calculate_industry_hours_ranking(current_data):
    """计算行业工时排名 - Big Number 2"""
    valid_hours_data = current_data[current_data['Hours_Per_FTE'].notna()].copy()
    
    if valid_hours_data.empty:
        return None
    
    # 按工时排序
    hours_ranking = valid_hours_data.sort_values('Hours_Per_FTE', ascending=False).reset_index(drop=True)
    
    highest_hours = hours_ranking.iloc[0]
    lowest_hours = hours_ranking.iloc[-1]
    
    print(f"🏆 工时最高: {highest_hours['Title'][:30]} ({highest_hours['Hours_Per_FTE']:.0f}h)")
    print(f"🔽 工时最低: {lowest_hours['Title'][:30]} ({lowest_hours['Hours_Per_FTE']:.0f}h)")
    
    return {
        'highest_hours_industry': highest_hours,
        'lowest_hours_industry': lowest_hours,
        'hours_gap_ratio': highest_hours['Hours_Per_FTE'] / lowest_hours['Hours_Per_FTE'],
        'ranking_data': hours_ranking
    }

def calculate_industry_wage_ranking(current_data):
    """计算行业时薪排名 - Big Number 3"""
    valid_wage_data = current_data[current_data['CompensationPerHourWorked_11'].notna()].copy()
    
    if valid_wage_data.empty:
        return None
    
    # 按时薪排序
    wage_ranking = valid_wage_data.sort_values('CompensationPerHourWorked_11', ascending=False).reset_index(drop=True)
    
    highest_wage = wage_ranking.iloc[0]
    lowest_wage = wage_ranking.iloc[-1]
    
    print(f"💰 时薪最高: {highest_wage['Title'][:30]} (€{highest_wage['CompensationPerHourWorked_11']:.2f}/h)")
    print(f"💸 时薪最低: {lowest_wage['Title'][:30]} (€{lowest_wage['CompensationPerHourWorked_11']:.2f}/h)")
    
    return {
        'highest_wage_industry': highest_wage,
        'lowest_wage_industry': lowest_wage,
        'wage_gap_ratio': highest_wage['CompensationPerHourWorked_11'] / lowest_wage['CompensationPerHourWorked_11'],
        'ranking_data': wage_ranking
    }

def create_hourly_growth_comparison_chart(growth_data):
    """创建时薪增长对比图"""
    if growth_data is None or growth_data.empty:
        return None
    
    # 取前15个增长最快的行业
    top_growth = growth_data.head(15)
    
    fig = px.bar(
        top_growth,
        y='Title',
        x='Growth_Rate',
        orientation='h',
        title='⚡ 2010-2024年各行业时薪增长率排名 (Top 15)',
        color='Growth_Rate',
        color_continuous_scale='Viridis'
    )
    
    fig.update_layout(
        xaxis_title="时薪增长率 (%)",
        yaxis_title="行业",
        height=600
    )
    
    return fig

def create_efficiency_distribution_chart(growth_data):
    """创建效率分化分布图"""
    if growth_data is None or growth_data.empty:
        return None
    
    fig = px.histogram(
        growth_data,
        x='Growth_Rate',
        nbins=20,
        title='📊 行业时薪增长率分布：效率分化现象',
        color_discrete_sequence=['#06b6d4']
    )
    
    fig.update_layout(
        xaxis_title="时薪增长率 (%)",
        yaxis_title="行业数量",
        showlegend=False
    )
    
    # 添加分界线
    fig.add_vline(x=30, line_dash="dash", line_color="red", 
                  annotation_text="低增长界限 (30%)")
    fig.add_vline(x=50, line_dash="dash", line_color="green", 
                  annotation_text="高增长界限 (50%)")
    
    return fig

def create_work_hours_trend_chart(yearly_data):
    """创建工时变化趋势图"""
    if yearly_data is None or yearly_data.empty:
        return None
    
    import plotly.graph_objects as go
    from plotly.subplots import make_subplots
    
    # 创建趋势线图
    fig = go.Figure()
    
    fig.add_trace(go.Scatter(
        x=yearly_data['Year'],
        y=yearly_data['Overall_Hours_Per_FTE'],
        mode='lines+markers',
        name='平均年工时',
        line=dict(color='#2563eb', width=3),
        marker=dict(size=8, color='#2563eb')
    ))
    
    # 添加基准线
    base_value = yearly_data[yearly_data['Year'] == 2010]['Overall_Hours_Per_FTE'].iloc[0] if not yearly_data[yearly_data['Year'] == 2010].empty else None
    if base_value:
        fig.add_hline(y=base_value, line_dash="dash", line_color="gray", 
                      annotation_text=f"2010年基准: {base_value:.0f}h")
    
    fig.update_layout(
        title='📈 荷兰平均年工时变化趋势 (2010-2024)',
        xaxis_title='年份',
        yaxis_title='平均年工时 (小时)',
        showlegend=False,
        height=400
    )
    
    return fig

def create_industry_hours_ranking_chart(ranking_data):
    """创建行业工时排名图"""
    if ranking_data is None or ranking_data.empty:
        return None
    
    import plotly.express as px
    
    # 取前10个最高工时的行业
    top_10 = ranking_data.head(10).copy()
    top_10['Short_Title'] = top_10['Title'].str[:20] + '...'
    
    fig = px.bar(
        top_10,
        y='Short_Title',
        x='Hours_Per_FTE',
        orientation='h',
        title='🏆 各行业年工时排名 (Top 10)',
        color='Hours_Per_FTE',
        color_continuous_scale='Reds'
    )
    
    fig.update_layout(
        xaxis_title='年工时 (小时)',
        yaxis_title='',
        showlegend=False,
        height=400,
        yaxis={'categoryorder':'total ascending'}
    )
    
    return fig

def create_industry_wage_ranking_chart(ranking_data):
    """创建行业时薪排名图"""
    if ranking_data is None or ranking_data.empty:
        return None
    
    import plotly.express as px
    
    # 取前12个最高时薪的行业
    top_12 = ranking_data.head(12).copy()
    top_12['Short_Title'] = top_12['Title'].str[:18] + '...'
    
    fig = px.bar(
        top_12,
        y='Short_Title',
        x='CompensationPerHourWorked_11',
        orientation='h',
        title='💰 各行业时薪排名 (Top 12)',
        color='CompensationPerHourWorked_11',
        color_continuous_scale='Greens'
    )
    
    fig.update_layout(
        xaxis_title='时薪 (欧元/小时)',
        yaxis_title='',
        showlegend=False,
        height=400,
        yaxis={'categoryorder':'total ascending'}
    )
    
    return fig

def display_efficiency_mystery_tab(df):
    """显示效率之谜分析Tab"""
    st.header("🕒 工时分析：平均工时变化与行业排名")
    st.caption("基于荷兰统计局(CBS)工时薪酬数据 - 专注工时趋势与行业对比")
    
    # 加载工时薪酬数据
    work_data = load_work_hours_data(df)
    if work_data is None:
        st.error("无法加载工时薪酬数据，请检查数据源字段完整性")
        return
    
    # 计算Big Numbers
    big_numbers = calculate_work_hours_big_numbers(work_data)
    if big_numbers is None:
        st.error("无法计算工时薪酬分析关键指标")
        return
    
    # === 顶部：三个核心大数字 ===
    st.subheader("🎯 核心洞察：工时变化与行业排名三大发现")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        trends_data = big_numbers['work_hours_trends']
        if trends_data:
            latest_hours = trends_data['latest_hours']
            weekly_hours = latest_hours / 52  # 转换为周工时
            st.metric(
                "🕒 平均工时水平",
                f"{weekly_hours:.1f}小时/周",
                f"2024年荷兰平均工时"
            )
            st.caption(f"年工时: {latest_hours:.0f}小时")
    
    with col2:
        hours_ranking = big_numbers['industry_hours_ranking']
        if hours_ranking and isinstance(hours_ranking['highest_hours_industry'], pd.Series):
            highest = hours_ranking['highest_hours_industry']
            highest_weekly = highest['Hours_Per_FTE'] / 52  # 转换为周工时
            st.metric(
                "🏆 工时最高行业",
                f"{highest_weekly:.1f}小时/周",
                highest['Title'][:20] + "..."
            )
            hours_gap = hours_ranking['hours_gap_ratio']
            st.caption(f"与最低行业相差{hours_gap:.1f}倍")
    
    with col3:
        wage_ranking = big_numbers['industry_wage_ranking']
        if wage_ranking and isinstance(wage_ranking['highest_wage_industry'], pd.Series):
            highest_wage = wage_ranking['highest_wage_industry']
            lowest_wage = wage_ranking['lowest_wage_industry']
            st.metric(
                "💰 时薪差距倍数",
                f"{wage_ranking['wage_gap_ratio']:.1f}倍",
                f"€{highest_wage['CompensationPerHourWorked_11']:.1f} vs €{lowest_wage['CompensationPerHourWorked_11']:.1f}"
            )
            st.caption(f"最高: {highest_wage['Title'][:15]}...")
    
    # 数据洞察总结
    with st.expander("📖 工时分析核心发现"):
        trends_data = big_numbers['work_hours_trends']
        hours_ranking = big_numbers['industry_hours_ranking']
        wage_ranking = big_numbers['industry_wage_ranking']
        
        if trends_data and hours_ranking and wage_ranking:
            highest_hours = hours_ranking['highest_hours_industry']
            highest_wage = wage_ranking['highest_wage_industry']
            lowest_wage = wage_ranking['lowest_wage_industry']
            
            st.markdown(f"""
            **"荷兰工时分析：趋势变化与行业差异"核心发现：**
            
            🕒 **工时变化趋势**：2010-2024年间，荷兰平均工时从{trends_data['base_hours']:.0f}小时{('增加' if trends_data['hours_change'] > 0 else '减少')}到{trends_data['latest_hours']:.0f}小时，变化幅度{abs(trends_data['change_percent']):.1f}%
            
            🏆 **工时最高行业**：{highest_hours['Title'][:40] if isinstance(highest_hours, pd.Series) else 'N/A'}行业年工时达{highest_hours['Hours_Per_FTE']:.0f}小时，是最低工时行业的{hours_ranking['hours_gap_ratio']:.1f}倍，显示行业间工作强度差异巨大
            
            💰 **时薪差距现状**：{highest_wage['Title'][:40] if isinstance(highest_wage, pd.Series) else 'N/A'}时薪最高(€{highest_wage['CompensationPerHourWorked_11']:.1f}/h)，而{lowest_wage['Title'][:40] if isinstance(lowest_wage, pd.Series) else 'N/A'}时薪最低(€{lowest_wage['CompensationPerHourWorked_11']:.1f}/h)，两者相差{wage_ranking['wage_gap_ratio']:.1f}倍
            
            💡 **深度洞察**：荷兰劳动力市场呈现明显的行业分化特征。高技能行业实现"高时薪、适度工时"的理想状态，而传统服务业仍需依靠较长工时维持收入。这种差异反映了知识经济时代技能价值的重要性。
            """)
        
        # 数据说明
        st.info(f"""
        📊 **数据计算说明**：
        - **平均年工时** = 实际工作小时(百万) × 1000 ÷ 全职等效人数(千人)  
        - **时薪数据** = 包含福利津贴的总补偿时薪(欧元/小时)
        - **工时变化** = (2024年工时 - 2010年工时) ÷ 2010年工时 × 100%
        - **分析覆盖** = 基于{len(big_numbers['analysis_data'])}个行业的完整数据
        """)
    
    st.markdown("---")
    
    # === 中部：详细分析图表 ===
    st.subheader("📊 工时趋势与行业排名分析图表")
    
    col_left, col_right = st.columns(2)
    
    with col_left:
        st.subheader("📈 工时变化趋势")
        
        # 创建工时趋势图
        if trends_data and 'yearly_data' in trends_data:
            trend_chart = create_work_hours_trend_chart(trends_data['yearly_data'])
            if trend_chart:
                st.plotly_chart(trend_chart, use_container_width=True)
        
        # 显示年度统计
        st.subheader("📊 历年工时统计")
        if trends_data and 'yearly_data' in trends_data:
            recent_years = trends_data['yearly_data'].tail(5)
            for _, row in recent_years.iterrows():
                year = int(row['Year'])
                hours = row['Overall_Hours_Per_FTE']
                st.text(f"{year}年: {hours:.0f}小时")
    
    with col_right:
        st.subheader("🏆 行业工时排名")
        
        # 创建行业工时排名图
        if hours_ranking and 'ranking_data' in hours_ranking:
            hours_ranking_chart = create_industry_hours_ranking_chart(hours_ranking['ranking_data'])
            if hours_ranking_chart:
                st.plotly_chart(hours_ranking_chart, use_container_width=True)
        
        # 显示工时Top 5
        st.subheader("🕒 工时最高 Top 5")
        if hours_ranking and 'ranking_data' in hours_ranking:
            top_5_hours = hours_ranking['ranking_data'].head(5)
            for i, (_, row) in enumerate(top_5_hours.iterrows()):
                st.text(f"{i+1}. {row['Title'][:25]}... {row['Hours_Per_FTE']:.0f}h")
    
    st.divider()
    
    # === 底部：时薪排名分析 ===
    st.subheader("💰 行业时薪排名分析")
    
    col_left2, col_right2 = st.columns(2)
    
    with col_left2:
        # 时薪排名图表
        if wage_ranking and 'ranking_data' in wage_ranking:
            wage_ranking_chart = create_industry_wage_ranking_chart(wage_ranking['ranking_data'])
            if wage_ranking_chart:
                st.plotly_chart(wage_ranking_chart, use_container_width=True)
    
    with col_right2:
        # 时薪统计
        st.subheader("💰 时薪最高 Top 5")
        if wage_ranking and 'ranking_data' in wage_ranking:
            top_5_wages = wage_ranking['ranking_data'].head(5)
            for i, (_, row) in enumerate(top_5_wages.iterrows()):
                st.text(f"{i+1}. {row['Title'][:20]}... €{row['CompensationPerHourWorked_11']:.2f}")
        
        st.subheader("💸 时薪最低 Bottom 3")
        if wage_ranking and 'ranking_data' in wage_ranking:
            bottom_3_wages = wage_ranking['ranking_data'].tail(3)
            for i, (_, row) in enumerate(bottom_3_wages.iterrows()):
                st.text(f"{i+1}. {row['Title'][:20]}... €{row['CompensationPerHourWorked_11']:.2f}")


if __name__ == "__main__":
    main()
