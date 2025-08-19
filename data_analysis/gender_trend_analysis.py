#!/usr/bin/env python3
"""
Gender Trend Analysis - 女性力量详细趋势分析
深度分析两个核心Big Numbers的历史演变过程
1. 新职位贡献力60.1%的趋势图  
2. 行业主导数量17个的变化图
"""

import pandas as pd
import numpy as np

def load_and_clean_data():
    """加载和清理数据"""
    print("📊 正在加载数据...")
    df = pd.read_csv('merged_data.csv')
    
    # 筛选有完整性别数据的记录
    gender_complete = df[
        df['Male_28'].notna() & 
        df['Female_29'].notna() & 
        df['Total_27'].notna()
    ].copy()
    
    # 计算女性占比
    gender_complete['Female_Percentage'] = (
        gender_complete['Female_29'] / gender_complete['Total_27'] * 100
    ).round(1)
    
    print(f"✅ 数据清理完成: {len(gender_complete)}条记录，覆盖{gender_complete['Year'].nunique()}年")
    return gender_complete

def calculate_yearly_contribution_trend(df):
    """计算女性新增岗位贡献率的年度趋势 - 详细分析60.1%的来源"""
    print("\n💼 分析新职位贡献力趋势...")
    
    # 按年份汇总总体数据
    yearly_totals = df.groupby('Year').agg({
        'Female_29': 'sum',
        'Total_27': 'sum'
    }).reset_index()
    
    # 以2010年为基准计算累积贡献率
    base_year = 2010
    base_data = yearly_totals[yearly_totals['Year'] == base_year]
    if base_data.empty:
        print("❌ 无法找到2010年基准数据")
        return None
    
    base_female = base_data['Female_29'].iloc[0]
    base_total = base_data['Total_27'].iloc[0]
    
    print(f"📍 基准年份 {base_year}: 女性{base_female:,.0f}人, 总计{base_total:,.0f}人")
    
    # 计算每年的累积贡献率
    contribution_data = []
    for _, row in yearly_totals.iterrows():
        year = row['Year']
        if year >= base_year:
            total_new = row['Total_27'] - base_total
            female_new = row['Female_29'] - base_female
            
            if total_new > 0:
                contribution_rate = (female_new / total_new) * 100
            else:
                contribution_rate = 0
            
            contribution_data.append({
                'Year': int(year),
                'Female_Contribution_Rate': round(contribution_rate, 1),
                'Total_New_Jobs': int(total_new),
                'Female_New_Jobs': int(female_new),
                'Female_Current': int(row['Female_29']),
                'Total_Current': int(row['Total_27'])
            })
    
    trend_df = pd.DataFrame(contribution_data)
    
    print("\n📈 新职位贡献力历年趋势:")
    print("-" * 80)
    print(f"{'年份':<6} {'女性贡献率':<10} {'女性新增':<10} {'总新增':<10} {'累积女性':<12} {'累积总数':<12}")
    print("-" * 80)
    
    for _, row in trend_df.iterrows():
        print(f"{row['Year']:<6} {row['Female_Contribution_Rate']:>7.1f}%   "
              f"{row['Female_New_Jobs']:>8,}   {row['Total_New_Jobs']:>8,}   "
              f"{row['Female_Current']:>10,}   {row['Total_Current']:>10,}")
    
    # 重点分析2024年的60.1%
    final_data = trend_df[trend_df['Year'] == 2024]
    if not final_data.empty:
        final_row = final_data.iloc[0]
        print(f"\n🎯 2024年关键数据分析:")
        print(f"   新职位贡献率: {final_row['Female_Contribution_Rate']}%")
        print(f"   女性新增岗位: {final_row['Female_New_Jobs']:,}个") 
        print(f"   总新增岗位: {final_row['Total_New_Jobs']:,}个")
        print(f"   计算验证: {final_row['Female_New_Jobs']}/{final_row['Total_New_Jobs']} = {final_row['Female_New_Jobs']/final_row['Total_New_Jobs']*100:.1f}%")
    
    return trend_df

