#!/bin/bash

# Simple Azure Free Tier Monitor
echo "🆓 Azure免费额度检查 - $(date)"
echo "=================================="

# 检查PostgreSQL使用情况
echo "📊 PostgreSQL使用情况:"
echo "状态: $(az postgres flexible-server show --name psql-dutch-salary --resource-group DutchSalaryToday-RG --query "state" -o tsv)"
echo "SKU: $(az postgres flexible-server show --name psql-dutch-salary --resource-group DutchSalaryToday-RG --query "sku.name" -o tsv)"
echo "存储: $(az postgres flexible-server show --name psql-dutch-salary --resource-group DutchSalaryToday-RG --query "storage.storageSizeGb" -o tsv)GB"

# 检查Container Registry
echo ""
echo "📦 Container Registry使用情况:"
echo "状态: $(az acr show --name acrdutchsalary16283450340 --query "provisioningState" -o tsv)"
echo "SKU: $(az acr show --name acrdutchsalary16283450340 --query "sku.name" -o tsv)"
echo "创建时间: $(az acr show --name acrdutchsalary16283450340 --query "creationDate" -o tsv)"

# 检查应用状态
echo ""
echo "💻 App Service状态:"
echo "前端: $(az webapp show --name frontend-webapp-16283450340 --resource-group DutchSalaryToday-RG --query "state" -o tsv)"
echo "后端: $(az webapp show --name backend-webapp-16283450340 --resource-group DutchSalaryToday-RG --query "state" -o tsv)"

echo ""
echo "✅ 检查完成!"