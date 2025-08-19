#!/usr/bin/env python3
"""
Corrected Hourly Analysis - 修正版工时价值分析
重新设计Big Number 2的计算逻辑，基于正确的数据理解
"""

import pandas as pd

def analyze_corrected_hourly_trends():
    """修正版工时价值分析"""
    print("⏳ 修正版工时价值分析")
    print("=" * 60)
    print("重新设计基于正确数据理解的Big Number 2")
    print("=" * 60)
    
    # 加载数据
    df = pd.read_csv('merged_data.csv')
    
    # 检查关键字段
    key_fields = [
        'CompensationPerHourWorked_11',  # 时薪(欧元)
        'CompensationPerFte_8',          # 年薪(千欧元)  
        'HoursWorked_21',                # 总工时(百万小时)
        'FullTimeEquivalentFte_20'       # 全职等效人数(千人)
    ]
    
    print("📊 数据字段检查:")
    for field in key_fields:
        if field in df.columns:
            coverage = df[field].notna().sum() / len(df) * 100
            print(f"✅ {field}: {coverage:.1f}%覆盖率")
        else:
            print(f"❌ {field}: 字段缺失")
    
    # 筛选有完整数据的记录
    complete_data = df[df[key_fields].notna().all(axis=1)].copy()
    print(f"\n完整数据记录: {len(complete_data)}/{len(df)} ({len(complete_data)/len(df)*100:.1f}%)")
    
    return complete_data

def calculate_meaningful_comparisons(data):
    """计算有意义的对比指标"""
    print(f"\n💡 重新设计的有意义对比:")
    print("-" * 50)
    
    # 按年份汇总
    yearly_data = data.groupby('Year').agg({
        'CompensationPerHourWorked_11': 'mean',   # 平均时薪
        'CompensationPerFte_8': 'mean',           # 平均年薪
        'HoursWorked_21': 'sum',                  # 总工时
        'FullTimeEquivalentFte_20': 'sum'        # 总FTE
    }).reset_index()
    
    # 计算工作强度指标：总工时/FTE = 平均每人年工时
    yearly_data['Hours_Per_FTE'] = (yearly_data['HoursWorked_21'] * 1000 / yearly_data['FullTimeEquivalentFte_20']).round(0)
    
    print("📈 三种有意义的对比方案:")
    print("\n方案A: 时薪增长 vs 年薪增长")
    print("(反映单位时间价值提升 vs 整体收入提升)")
    
    print("\n方案B: 薪酬增长 vs 工时变化")  
    print("(反映效率提升：薪酬增长但工时不变或减少)")
    
    print("\n方案C: 时薪 vs 计算时薪对比")
    print("(年薪/工时 vs 直接时薪，检验数据一致性)")
    
    return yearly_data

def analyze_option_a_hourly_vs_annual(yearly_data):
    """方案A: 时薪增长 vs 年薪增长对比"""
    print(f"\n📊 方案A分析: 时薪增长 vs 年薪增长")
    print("-" * 50)
    
    # 计算2010-2024增长率
    base_year = 2010
    end_year = 2024
    
    base_data = yearly_data[yearly_data['Year'] == base_year]
    end_data = yearly_data[yearly_data['Year'] == end_year]
    
    if base_data.empty or end_data.empty:
        print("❌ 缺少基准年份数据")
        return
    
    base_hourly = base_data['CompensationPerHourWorked_11'].iloc[0]
    base_annual = base_data['CompensationPerFte_8'].iloc[0]
    end_hourly = end_data['CompensationPerHourWorked_11'].iloc[0]
    end_annual = end_data['CompensationPerFte_8'].iloc[0]
    
    hourly_growth = (end_hourly - base_hourly) / base_hourly * 100
    annual_growth = (end_annual - base_annual) / base_annual * 100
    
    print(f"时薪: €{base_hourly:.2f} → €{end_hourly:.2f} (+{hourly_growth:.1f}%)")
    print(f"年薪: €{base_annual:.1f}k → €{end_annual:.1f}k (+{annual_growth:.1f}%)")
    print(f"差异: 时薪增长 {'快于' if hourly_growth > annual_growth else '慢于'} 年薪增长 {abs(hourly_growth-annual_growth):.1f}个百分点")
    
    # 解读
    if hourly_growth > annual_growth:
        print("💡 解读: 单位时间价值提升超过整体薪酬，可能反映工作效率提升")
    else:
        print("💡 解读: 整体薪酬增长超过单位时间价值，可能反映工作时间增加")
    
    return {'hourly_growth': hourly_growth, 'annual_growth': annual_growth}

