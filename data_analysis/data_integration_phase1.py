#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
荷兰薪酬数据整合 - 第一阶段
Data Integration Phase 1 for Dutch Salary Analysis

功能：读取JSON文件并合并数据，生成交叉表分析所需的完整数据集
Purpose: Read JSON files and merge data to generate complete dataset for cross-tabulation analysis
"""

import pandas as pd
import json
from pathlib import Path
import warnings

warnings.filterwarnings("ignore")

# 设置数据路径
DATA_PATH = Path("/Users/sunyiyang/Desktop/DutchSalaryToday/data_acquisition/raw_data")


def load_essential_json_files():
    """读取交叉表分析所需的核心JSON文件"""
    print("📂 正在读取核心JSON文件...")

    # 只读取交叉表分析必需的文件
    essential_files = {
        "typed_data": "TypedDataSet.json",  # 主数据：薪酬指标
        "sectors": "SectorBranchesSIC2008.json",  # 行业分类：行业名称
    }

    data_dict = {}

    for key, filename in essential_files.items():
        file_path = DATA_PATH / filename
        if file_path.exists():
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    data_dict[key] = pd.json_normalize(data)
                    print(f"✅ 成功读取: {filename} ({len(data_dict[key])}行)")
            except Exception as e:
                print(f"❌ 读取失败: {filename} - {str(e)}")
        else:
            print(f"⚠️ 文件不存在: {filename}")

    return data_dict


def merge_typed_data_with_sectors(data_dict):
    """合并TypedDataSet与行业分类信息"""
    print("\n🔗 正在合并TypedDataSet与行业分类信息...")

    if "typed_data" not in data_dict or "sectors" not in data_dict:
        print("❌ 缺少必要的数据文件")
        return None

    typed_df = data_dict["typed_data"]
    sectors_df = data_dict["sectors"]

    # 显示数据基本信息
    print(f"TypedDataSet形状: {typed_df.shape}")
    print(f"SectorBranches形状: {sectors_df.shape}")

    # 合并数据 - 使用正确的键名
    merge_key_typed = "SectorBranchesSIC2008"  # TypedDataSet中的键
    merge_key_sectors = "Key"  # SectorBranchesSIC2008中的键

    if merge_key_typed in typed_df.columns and merge_key_sectors in sectors_df.columns:
        # 重命名sectors_df的键以便合并
        sectors_renamed = sectors_df.rename(
            columns={merge_key_sectors: merge_key_typed}
        )
        merged_df = pd.merge(typed_df, sectors_renamed, on=merge_key_typed, how="left")

        # 添加年份列（从Periods列提取，如"1995JJ00" -> 1995）
        merged_df["Year"] = merged_df["Periods"].str[:4].astype(int)

        print(f"✅ 合并完成，结果形状: {merged_df.shape}")
        print(f"📅 年份范围: {merged_df['Year'].min()}-{merged_df['Year'].max()}")
        print(f"🏭 行业数量: {merged_df['Title'].nunique()}个")

        return merged_df
    else:
        print("❌ 合并键不匹配:")
        print(f"TypedDataSet键: {list(typed_df.columns)}")
        print(f"SectorBranches键: {list(sectors_df.columns)}")
        return None


def main():
    """主函数"""
    print("🚀 开始数据整合第一阶段（交叉表分析专用）...")

    # 1. 读取核心JSON文件
    data_dict = load_essential_json_files()

    # 2. 合并TypedDataSet与行业分类信息
    merged_df = merge_typed_data_with_sectors(data_dict)

    if merged_df is not None:
        # 保存完整数据（交叉表分析的唯一数据源）
        output_path = Path(
            "/Users/sunyiyang/Desktop/DutchSalaryToday/data_analysis/merged_data.csv"
        )
        merged_df.to_csv(output_path, index=False)

        print(f"\n✅ 第一阶段完成！")
        print(f"📄 输出文件: {output_path}")
        print(f"📊 数据概要: {merged_df.shape[0]:,}行 × {merged_df.shape[1]}列")
        print(f"🎯 用途: 为Streamlit交叉表应用提供数据源")

        return merged_df
    else:
        print("\n❌ 第一阶段失败")
        return None


if __name__ == "__main__":
    merged_df = main()
