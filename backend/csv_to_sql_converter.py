#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CSV to SQL Converter for DutchSalaryToday Project
将CBS统计局的merged_data.csv转换为PostgreSQL INSERT语句

Author: DutchSalaryToday Team
Date: 2024
Purpose: Phase 2.2 - 数据转换处理，生成V2__Insert_salary_data.sql
"""

import csv
import os
import re
from decimal import Decimal, InvalidOperation
from typing import Optional, Union

def clean_value(value: str) -> Optional[Union[str, Decimal]]:
    """
    清洗CSV字段值，处理空值和数据类型转换
    
    Args:
        value: CSV中的原始字符串值
        
    Returns:
        清洗后的值：None(NULL)、字符串或Decimal数值
    """
    if not value or value.strip() == '':
        return None
    
    value = value.strip()
    
    # 处理数值字段
    try:
        # 尝试转换为数值
        decimal_value = Decimal(value)
        return decimal_value
    except (InvalidOperation, ValueError):
        # 非数值，返回字符串（处理引号转义）
        return value.replace("'", "''")

def extract_year_from_period(periods: str) -> Optional[int]:
    """
    从CBS时间格式提取年份
    例如: '1995JJ00' -> 1995, '2024JJ00' -> 2024
    
    Args:
        periods: CBS时间周期格式字符串
        
    Returns:
        提取的年份整数，如果失败返回None
    """
    if not periods:
        return None
    
    # 使用正则表达式提取前4位数字
    match = re.match(r'^(\d{4})', periods)
    if match:
        return int(match.group(1))
    
    return None

def generate_insert_statement(row_data: dict, row_number: int) -> str:
    """
    为单行数据生成INSERT SQL语句
    
    Args:
        row_data: 包含所有字段的字典
        row_number: 行号（用于调试）
        
    Returns:
        格式化的INSERT SQL语句
    """
    # 处理核心字段
    csv_id = clean_value(row_data.get('ID', ''))
    sector_code = clean_value(row_data.get('SectorBranchesSIC2008', ''))
    periods = clean_value(row_data.get('Periods', ''))
    title = clean_value(row_data.get('Title', ''))
    description = clean_value(row_data.get('Description', ''))
    category_group_id = clean_value(row_data.get('CategoryGroupID', ''))
    year_field = clean_value(row_data.get('Year', ''))
    
    # 提取年份（优先使用Year字段，后备使用Periods字段）
    year_period = None
    if year_field is not None:
        try:
            year_period = int(year_field)
        except (ValueError, TypeError):
            pass
    
    if year_period is None and periods:
        year_period = extract_year_from_period(str(periods))
    
    # 验证必需字段
    if not title or year_period is None:
        print(f"警告: 第{row_number}行缺少必需字段 (title: {title}, year: {year_period})")
        return ""
    
    # 处理薪酬数据字段
    compensation_fields = {
        'compensation_of_employees_1': clean_value(row_data.get('CompensationOfEmployees_1', '')),
        'wages_and_salaries_2': clean_value(row_data.get('WagesAndSalaries_2', '')),
        'employers_social_contributions_3': clean_value(row_data.get('EmployersSocialContributions_3', '')),
        'wage_costs_4': clean_value(row_data.get('WageCosts_4', '')),
        'compensation_of_employees_5': clean_value(row_data.get('CompensationOfEmployees_5', '')),
        'wages_and_salaries_6': clean_value(row_data.get('WagesAndSalaries_6', '')),
        'wage_costs_7': clean_value(row_data.get('WageCosts_7', '')),
        'compensation_per_fte_8': clean_value(row_data.get('CompensationPerFte_8', '')),
        'wages_per_fte_9': clean_value(row_data.get('WagesPerFte_9', '')),
        'wage_costs_per_fte_10': clean_value(row_data.get('WageCostsPerFte_10', '')),
        'compensation_per_fte_14': clean_value(row_data.get('CompensationPerFte_14', '')),
        'wages_per_fte_15': clean_value(row_data.get('WagesPerFte_15', '')),
        'wage_costs_per_fte_16': clean_value(row_data.get('WageCostsPerFte_16', '')),
        'compensation_per_hour_worked_11': clean_value(row_data.get('CompensationPerHourWorked_11', '')),
        'wages_per_hour_worked_12': clean_value(row_data.get('WagesPerHourWorked_12', '')),
        'wage_costs_per_hour_worked_13': clean_value(row_data.get('WageCostsPerHourWorked_13', '')),
        'compensation_per_hour_worked_17': clean_value(row_data.get('CompensationPerHourWorked_17', '')),
        'wages_per_hour_worked_18': clean_value(row_data.get('WagesPerHourWorked_18', '')),
        'wage_costs_per_hour_worked_19': clean_value(row_data.get('WageCostsPerHourWorked_19', '')),
    }
    
    # 处理就业数据字段
    employment_fields = {
        'full_time_equivalent_fte_20': clean_value(row_data.get('FullTimeEquivalentFte_20', '')),
        'hours_worked_21': clean_value(row_data.get('HoursWorked_21', '')),
        'hours_paid_22': clean_value(row_data.get('HoursPaid_22', '')),
        'hours_agreed_23': clean_value(row_data.get('HoursAgreed_23', '')),
        'paid_extra_hours_24': clean_value(row_data.get('PaidExtraHours_24', '')),
        'full_time_equivalent_fte_25': clean_value(row_data.get('FullTimeEquivalentFte_25', '')),
        'hours_worked_26': clean_value(row_data.get('HoursWorked_26', '')),
    }
    
    # 处理人口统计字段
    demographic_fields = {
        'total_27': clean_value(row_data.get('Total_27', '')),
        'total_30': clean_value(row_data.get('Total_30', '')),
        'total_33': clean_value(row_data.get('Total_33', '')),
        'total_36': clean_value(row_data.get('Total_36', '')),
        'male_28': clean_value(row_data.get('Male_28', '')),
        'female_29': clean_value(row_data.get('Female_29', '')),
        'male_31': clean_value(row_data.get('Male_31', '')),
        'female_32': clean_value(row_data.get('Female_32', '')),
        'male_34': clean_value(row_data.get('Male_34', '')),
        'female_35': clean_value(row_data.get('Female_35', '')),
    }
    
    # 构建VALUES子句
    def format_value(val):
        if val is None:
            return 'NULL'
        elif isinstance(val, (int, Decimal)):
            return str(val)
        else:
            return f"'{val}'"
    
    values = [
        format_value(csv_id),
        format_value(sector_code),
        format_value(periods),
        str(year_period),
        format_value(title),
        format_value(description),
        format_value(category_group_id),
    ]
    
    # 添加薪酬字段值
    for field_name in ['compensation_of_employees_1', 'wages_and_salaries_2', 'employers_social_contributions_3',
                       'wage_costs_4', 'compensation_of_employees_5', 'wages_and_salaries_6', 'wage_costs_7',
                       'compensation_per_fte_8', 'wages_per_fte_9', 'wage_costs_per_fte_10',
                       'compensation_per_fte_14', 'wages_per_fte_15', 'wage_costs_per_fte_16',
                       'compensation_per_hour_worked_11', 'wages_per_hour_worked_12', 'wage_costs_per_hour_worked_13',
                       'compensation_per_hour_worked_17', 'wages_per_hour_worked_18', 'wage_costs_per_hour_worked_19']:
        values.append(format_value(compensation_fields.get(field_name)))
    
    # 添加就业字段值
    for field_name in ['full_time_equivalent_fte_20', 'hours_worked_21', 'hours_paid_22', 'hours_agreed_23',
                       'paid_extra_hours_24', 'full_time_equivalent_fte_25', 'hours_worked_26']:
        values.append(format_value(employment_fields.get(field_name)))
    
    # 添加人口统计字段值
    for field_name in ['total_27', 'total_30', 'total_33', 'total_36', 'male_28', 'female_29',
                       'male_31', 'female_32', 'male_34', 'female_35']:
        values.append(format_value(demographic_fields.get(field_name)))
    
    # 生成INSERT语句
    insert_sql = f"INSERT INTO salary_records ("
    insert_sql += "csv_id, sector_code, periods, year_period, title, description, category_group_id, "
    insert_sql += "compensation_of_employees_1, wages_and_salaries_2, employers_social_contributions_3, wage_costs_4, "
    insert_sql += "compensation_of_employees_5, wages_and_salaries_6, wage_costs_7, "
    insert_sql += "compensation_per_fte_8, wages_per_fte_9, wage_costs_per_fte_10, "
    insert_sql += "compensation_per_fte_14, wages_per_fte_15, wage_costs_per_fte_16, "
    insert_sql += "compensation_per_hour_worked_11, wages_per_hour_worked_12, wage_costs_per_hour_worked_13, "
    insert_sql += "compensation_per_hour_worked_17, wages_per_hour_worked_18, wage_costs_per_hour_worked_19, "
    insert_sql += "full_time_equivalent_fte_20, hours_worked_21, hours_paid_22, hours_agreed_23, paid_extra_hours_24, "
    insert_sql += "full_time_equivalent_fte_25, hours_worked_26, "
    insert_sql += "total_27, total_30, total_33, total_36, male_28, female_29, male_31, female_32, male_34, female_35"
    insert_sql += ") VALUES ("
    insert_sql += ", ".join(values)
    insert_sql += ");"
    
    return insert_sql

def convert_csv_to_sql():
    """
    主转换函数：读取CSV文件并生成SQL插入语句
    """
    print("🚀 开始CSV到SQL转换处理...")
    
    # 文件路径
    csv_file_path = "/Users/sunyiyang/Desktop/DutchSalaryToday/data_analysis/merged_data.csv"
    sql_output_path = "/Users/sunyiyang/Desktop/DutchSalaryToday/backend/src/main/resources/db/migration/V2__Insert_salary_data.sql"
    
    # 检查CSV文件是否存在
    if not os.path.exists(csv_file_path):
        print(f"❌ 错误: CSV文件不存在: {csv_file_path}")
        return False
    
    successful_rows = 0
    error_rows = 0
    sql_statements = []
    
    try:
        with open(csv_file_path, 'r', encoding='utf-8') as csvfile:
            # 使用csv.DictReader自动处理CSV标题行
            reader = csv.DictReader(csvfile)
            
            print(f"📊 发现CSV字段: {len(reader.fieldnames)}个")
            print(f"📋 字段列表: {', '.join(reader.fieldnames[:10])}...")
            
            for row_number, row in enumerate(reader, start=2):  # 从第2行开始计数（第1行是标题）
                try:
                    insert_sql = generate_insert_statement(row, row_number)
                    if insert_sql:
                        sql_statements.append(insert_sql)
                        successful_rows += 1
                    else:
                        error_rows += 1
                        
                    # 每处理1000行显示进度
                    if row_number % 1000 == 0:
                        print(f"📈 已处理 {row_number-1} 行数据...")
                        
                except Exception as e:
                    print(f"❌ 第{row_number}行处理错误: {e}")
                    error_rows += 1
    
    except Exception as e:
        print(f"❌ 读取CSV文件错误: {e}")
        return False
    
    # 生成SQL文件
    try:
        with open(sql_output_path, 'w', encoding='utf-8') as sqlfile:
            # 写入文件头注释
            sqlfile.write("-- V2__Insert_salary_data.sql\n")
            sqlfile.write("-- 荷兰薪资数据批量插入脚本\n")
            sqlfile.write("-- 自动生成于: CSV转换脚本\n")
            sqlfile.write(f"-- 数据来源: merged_data.csv ({successful_rows}行)\n")
            sqlfile.write("-- 包含CBS统计局1995-2024年完整薪资数据\n\n")
            
            sqlfile.write("-- 开始事务确保数据完整性\n")
            sqlfile.write("BEGIN;\n\n")
            
            sqlfile.write("-- 批量插入薪资记录\n")
            for sql_statement in sql_statements:
                sqlfile.write(sql_statement + "\n")
            
            sqlfile.write("\n-- 提交事务\n")
            sqlfile.write("COMMIT;\n")
            
            sqlfile.write(f"\n-- 插入完成统计: {successful_rows}条记录成功插入\n")
    
    except Exception as e:
        print(f"❌ 写入SQL文件错误: {e}")
        return False
    
    # 输出处理结果
    print(f"\n✅ CSV转换完成!")
    print(f"📊 处理统计:")
    print(f"   - 成功转换: {successful_rows} 行")
    print(f"   - 错误行数: {error_rows} 行") 
    print(f"   - 成功率: {(successful_rows/(successful_rows+error_rows)*100):.1f}%")
    print(f"📁 SQL文件已生成: {sql_output_path}")
    
    return True

if __name__ == "__main__":
    success = convert_csv_to_sql()
    if success:
        print("\n🎉 数据转换处理成功完成！")
    else:
        print("\n💥 数据转换处理失败！")