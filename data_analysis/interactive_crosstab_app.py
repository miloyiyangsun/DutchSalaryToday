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
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from pathlib import Path
from st_keyup import st_keyup
import re
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
    tab1, tab2, tab3, tab4 = st.tabs(["📊 交叉表分析", "🔍 缺失值分析", "💰 工资增长冠军", "📈 薪酬差距透视"])

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


if __name__ == "__main__":
    main()
