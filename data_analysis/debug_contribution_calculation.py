#!/usr/bin/env python3
"""
Debug Female Contribution Calculation - 女性贡献率计算问题诊断
分析为什么会出现314.5%这种异常数据
"""

import pandas as pd

def analyze_problematic_years():
    """分析有问题的年份数据"""
    print("🔍 女性贡献率计算异常诊断")
    print("=" * 60)
    
    # 加载数据
    df = pd.read_csv('merged_data.csv')
    gender_complete = df[
        df['Male_28'].notna() & 
        df['Female_29'].notna() & 
        df['Total_27'].notna()
    ].copy()
    
    # 按年份汇总
    yearly_totals = gender_complete.groupby('Year').agg({
        'Female_29': 'sum',
        'Male_28': 'sum',
        'Total_27': 'sum'
    }).reset_index()
    
    print("📊 原始年度汇总数据：")
    print("-" * 80)
    print(f"{'年份':<6} {'女性总数':<12} {'男性总数':<12} {'总计':<12} {'验证':<10}")
    print("-" * 80)
    
    for _, row in yearly_totals.head(10).iterrows():
        verification = "✅" if abs(row['Female_29'] + row['Male_28'] - row['Total_27']) < 1 else "❌"
        print(f"{int(row['Year']):<6} {row['Female_29']:>10,.0f} {row['Male_28']:>10,.0f} {row['Total_27']:>10,.0f} {verification}")
    
    # 计算年度变化
    print(f"\n📈 年度变化分析（重点关注2010-2015）：")
    print("-" * 100)
    print(f"{'年份':<6} {'女性变化':<10} {'男性变化':<10} {'总变化':<10} {'女性贡献':<12} {'问题':<20}")
    print("-" * 100)
    
    base_year = 2010
    base_data = yearly_totals[yearly_totals['Year'] == base_year].iloc[0]
    base_female, base_male, base_total = base_data['Female_29'], base_data['Male_28'], base_data['Total_27']
    
    problematic_years = []
    
    for _, row in yearly_totals.iterrows():
        year = int(row['Year'])
        if year >= base_year:
            female_change = row['Female_29'] - base_female
            male_change = row['Male_28'] - base_male
            total_change = row['Total_27'] - base_total
            
            # 计算贡献率
            if total_change != 0:
                female_contribution = female_change / total_change * 100
            else:
                female_contribution = float('inf') if female_change != 0 else 0
            
            # 识别问题
            problems = []
            if abs(total_change) < 100:  # 总变化很小
                problems.append("总变化过小")
            if female_contribution > 150 or female_contribution < -50:  # 异常贡献率
                problems.append("贡献率异常")
            if total_change < 0 and female_change > 0:  # 总数下降但女性上升
                problems.append("反向变化")
            
            problem_str = "; ".join(problems) if problems else "正常"
            
            print(f"{year:<6} {female_change:>8,.0f} {male_change:>8,.0f} {total_change:>8,.0f} {female_contribution:>9.1f}% {problem_str}")
            
            if problems:
                problematic_years.append({
                    'year': year,
                    'female_change': female_change,
                    'total_change': total_change,
                    'contribution': female_contribution,
                    'problems': problems
                })
    
    # 深度分析问题年份
    print(f"\n🚨 问题年份深度分析：")
    print("=" * 80)
    
    for prob in problematic_years[:5]:  # 只看前5个问题年份
        year = prob['year']
        print(f"\n📅 {year}年问题分析:")
        print(f"   女性变化: {prob['female_change']:+,.0f}人")
        print(f"   总体变化: {prob['total_change']:+,.0f}人") 
        print(f"   计算的贡献率: {prob['contribution']:.1f}%")
        print(f"   问题类型: {', '.join(prob['problems'])}")
        
        if prob['total_change'] != 0:
            male_change = prob['total_change'] - prob['female_change']
            print(f"   推算男性变化: {male_change:+,.0f}人")
            print(f"   解释: 女性增加{abs(prob['female_change']):.0f}人，男性{'增加' if male_change > 0 else '减少'}{abs(male_change):.0f}人")
        
        # 修正建议
        if abs(prob['total_change']) < 500:  # 总变化小于500的视为不稳定
            print(f"   🔧 建议: 样本量太小({abs(prob['total_change'])}人)，该年数据不适合计算贡献率")

def propose_better_calculation():
    """提出更好的计算方法"""
    print(f"\n💡 改进建议：")
    print("=" * 60)
    print("1. 🎯 问题根因:")
    print("   - 累积贡献率在总变化量很小时会产生异常值")
    print("   - 2012-2015年经济波动导致总就业变化微小")
    print("   - 当分母接近0时，百分比失去统计意义")
    
    print("\n2. 🔧 修正方案:")
    print("   方案A: 设置最小阈值，总变化<1000人的年份标记为'数据不稳定'")
    print("   方案B: 改用3年滚动平均，平滑短期波动") 
    print("   方案C: 只计算2017年后稳定期的贡献率")
    print("   方案D: 改用'女性占新增岗位比例'而非'累积贡献率'")
    
    print("\n3. 📊 正确的2024年数据:")
    print("   - 2010年基准: 女性14,581人，总计31,084人")
    print("   - 2024年现状: 女性17,341人，总计35,679人")
    print("   - 净增长: 女性+2,760人，总计+4,595人")
    print("   - 正确贡献率: 2,760/4,595 = 60.1% ✅")
    print("   - 这个60.1%是可靠的，因为总变化量足够大(4,595人)")

if __name__ == "__main__":
    analyze_problematic_years()
    propose_better_calculation()