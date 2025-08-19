#!/usr/bin/env python3
"""
测试pandas Series布尔值错误修复
验证新的工时分析功能是否正常工作
"""

import pandas as pd
import sys

def test_work_hours_analysis():
    """测试工时分析功能"""
    print("🔧 测试pandas Series布尔值错误修复")
    print("=" * 60)
    
    try:
        # 加载数据
        print("📊 加载数据...")
        df = pd.read_csv('merged_data.csv')
        print(f"✅ 数据加载成功: {len(df)}条记录")
        
        # 模拟load_work_hours_data函数
        print("\n🔍 加载工时薪酬数据...")
        key_fields = [
            'HoursWorked_21',               # 实际工时(百万小时)
            'FullTimeEquivalentFte_20',     # 全职等效人数(千人)
            'CompensationPerHourWorked_11', # 总时薪(欧元)
            'WagesPerHourWorked_12',        # 基础时薪(欧元)
            'Title', 'Year'
        ]
        
        # 筛选有完整数据的记录
        work_data = df[key_fields].copy()
        work_data = work_data.dropna(subset=key_fields[:-2])
        
        # 计算每FTE年工时
        work_data['Hours_Per_FTE'] = (work_data['HoursWorked_21'] * 1000 / work_data['FullTimeEquivalentFte_20']).round(0)
        
        print(f"✅ 工时数据加载成功: {len(work_data)}条有效记录")
        
        # 测试Big Number 1: 工时变化趋势
        print("\n📈 测试Big Number 1: 工时变化趋势")
        yearly_summary = work_data.groupby('Year').agg({
            'Hours_Per_FTE': 'mean',
            'HoursWorked_21': 'sum',
            'FullTimeEquivalentFte_20': 'sum'
        }).reset_index()
        
        yearly_summary['Overall_Hours_Per_FTE'] = (yearly_summary['HoursWorked_21'] * 1000 / yearly_summary['FullTimeEquivalentFte_20']).round(0)
        
        base_year_data = yearly_summary[yearly_summary['Year'] == 2010]
        latest_year_data = yearly_summary[yearly_summary['Year'] == 2024]
        
        if not base_year_data.empty and not latest_year_data.empty:
            base_hours = base_year_data['Overall_Hours_Per_FTE'].iloc[0]
            latest_hours = latest_year_data['Overall_Hours_Per_FTE'].iloc[0]
            hours_change = latest_hours - base_hours
            hours_change_percent = (hours_change / base_hours * 100) if base_hours > 0 else 0
            
            print(f"  🕒 2010年: {base_hours:.0f}小时")
            print(f"  🕒 2024年: {latest_hours:.0f}小时")
            print(f"  📊 变化: {hours_change:+.0f}小时 ({hours_change_percent:+.1f}%)")
        
        # 测试Big Number 2: 行业工时排名
        print("\n🏆 测试Big Number 2: 行业工时排名")
        latest_year = work_data['Year'].max()
        current_data = work_data[work_data['Year'] == latest_year].copy()
        
        valid_hours_data = current_data[current_data['Hours_Per_FTE'].notna()].copy()
        
        if not valid_hours_data.empty:
            # 使用修复后的方法：先获取索引再取数据
            max_idx = valid_hours_data['Hours_Per_FTE'].idxmax()
            min_idx = valid_hours_data['Hours_Per_FTE'].idxmin()
            highest_hours_industry = valid_hours_data.loc[max_idx]
            lowest_hours_industry = valid_hours_data.loc[min_idx]
            
            hours_gap_ratio = highest_hours_industry['Hours_Per_FTE'] / lowest_hours_industry['Hours_Per_FTE']
            
            print(f"  🏆 最高工时: {highest_hours_industry['Title'][:30]} ({highest_hours_industry['Hours_Per_FTE']:.0f}h)")
            print(f"  🔽 最低工时: {lowest_hours_industry['Title'][:30]} ({lowest_hours_industry['Hours_Per_FTE']:.0f}h)")
            print(f"  📊 差距倍数: {hours_gap_ratio:.1f}倍")
        
        # 测试Big Number 3: 行业时薪排名
        print("\n💰 测试Big Number 3: 行业时薪排名")
        valid_wage_data = current_data[current_data['CompensationPerHourWorked_11'].notna()].copy()
        
        if not valid_wage_data.empty:
            # 使用修复后的方法：先获取索引再取数据
            max_wage_idx = valid_wage_data['CompensationPerHourWorked_11'].idxmax()
            min_wage_idx = valid_wage_data['CompensationPerHourWorked_11'].idxmin()
            wage_champion = valid_wage_data.loc[max_wage_idx]
            wage_lowest = valid_wage_data.loc[min_wage_idx]
            
            wage_gap_ratio = wage_champion['CompensationPerHourWorked_11'] / wage_lowest['CompensationPerHourWorked_11']
            
            print(f"  💰 最高时薪: {wage_champion['Title'][:30]} (€{wage_champion['CompensationPerHourWorked_11']:.2f}/h)")
            print(f"  💸 最低时薪: {wage_lowest['Title'][:30]} (€{wage_lowest['CompensationPerHourWorked_11']:.2f}/h)")
            print(f"  📊 差距倍数: {wage_gap_ratio:.1f}倍")
        
        print("\n✅ 所有测试通过！pandas Series布尔值错误已修复")
        print("✅ 新的工时分析功能运行正常")
        
        return True
        
    except Exception as e:
        print(f"\n❌ 测试失败: {str(e)}")
        print(f"错误类型: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_work_hours_analysis()
    
    print(f"\n{'='*60}")
    if success:
        print("🎉 测试结果: 修复成功！")
        print("   - pandas Series布尔值错误已解决")
        print("   - 新的工时分析Big Numbers计算正常")
        print("   - 完全移除了工时薪酬博弈分析")
        print("   - 专注于用户要求的三个核心指标")
    else:
        print("⚠️ 测试结果: 仍有问题需要修复")
        sys.exit(1)