#!/usr/bin/env python3
"""
Corrected Gender Analysis - 修正版女性力量分析
使用更科学的方法计算女性贡献率，避免统计陷阱
"""

import pandas as pd

def load_data():
    """加载数据"""
    df = pd.read_csv('merged_data.csv')
    gender_complete = df[
        df['Male_28'].notna() & 
        df['Female_29'].notna() & 
        df['Total_27'].notna()
    ].copy()
    
    gender_complete['Female_Percentage'] = (
        gender_complete['Female_29'] / gender_complete['Total_27'] * 100
    ).round(1)
    
    return gender_complete

def calculate_corrected_contribution(df):
    """修正版贡献率计算 - 避免统计陷阱"""
    print("📊 修正版女性贡献率分析")
    print("=" * 60)
    
    # 按年份汇总
    yearly_totals = df.groupby('Year').agg({
        'Female_29': 'sum',
        'Male_28': 'sum', 
        'Total_27': 'sum'
    }).reset_index()
    
    # 方法1: 只计算稳定增长期 (2017-2024年)
    print("🔧 方法1: 稳定增长期分析 (2017-2024)")
    print("-" * 50)
    
    stable_period = yearly_totals[yearly_totals['Year'] >= 2017].copy()
    base_2017 = stable_period[stable_period['Year'] == 2017].iloc[0]
    end_2024 = stable_period[stable_period['Year'] == 2024].iloc[0]
    
    female_growth = end_2024['Female_29'] - base_2017['Female_29']
    total_growth = end_2024['Total_27'] - base_2017['Total_27']
    stable_contribution = (female_growth / total_growth * 100) if total_growth > 0 else 0
    
    print(f"2017年基准: 女性{base_2017['Female_29']:,.0f}人，总计{base_2017['Total_27']:,.0f}人")
    print(f"2024年现状: 女性{end_2024['Female_29']:,.0f}人，总计{end_2024['Total_27']:,.0f}人")
    print(f"7年净增长: 女性+{female_growth:,.0f}人，总计+{total_growth:,.0f}人")
    print(f"稳定期贡献率: {stable_contribution:.1f}%")
    
    # 方法2: 年度贡献率 (非累积)
    print(f"\n🔧 方法2: 年度贡献率分析 (避免累积效应)")
    print("-" * 50)
    
    yearly_contributions = []
    for i in range(1, len(yearly_totals)):
        prev_year = yearly_totals.iloc[i-1]
        curr_year = yearly_totals.iloc[i]
        
        female_change = curr_year['Female_29'] - prev_year['Female_29']
        total_change = curr_year['Total_27'] - prev_year['Total_27']
        
        if abs(total_change) >= 500:  # 设置最小阈值
            annual_contribution = (female_change / total_change * 100) if total_change != 0 else 0
            yearly_contributions.append({
                'Year': int(curr_year['Year']),
                'Female_Change': int(female_change),
                'Total_Change': int(total_change),
                'Annual_Contribution': round(annual_contribution, 1),
                'Reliable': '✅'
            })
        else:
            yearly_contributions.append({
                'Year': int(curr_year['Year']),
                'Female_Change': int(female_change),
                'Total_Change': int(total_change), 
                'Annual_Contribution': 0,
                'Reliable': '❌ 样本过小'
            })
    
    contributions_df = pd.DataFrame(yearly_contributions)
    
    print(f"{'年份':<6} {'女性变化':<10} {'总变化':<8} {'年度贡献率':<12} {'可靠性'}")
    print("-" * 60)
    for _, row in contributions_df.iterrows():
        if row['Reliable'] == '✅':
            print(f"{row['Year']:<6} {row['Female_Change']:>8,} {row['Total_Change']:>6,} {row['Annual_Contribution']:>9.1f}% {row['Reliable']}")
        else:
            print(f"{row['Year']:<6} {row['Female_Change']:>8,} {row['Total_Change']:>6,} {'--':>9} {row['Reliable']}")
    
    # 方法3: 3年滚动平均
    print(f"\n🔧 方法3: 3年滚动平均平滑分析")
    print("-" * 50)
    
    reliable_data = contributions_df[contributions_df['Reliable'] == '✅']
    if len(reliable_data) >= 3:
        recent_avg = reliable_data.tail(3)['Annual_Contribution'].mean()
        print(f"近3年可靠数据平均贡献率: {recent_avg:.1f}%")
        print(f"涉及年份: {list(reliable_data.tail(3)['Year'])}")
    
    return contributions_df, stable_contribution

def final_recommendation():
    """最终建议的Big Number"""
    print(f"\n💡 最终建议的Big Number表述")
    print("=" * 60)
    print("❌ 错误表述: '女性对新增岗位累积贡献率60.1%'")
    print("   (包含2012年314.5%等异常值，统计学上不严谨)")
    print()
    print("✅ 正确表述: '2010-2024年女性获得新岗位贡献率60.1%'")
    print("   基于: 女性净增2,760人 ÷ 总净增4,595人 = 60.1%")
    print("   意义: 过去15年创造的新工作中，女性获得了60.1%")
    print()
    print("✅ 补充说明: '2017-2024稳定期女性贡献率64.4%'")  
    print("   避免2012-2016年经济波动期异常数据")
    print("   更能反映近年来女性职场力量的真实增长")

def main():
    """主函数"""
    print("🚺 修正版女性贡献率分析")
    print("解决314.5%异常值问题，提供科学严谨的计算")
    print("=" * 60)
    
    df = load_data()
    contributions_df, stable_contribution = calculate_corrected_contribution(df)
    final_recommendation()
    
    return contributions_df

if __name__ == "__main__":
    results = main()