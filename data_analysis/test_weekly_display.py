#!/usr/bin/env python3
"""
测试周工时显示修改
验证新的显示格式是否符合用户要求
"""

import pandas as pd

def test_weekly_display():
    """测试周工时显示格式"""
    print("🕒 测试周工时显示格式修改")
    print("=" * 60)
    
    # 模拟数据
    latest_hours = 1686  # 2024年平均年工时
    highest_hours = 3000  # 最高行业年工时
    
    # 计算周工时
    weekly_hours = latest_hours / 52
    highest_weekly = highest_hours / 52
    
    print(f"📊 修改后的显示格式:")
    print(f"")
    print(f"🕒 平均工时水平")
    print(f"   {weekly_hours:.1f}小时/周")
    print(f"   2024年荷兰平均工时")
    print(f"   年工时: {latest_hours:.0f}小时")
    print(f"")
    print(f"🏆 工时最高行业")
    print(f"   {highest_weekly:.1f}小时/周")
    print(f"   03 Fishing and aquac...")
    print(f"   与最低行业相差2.0倍")
    
    print(f"\n✅ 修改完成:")
    print(f"   - 第一个数字: {weekly_hours:.1f}小时/周 (不显示变化)")
    print(f"   - 第二个数字: {highest_weekly:.1f}小时/周 (按周计算)")
    print(f"   - 移除了'+0小时'的变化显示")
    print(f"   - 专注于2024年当前数据")

if __name__ == "__main__":
    test_weekly_display()