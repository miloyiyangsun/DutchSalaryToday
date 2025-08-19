#!/usr/bin/env python3
"""
Gender Power Analysis - 职场女性力量深度分析
用于生成故事2的Big Numbers和趋势可视化
"""

import pandas as pd

def load_data():
    """加载和清理数据"""
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
    
    return gender_complete

def calculate_big_numbers(df):
    """计算三个Big Numbers"""
    
    # Big Number 1: 女性占比突破 (整体趋势)
    yearly_totals = df.groupby('Year').agg({
        'Male_28': 'sum',
        'Female_29': 'sum', 
        'Total_27': 'sum'
    }).reset_index()
    
    yearly_totals['Overall_Female_Pct'] = (
        yearly_totals['Female_29'] / yearly_totals['Total_27'] * 100
    ).round(1)
    
    female_2010 = yearly_totals[yearly_totals['Year'] == 2010]['Overall_Female_Pct'].iloc[0]
    female_2024 = yearly_totals[yearly_totals['Year'] == 2024]['Overall_Female_Pct'].iloc[0]
    change_pct = female_2024 - female_2010
    
    # Big Number 2: 新增岗位贡献
    totals_2010 = df[df['Year'] == 2010].agg({
        'Male_28': 'sum', 'Female_29': 'sum', 'Total_27': 'sum'
    })
    totals_2024 = df[df['Year'] == 2024].agg({
        'Male_28': 'sum', 'Female_29': 'sum', 'Total_27': 'sum'
    })
    
    total_new_jobs = totals_2024['Total_27'] - totals_2010['Total_27']
    female_new_jobs = totals_2024['Female_29'] - totals_2010['Female_29']
    female_contribution = (female_new_jobs / total_new_jobs * 100).round(1)
    
    # Big Number 3: 行业主导地位
    industry_2024 = df[df['Year'] == 2024].copy()
    industry_2024['Female_Percentage'] = (
        industry_2024['Female_29'] / industry_2024['Total_27'] * 100
    ).round(1)
    
    female_dominant_count = len(industry_2024[industry_2024['Female_Percentage'] > 50])
    top_female_industry = industry_2024.loc[
        industry_2024['Female_Percentage'].idxmax()
    ]
    
    return {
        'big_number_1': {
            'label': '女性占比突破',
            'value': f'{female_2010}% → {female_2024}%',
            'change': f'+{change_pct:.1f}%',
            'trend': 'up'
        },
        'big_number_2': {
            'label': '新增岗位贡献', 
            'value': f'{female_contribution}%',
            'change': f'{female_new_jobs:,.0f}/{total_new_jobs:,.0f}个',
            'trend': 'up'
        },
        'big_number_3': {
            'label': '行业主导地位',
            'value': f'{female_dominant_count}个行业',
            'change': f'最高达{top_female_industry["Female_Percentage"]:.1f}%',
            'trend': 'up'
        },
        'yearly_data': yearly_totals
    }

def create_trend_summary(yearly_data):
    """创建女性占比趋势文字总结"""
    
    print("\n📈 女性占比完整趋势 (1995-2024):")
    print("-" * 40)
    
    # 显示关键年份数据
    key_years = [1995, 2000, 2005, 2010, 2015, 2020, 2024]
    for year in key_years:
        if year in yearly_data['Year'].values:
            pct = yearly_data[yearly_data['Year'] == year]['Overall_Female_Pct'].iloc[0]
            print(f"{year}: {pct:5.1f}%")
    
    # 计算趋势统计
    data_1995 = yearly_data[yearly_data['Year'] == 1995]['Overall_Female_Pct'].iloc[0]
    data_2024 = yearly_data[yearly_data['Year'] == 2024]['Overall_Female_Pct'].iloc[0]
    total_change = data_2024 - data_1995
    annual_rate = total_change / (2024 - 1995)
    
    print(f"\n📊 趋势统计:")
    print(f"30年总增长: +{total_change:.1f}% ({data_1995:.1f}% → {data_2024:.1f}%)")
    print(f"年均增长: +{annual_rate:.2f}% per year")
    
    return yearly_data

def analyze_industry_breakdown(df):
    """分析行业层面的性别分布"""
    
    # 2024年各行业女性占比排名
    industry_2024 = df[df['Year'] == 2024].copy()
    industry_2024['Female_Percentage'] = (
        industry_2024['Female_29'] / industry_2024['Total_27'] * 100
    ).round(1)
    
    # 前10和后10
    top_10 = industry_2024.nlargest(10, 'Female_Percentage')
    bottom_10 = industry_2024.nsmallest(10, 'Female_Percentage')
    
    print("\n🏆 女性占比最高的10个行业:")
    for _, row in top_10.iterrows():
        print(f"  {row['Title'][:50]:<50} {row['Female_Percentage']:>5.1f}%")
    
    print("\n👨 男性占绝对优势的10个行业:")
    for _, row in bottom_10.iterrows():
        print(f"  {row['Title'][:50]:<50} {row['Female_Percentage']:>5.1f}%")
    
    return top_10, bottom_10

def main():
    """主分析函数"""
    print("🚺 职场女性力量深度分析")
    print("=" * 50)
    
    # 加载数据
    df = load_data()
    print(f"✅ 数据加载完成: {len(df)}条记录，覆盖{df['Year'].nunique()}年")
    
    # 计算Big Numbers
    results = calculate_big_numbers(df)
    
    print("\n📊 Big Numbers结果:")
    print("-" * 30)
    for key, data in results.items():
        if key != 'yearly_data':
            print(f"{data['label']}: {data['value']} ({data['change']})")
    
    # 创建趋势分析
    create_trend_summary(results['yearly_data'])
    
    # 行业分析
    analyze_industry_breakdown(df)
    
    return results

if __name__ == "__main__":
    results = main()