def analyze_option_b_efficiency(yearly_data):
    """方案B: 薪酬增长 vs 工时变化分析"""
    print(f"\n📊 方案B分析: 薪酬增长 vs 工时变化")
    print("-" * 50)
    
    base_year = 2010
    end_year = 2024
    
    base_data = yearly_data[yearly_data['Year'] == base_year]
    end_data = yearly_data[yearly_data['Year'] == end_year]
    
    if base_data.empty or end_data.empty:
        print("❌ 缺少基准年份数据")
        return
    
    # 计算变化
    base_hours_per_fte = base_data['Hours_Per_FTE'].iloc[0]
    end_hours_per_fte = end_data['Hours_Per_FTE'].iloc[0]
    base_hourly = base_data['CompensationPerHourWorked_11'].iloc[0]
    end_hourly = end_data['CompensationPerHourWorked_11'].iloc[0]
    
    hours_change = (end_hours_per_fte - base_hours_per_fte) / base_hours_per_fte * 100
    hourly_change = (end_hourly - base_hourly) / base_hourly * 100
    
    print(f"每FTE年工时: {base_hours_per_fte:.0f}h → {end_hours_per_fte:.0f}h ({hours_change:+.1f}%)")
    print(f"时薪价值: €{base_hourly:.2f} → €{end_hourly:.2f} ({hourly_change:+.1f}%)")
    
    # 效率指标
    efficiency_improvement = hourly_change - hours_change
    print(f"效率提升指标: {efficiency_improvement:+.1f}个百分点")
    
    if efficiency_improvement > 0:
        print("💡 解读: 时薪增长超过工时增长，体现真正的效率提升")
        story_hook = f"荷兰工作效率提升{efficiency_improvement:.1f}个百分点：时薪涨{hourly_change:.1f}%，工时仅增{hours_change:.1f}%"
    else:
        print("💡 解读: 工时增长超过时薪增长，可能存在效率下降")
        story_hook = f"荷兰面临效率挑战：工时增{abs(hours_change):.1f}%，但时薪仅涨{hourly_change:.1f}%"
    
    print(f"📰 故事钩子: \"{story_hook}\"")
    
    return {'efficiency_improvement': efficiency_improvement, 'story_hook': story_hook}

def analyze_option_c_data_consistency(yearly_data):
    """方案C: 数据一致性检验"""
    print(f"\n📊 方案C分析: 数据一致性检验")
    print("-" * 50)
    
    # 计算年薪/工时得到的理论时薪
    yearly_data['Calculated_Hourly'] = (yearly_data['CompensationPerFte_8'] * 1000 / yearly_data['Hours_Per_FTE']).round(2)
    
    print(f"{'年份':<6} {'直接时薪':<10} {'计算时薪':<10} {'差异':<10} {'一致性'}")
    print("-" * 50)
    
    for _, row in yearly_data.tail(5).iterrows():
        year = int(row['Year'])
        direct_hourly = row['CompensationPerHourWorked_11']
        calculated_hourly = row['Calculated_Hourly'] 
        difference = abs(direct_hourly - calculated_hourly)
        consistency = "✅" if difference < 2 else "❌"
        
        print(f"{year:<6} €{direct_hourly:>7.2f}  €{calculated_hourly:>7.2f}  €{difference:>6.2f}   {consistency}")
    
    return yearly_data

def recommend_best_approach():
    """推荐最佳分析方案"""
    print(f"\n🎯 Big Number 2 修正建议")
    print("=" * 50)
    print("❌ 错误方案: 时薪增长 vs 月薪增长 (线性关系，无意义)")
    print("✅ 推荐方案: 效率提升分析 (时薪增长 vs 工时变化)")
    print()
    print("📊 修正后的Big Number 2:")
    print("   标题: ⚡ 效率提升指标")  
    print("   数值: +X.X个百分点")
    print("   解释: 时薪增长超过工时增长的幅度")
    print("   意义: 真正的劳动生产率提升")
    print()
    print("🔧 技术实现:")
    print("   1. 计算时薪增长率")
    print("   2. 计算每FTE年工时变化率") 
    print("   3. 差值 = 时薪增长率 - 工时变化率")
    print("   4. 正值表示效率提升，负值表示效率下降")

def main():
    """主分析函数"""
    print("🔧 Big Number 2 修正版分析")
    
    # 加载数据
    data = analyze_corrected_hourly_trends()
    
    # 计算年度汇总
    yearly_data = calculate_meaningful_comparisons(data)
    
    # 三种分析方案
    option_a = analyze_option_a_hourly_vs_annual(yearly_data)
    option_b = analyze_option_b_efficiency(yearly_data) 
    option_c = analyze_option_c_data_consistency(yearly_data)
    
    # 推荐最佳方案
    recommend_best_approach()
    
    return yearly_data

if __name__ == "__main__":
    results = main()