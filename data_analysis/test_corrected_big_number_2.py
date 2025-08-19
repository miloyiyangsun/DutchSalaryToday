#!/usr/bin/env python3
"""
Test Corrected Big Number 2 - 测试修正后的Big Number 2
验证效率提升指标计算是否正确
"""

import pandas as pd

def test_corrected_big_number_2():
    """测试修正后的Big Number 2计算"""
    print("⚡ 测试修正后的Big Number 2: 效率革命指标")
    print("=" * 60)
    
    # 加载数据
    df = pd.read_csv('merged_data.csv')
    
    # 模拟interactive_crosstab_app.py中的数据加载逻辑
    key_fields = [
        'EmployersSocialContributions_3',    
        'CompensationOfEmployees_1',         
        'CompensationPerHourWorked_11',      
        'WagesAndSalaries_2',                
        'HoursWorked_21',                    
        'FullTimeEquivalentFte_20',          # 全职等效人数
        'Title', 'Year'
    ]
    
    # 筛选有完整数据的记录
    cost_data = df[key_fields].copy()
    cost_data = cost_data.dropna(subset=key_fields[:-2])
    
    print(f"✅ 数据加载成功: {len(cost_data)}条记录")
    
    # 计算年度汇总数据 - 精确复制app中的逻辑
    agg_dict = {
        'CompensationPerHourWorked_11': 'mean',    # 平均时薪
        'HoursWorked_21': 'sum',                   # 总工时
    }
    
    if 'FullTimeEquivalentFte_20' in cost_data.columns:
        agg_dict['FullTimeEquivalentFte_20'] = 'sum'
    
    yearly_efficiency = cost_data.groupby('Year').agg(agg_dict).reset_index()
    
    # 计算效率指标
    if 'FullTimeEquivalentFte_20' in cost_data.columns:
        # 计算每FTE工时变化
        yearly_efficiency['Hours_Per_FTE'] = yearly_efficiency['HoursWorked_21'] * 1000 / yearly_efficiency['FullTimeEquivalentFte_20']
        hours_per_fte_2010 = yearly_efficiency[yearly_efficiency['Year'] == 2010]['Hours_Per_FTE'].iloc[0] if not yearly_efficiency[yearly_efficiency['Year'] == 2010].empty else 0
        hours_per_fte_2024 = yearly_efficiency[yearly_efficiency['Year'] == 2024]['Hours_Per_FTE'].iloc[0] if not yearly_efficiency[yearly_efficiency['Year'] == 2024].empty else 0
        hours_change = ((hours_per_fte_2024 - hours_per_fte_2010) / hours_per_fte_2010 * 100) if hours_per_fte_2010 > 0 else 0
        
        print(f"📊 使用FTE方法计算:")
        print(f"   2010年每FTE工时: {hours_per_fte_2010:.0f}小时")
        print(f"   2024年每FTE工时: {hours_per_fte_2024:.0f}小时")
        print(f"   工时变化率: {hours_change:+.1f}%")
    else:
        # 备用方案：总工时变化
        hours_2010 = yearly_efficiency[yearly_efficiency['Year'] == 2010]['HoursWorked_21'].iloc[0] if not yearly_efficiency[yearly_efficiency['Year'] == 2010].empty else 0
        hours_2024 = yearly_efficiency[yearly_efficiency['Year'] == 2024]['HoursWorked_21'].iloc[0] if not yearly_efficiency[yearly_efficiency['Year'] == 2024].empty else 0
        hours_change = ((hours_2024 - hours_2010) / hours_2010 * 100) if hours_2010 > 0 else 0
        
        print(f"📊 使用总工时方法计算:")
        print(f"   2010年总工时: {hours_2010:,.0f}百万小时")
        print(f"   2024年总工时: {hours_2024:,.0f}百万小时")
        print(f"   工时变化率: {hours_change:+.1f}%")
    
    # 计算时薪增长率
    hourly_2010 = yearly_efficiency[yearly_efficiency['Year'] == 2010]['CompensationPerHourWorked_11'].iloc[0] if not yearly_efficiency[yearly_efficiency['Year'] == 2010].empty else 0
    hourly_2024 = yearly_efficiency[yearly_efficiency['Year'] == 2024]['CompensationPerHourWorked_11'].iloc[0] if not yearly_efficiency[yearly_efficiency['Year'] == 2024].empty else 0
    hourly_growth = ((hourly_2024 - hourly_2010) / hourly_2010 * 100) if hourly_2010 > 0 else 0
    
    # 效率提升指标
    efficiency_improvement = hourly_growth - hours_change
    
    print(f"\n⚡ Big Number 2 计算结果:")
    print(f"   时薪: €{hourly_2010:.2f} → €{hourly_2024:.2f} (+{hourly_growth:.1f}%)")
    print(f"   工时变化: {hours_change:+.1f}%")
    print(f"   效率革命指标: +{efficiency_improvement:.1f}个百分点")
    
    # 解读
    if efficiency_improvement > 40:
        interpretation = "🚀 效率革命成功！单位时间价值大幅提升"
    elif efficiency_improvement > 20:
        interpretation = "📈 显著效率提升，劳动生产率优化明显"
    elif efficiency_improvement > 0:
        interpretation = "✅ 温和效率改善，总体趋势向好"
    else:
        interpretation = "⚠️ 效率挑战，需要关注生产率提升"
    
    print(f"   解读: {interpretation}")
    
    # 生成故事钩子
    if abs(hours_change) < 1:  # 工时变化很小
        story_hook = f"荷兰效率革命：15年时薪涨{hourly_growth:.1f}%，工时几乎不变！"
    else:
        story_hook = f"荷兰效率革命：时薪增长{hourly_growth:.1f}%，超过工时增长{efficiency_improvement:.1f}个百分点！"
    
    print(f"   故事钩子: \"{story_hook}\"")
    
    return {
        'hourly_growth': hourly_growth,
        'hours_change': hours_change,
        'efficiency_gain': efficiency_improvement,
        'story_hook': story_hook
    }

if __name__ == "__main__":
    results = test_corrected_big_number_2()
    print(f"\n✅ Big Number 2修正版测试完成！")
    print(f"效率革命指标: +{results['efficiency_gain']:.1f}个百分点")