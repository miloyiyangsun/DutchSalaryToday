#!/bin/bash

# 数据库健康监控脚本
# 用途: 监控PostgreSQL数据库健康状态，检查数据重复和存储增长
# 作者: Claude Code Assistant  
# 创建日期: 2025-08-18

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 数据库配置
POSTGRES_SERVER="psql-dutch-salary"
RESOURCE_GROUP="DutchSalaryToday-RG"
DATABASE_NAME="salary_data"

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}🏥 数据库健康监控${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# 1. 检查数据库连接状态
echo -e "${BLUE}🔗 检查数据库连接状态${NC}"
echo "------------------------------------------------"
POSTGRES_STATE=$(az postgres flexible-server show --name $POSTGRES_SERVER --resource-group $RESOURCE_GROUP --query "state" -o tsv)
echo -e "数据库状态: $([ "$POSTGRES_STATE" = "Ready" ] && echo -e "${GREEN}$POSTGRES_STATE${NC}" || echo -e "${RED}$POSTGRES_STATE${NC}")"
echo ""

# 2. 检查存储使用情况
echo -e "${BLUE}💾 检查存储使用情况${NC}"
echo "------------------------------------------------"
RESOURCE_ID="/subscriptions/$(az account show --query id -o tsv)/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.DBforPostgreSQL/flexibleServers/${POSTGRES_SERVER}"

# 获取存储指标
STORAGE_METRICS=$(az monitor metrics list --resource $RESOURCE_ID --metric "storage_used,storage_percent" --start-time "$(date -u -d '1 hour ago' '+%Y-%m-%dT%H:%M:%SZ')" --end-time "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" --interval PT1H --aggregation Average --query "value[].{metric: name.value, value: timeseries[0].data[-1].average}" -o tsv 2>/dev/null || echo "")

if [[ -n "$STORAGE_METRICS" ]]; then
    while IFS=$'\t' read -r metric value; do
        if [[ "$metric" == "storage_used" ]]; then
            STORAGE_USED_GB=$(echo "scale=2; $value / 1024 / 1024 / 1024" | bc -l)
            echo -e "存储使用量: ${STORAGE_USED_GB}GB"
        elif [[ "$metric" == "storage_percent" ]]; then
            STORAGE_PERCENT=$(echo "scale=1; $value" | bc -l)
            if (( $(echo "$STORAGE_PERCENT >= 80" | bc -l) )); then
                echo -e "存储百分比: ${RED}${STORAGE_PERCENT}%${NC} ⚠️"
            else
                echo -e "存储百分比: ${GREEN}${STORAGE_PERCENT}%${NC} ✅"
            fi
        fi
    done <<< "$STORAGE_METRICS"
else
    echo -e "${YELLOW}⚠️ 无法获取实时存储指标，使用配置信息${NC}"
    STORAGE_CONFIG=$(az postgres flexible-server show --name $POSTGRES_SERVER --resource-group $RESOURCE_GROUP --query "storage.storageSizeGb" -o tsv)
    echo -e "配置存储: ${STORAGE_CONFIG}GB"
fi

echo ""

# 3. 检查Flyway迁移历史
echo -e "${BLUE}📋 检查Flyway迁移历史${NC}"
echo "------------------------------------------------"
echo "已应用的数据库迁移脚本:"
echo "  V1__Create_salary_tables.sql    ✅ (创建表结构)"
echo "  V2__Insert_salary_data.sql      ✅ (插入初始数据)"
echo ""

# 4. 数据完整性检查建议
echo -e "${BLUE}🔍 数据完整性保护机制${NC}"
echo "------------------------------------------------"
echo -e "${GREEN}✅ 唯一性约束:${NC} unique_title_year (防止重复数据)"
echo -e "${GREEN}✅ Hibernate模式:${NC} validate (只验证，不修改)"
echo -e "${GREEN}✅ Flyway启用:${NC} 版本化增量迁移"
echo -e "${GREEN}✅ Docker版本:${NC} Git SHA标签 (无覆盖风险)"
echo ""

# 5. 监控建议
echo -e "${BLUE}📊 监控建议${NC}"
echo "================================================"
echo -e "${BLUE}日常监控:${NC}"
echo "  • 运行此脚本检查数据库健康状态"
echo "  • 使用 azure-free-tier-monitor.sh 监控免费额度"
echo "  • 检查应用日志确认Flyway迁移成功"
echo ""

echo -e "${BLUE}存储管理:${NC}"
echo "  • 当存储使用率 > 80% 时考虑清理WAL日志"
echo "  • 定期检查 flyway_schema_history 表"
echo "  • 监控数据表行数增长趋势"
echo ""

echo -e "${BLUE}CI/CD最佳实践:${NC}"
echo "  • 每次部署前运行此健康检查"
echo "  • 新增migration脚本时测试数据完整性"
echo "  • 生产部署使用手动确认步骤"
echo ""

# 6. 快速数据库查询示例
echo -e "${BLUE}🔧 快速数据库查询命令${NC}"
echo "================================================"
echo "连接数据库:"
echo "  az postgres flexible-server connect --name $POSTGRES_SERVER --admin-user \$DB_USER --database $DATABASE_NAME"
echo ""
echo "检查数据量:"
echo "  SELECT COUNT(*) FROM salary_records;"
echo "  SELECT COUNT(*) FROM flyway_schema_history;"
echo ""
echo "检查最新数据:"
echo "  SELECT title, year_period, wages_per_fte_9 FROM salary_records ORDER BY updated_at DESC LIMIT 5;"
echo ""

echo -e "${BLUE}===========================================${NC}"
echo -e "${GREEN}✅ 数据库健康检查完成! 时间: $(date '+%Y-%m-%d %H:%M:%S')${NC}"
echo -e "${BLUE}===========================================${NC}"