def calculate_yearly_dominant_industries(df):
    """计算女性主导行业数量的年度变化 - 详细分析17个行业的来源"""
    print("\n👑 分析女性主导行业数量趋势...")
    
    years = sorted(df['Year'].unique())
    dominant_trends = []
    
    print(f"\n📊 女性主导行业数量年度变化 (女性占比>50%):")
    print("-" * 120)
    print(f"{'年份':<6} {'主导行业数':<10} {'最高占比':<10} {'最高占比行业':<50} {'50%+行业占比':<15}")
    print("-" * 120)
    
    for year in years:
        year_data = df[df['Year'] == year].copy()
        
        # 统计女性占比>50%的行业
        dominant_industries = year_data[year_data['Female_Percentage'] > 50]
        dominant_count = len(dominant_industries)
        
        # 获取女性占比最高的行业
        if not year_data.empty:
            top_industry = year_data.loc[year_data['Female_Percentage'].idxmax()]
            top_percentage = top_industry['Female_Percentage']
            top_name = top_industry['Title']
        else:
            top_percentage = 0
            top_name = "N/A"
        
        # 计算主导行业在所有行业中的占比
        total_industries = len(year_data)
        dominant_ratio = (dominant_count / total_industries * 100) if total_industries > 0 else 0
        
        dominant_trends.append({
            'Year': int(year),
            'Dominant_Count': dominant_count,
            'Top_Percentage': round(top_percentage, 1),
            'Top_Industry': top_name,
            'Total_Industries': total_industries,
            'Dominant_Ratio': round(dominant_ratio, 1)
        })
        
        # 显示关键年份的详细信息
        if year in [1995, 2000, 2005, 2010, 2015, 2020, 2024]:
            print(f"{int(year):<6} {dominant_count:>8}个   {top_percentage:>7.1f}%   "
                  f"{top_name[:45]:<45}   {dominant_ratio:>11.1f}%")
    
    trend_df = pd.DataFrame(dominant_trends)
    
    # 重点分析2024年的17个行业
    final_data = trend_df[trend_df['Year'] == 2024]
    if not final_data.empty:
        final_row = final_data.iloc[0]
        print(f"\n🎯 2024年女性主导行业详细分析:")
        print(f"   女性主导行业数量: {final_row['Dominant_Count']}个")
        print(f"   总行业数量: {final_row['Total_Industries']}个")
        print(f"   主导行业占比: {final_row['Dominant_Ratio']}%")
        print(f"   最高女性占比: {final_row['Top_Percentage']}% ({final_row['Top_Industry'][:30]}...)")
        
        # 列出所有女性主导的行业
        final_year_data = df[df['Year'] == 2024]
        dominant_list = final_year_data[final_year_data['Female_Percentage'] > 50].sort_values('Female_Percentage', ascending=False)
        print(f"\n📋 2024年女性主导的{len(dominant_list)}个行业清单:")
        for i, (_, industry) in enumerate(dominant_list.iterrows(), 1):
            print(f"   {i:2d}. {industry['Title'][:55]:<55} {industry['Female_Percentage']:>5.1f}%")
    
    return trend_df

def analyze_growth_patterns(contribution_df, dominant_df):
    """分析两个指标的增长模式"""
    print(f"\n📈 增长模式深度分析:")
    print("=" * 60)
    
    if contribution_df is not None and not contribution_df.empty:
        # 新职位贡献率的增长分析
        start_contrib = contribution_df[contribution_df['Year'] == 2010]['Female_Contribution_Rate'].iloc[0]
        end_contrib = contribution_df[contribution_df['Year'] == 2024]['Female_Contribution_Rate'].iloc[0]
        contrib_growth = end_contrib - start_contrib
        
        print(f"💼 新职位贡献力变化:")
        print(f"   2010年: {start_contrib}% → 2024年: {end_contrib}% (增长{contrib_growth:+.1f}%)")
        
        # 计算年均增长率
        years_span = 2024 - 2010
        annual_contrib_growth = contrib_growth / years_span
        print(f"   年均增长: {annual_contrib_growth:+.2f}%/年")
    
    if dominant_df is not None and not dominant_df.empty:
        # 女性主导行业数量的增长分析
        start_dominant = dominant_df[dominant_df['Year'] == 2010]['Dominant_Count'].iloc[0]
        end_dominant = dominant_df[dominant_df['Year'] == 2024]['Dominant_Count'].iloc[0]
        dominant_growth = end_dominant - start_dominant
        
        print(f"\n👑 女性主导行业数量变化:")
        print(f"   2010年: {start_dominant}个 → 2024年: {end_dominant}个 (增长{dominant_growth:+}个)")
        
        # 计算增长率
        growth_rate = (dominant_growth / start_dominant * 100) if start_dominant > 0 else 0
        print(f"   相对增长: {growth_rate:+.1f}%")

def main():
    """主分析函数"""
    print("🚺 女性力量Big Numbers详细趋势分析")
    print("=" * 60)
    print("深度解析两个核心数据的历史演变:")
    print("1. 新职位贡献力 60.1% 的计算过程和趋势")
    print("2. 行业主导数量 17个 的历史变化")
    print("=" * 60)
    
    # 加载数据
    df = load_and_clean_data()
    
    # 分析新职位贡献力趋势
    contribution_df = calculate_yearly_contribution_trend(df)
    
    # 分析女性主导行业数量趋势  
    dominant_df = calculate_yearly_dominant_industries(df)
    
    # 综合增长模式分析
    analyze_growth_patterns(contribution_df, dominant_df)
    
    print(f"\n✅ 分析完成! 两个Big Numbers的详细计算逻辑和历史趋势已生成。")
    
    return {
        'contribution_trend': contribution_df,
        'dominant_trend': dominant_df,
        'raw_data': df
    }

if __name__ == "__main__":
    results = main()