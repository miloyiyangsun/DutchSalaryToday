# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🏗️ Project Overview

DutchSalaryToday is a data storytelling platform for Dutch salary insights, built with a modern cloud-native stack:

- **Frontend**: React 19 + TypeScript + Vite + Recharts for data visualization
- **Backend**: Spring Boot 3.5.3 + Java 17 + JPA + PostgreSQL  
- **Deployment**: Azure cloud services with Docker containers and GitHub Actions CI/CD
- **Data Source**: Netherlands Statistics Bureau (CBS) OData API data (2010-2024)

## 🚀 Quick Commands Reference

### Essential Development Commands
```bash
# 🐳 Start complete development environment
docker-compose up --build

# 🔄 Restart specific services
docker-compose restart backend
docker-compose restart frontend

# 🧹 Clean restart (remove volumes)
docker-compose down -v && docker-compose up --build
```

## Development Environment

### Quick Start
```bash
# Start all services locally
docker-compose up --build

# Frontend: http://localhost:3000
# Backend: http://localhost:8080
# Database: localhost:5432
```

### Service Structure
- **frontend/**: React app with TypeScript, built with Vite
- **backend/**: Spring Boot REST API with PostgreSQL integration  
- **data_acquisition/**: Python scripts for CBS data collection
- **data_analysis/**: Jupyter notebooks for data processing and story validation
- **deploy/**: Azure Bicep templates for infrastructure as code

## 🏗️ Detailed File Architecture & Data Flow

### Backend Architecture (Spring Boot + PostgreSQL)
```
backend/src/main/java/com/dutchsalarytoday/dutch_salary_today/
├── DutchSalaryTodayApplication.java           # 🚀 Spring Boot启动类
├── entity/                                    # 📊 JPA实体层
│   └── SalaryRecord.java                      # 薪资记录实体(wages_per_fte_9字段)
├── repository/                                # 🗄️ 数据访问层
│   └── SalaryRecordRepository.java            # JPA Repository(2010-2024年查询)
├── service/                                   # 🧠 业务逻辑层
│   └── SalaryService.java                     # 三个核心算法实现
└── controller/                                # 🌐 REST API控制层
    └── SalaryController.java                  # 3个端点+CORS配置

backend/src/main/resources/
├── application.properties                     # 数据库连接配置
└── db/migration/                              # Flyway数据迁移
    ├── V1__Create_salary_tables.sql           # 表结构定义
    └── V2__Insert_salary_data.sql             # 3000+条数据导入
```

### Frontend Architecture (React 19 + TypeScript)
```
frontend/src/
├── main.tsx                                   # 🚀 应用入口+Axios配置
├── App.tsx                                    # 🛣️ 路由容器(BrowserRouter)
├── types/                                     # 📝 类型定义层
│   ├── routes.ts                              # 路由常量(5个Sprint路径)
│   └── salary.ts                              # API接口类型(前后端契约)
├── services/                                  # 🔌 API服务层
│   └── api.ts                                 # 3个API函数+数据格式转换
├── hooks/                                     # 🎣 业务逻辑层(Custom Hooks)
│   ├── index.ts                               # Hook统一导出
│   ├── useStoryData.ts                        # 核心洞察数据管理
│   ├── useGrowthRankings.ts                   # 排名+行业选择状态
│   └── useGapTrends.ts                        # 趋势+图表交互
├── pages/                                     # 📄 页面组件层
│   ├── HomePage.tsx                           # 首页(3个洞察卡片)
│   └── stories/IceAndFirePage.tsx             # 故事页(双图表+交互)
└── components/                                # 🧩 通用组件层
    └── InsightCard.tsx                        # 可复用卡片(3种类型)
```

### Data Processing Pipeline (Python Analytics)
```
data_analysis/
├── interactive_crosstab_app.py                # 🎯 核心业务逻辑参考
│   ├── get_growth_champion_data()             # 增长冠军算法(Line 114-157)
│   ├── calculate_salary_gap_ratio_average()   # 薪资差距计算(Line 160-184)
│   └── calculate_yearly_gap_ratios()          # 年度趋势分析(Line 347-376)
├── Sprint1_Data_Cleaning.ipynb               # 数据探索验证
├── merged_data.csv                           # 原始数据源(6541行)
└── data_integration_phase1.py                # 数据合并清洗

data_acquisition/raw_data/
├── DataProperties.json                       # CBS字段映射字典
└── [CBS API响应文件]                         # 原始CBS数据
```

### Frontend Commands (React/TypeScript)
```bash
cd frontend
npm install        # 📦 Install dependencies
npm run dev        # 🚀 Development server (localhost:3000)
npm run build      # 🏗️ Production build
npm run lint       # 🔍 ESLint code quality check
npm run preview    # 👀 Preview production build
```

### Backend Commands (Spring Boot)
```bash
cd backend
./mvnw compile     # ⚙️ Compile Java sources only
./mvnw test        # 🧪 Run all unit tests
./mvnw spring-boot:run  # 🚀 Start development server (localhost:8080)
./mvnw package     # 📦 Build executable JAR
```

### Data Analysis Commands
```bash
cd data_analysis
python temp_profiling_script.py  # 📊 Data profiling analysis
jupyter notebook Sprint1_Data_Cleaning.ipynb  # 🔬 Exploratory data analysis
```

## 🔧 Code Quality & Testing Guidelines

### Always Run After Code Changes
```bash
# Frontend quality checks
cd frontend && npm run lint && npm run build

# Backend quality checks  
cd backend && ./mvnw test && ./mvnw compile
```

### TypeScript Best Practices
- **Strict mode enabled**: Zero `any` types allowed
- **Null safety**: All nullable types explicitly marked with `| null`
- **Interface-driven**: API contracts defined in `/types` folder
- **Custom Hooks pattern**: Business logic extracted to hooks, UI components pure

### Spring Boot Patterns
- **Repository Pattern**: Data access through JPA repositories
- **Service Layer**: Business logic in dedicated service classes
- **REST Controllers**: Thin controllers, logic in services
- **Response Format**: Consistent `{success: boolean, data: T}` structure

## Architecture Patterns

### Vertical Slices
Each story (e.g., "Industry Ice and Fire") is developed as an end-to-end vertical slice rather than technical layers. This includes:
- Data analysis in Jupyter notebook
- Database schema updates
- REST API endpoints
- React components and charts
- Deployment configuration

### Evolutionary Design
- **YAGNI Principle**: Only implement features needed for current story
- **Rule of Three**: Refactor after third occurrence of pattern
- **Continuous Deployment**: Each sprint delivers incremental value to production

### Risk Mitigation
- Database connection pooling with HikariCP
- Spring Retry for transient failures
- Axios timeouts on frontend
- Azure Key Vault for secrets management
- CDN for static assets

## 📅 Sprint Structure & Current Status

### Current Progress: Sprint 1 ✅ COMPLETED 
**"Industry Ice and Fire" Story - Full Stack Implementation**

**Completed Phases:**
- ✅ **Sprint-1**: Data exploration & cleaning
- ✅ **Sprint 0**: Infrastructure setup (Docker + PostgreSQL + Spring Boot + React)  
- ✅ **Sprint 1**: Complete full-stack story implementation
  - ✅ Backend: Spring Boot REST API (3 endpoints)
  - ✅ Frontend: React hooks + TypeScript + Recharts
  - ✅ Data Integration: Backend-frontend data consistency fixed
  - ✅ Production Architecture: Environment config + error handling

**Upcoming Sprints:**
- 📋 **Sprint 2**: "Gender Power" story
- 📋 **Sprint 3**: "Hidden Costs" story  
- 📋 **Sprint 4**: "Work Revolution" story
- 📋 **Sprint 5**: "Efficiency Mystery" story
- 📋 **Sprint 6**: Data explorer feature + v1.0 release

## 🎯 Development Workflow Guidelines

### Branch Strategy
- **main**: Production-ready code only
- **sprint1**: Current working branch ✅
- **feature/story-name**: Individual story development

### Commit Standards
```bash
# Use descriptive commit messages with Chinese + English
git commit -m "完成Spring Boot后端架构与前后端数据一致性修复

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Quality Gates
1. **Code Changes**: Always run lint + build + tests
2. **API Changes**: Update TypeScript interfaces first
3. **Database Changes**: Use Flyway migrations
4. **Frontend Changes**: Verify API integration works

## 🔄 Data Flow Architecture & API Integration

### Complete Data Flow Chain
```
CSV数据源 → Python分析 → PostgreSQL → Spring Boot → React前端
[merged_data.csv] → [interactive_crosstab_app.py] → [salary_records表] → [3个API端点] → [Custom Hooks] → [UI组件]
```

### API Response Format Transformation (CRITICAL)
```json
// 🔙 Backend Response Format (Spring Boot)
{
  "success": true,
  "data": {
    "growthChampion": {"industry": "Information Technology", "growthRate": 45.2},
    "growthSlowest": {"industry": "Agriculture", "growthRate": 8.1}
  }
}

// 🔄 Frontend Transformation (services/api.ts)
{
  "growthChampion": {"industry": "Information Technology", "rate": "45.2%"},
  "growthSlowest": {"industry": "Agriculture", "rate": "8.1%"}
}

// 🎯 Frontend Hook Consumption (useStoryData.ts)
const { data, loading, error } = useStoryData();
// data.growthChampion.rate === "45.2%" ✅
```

### Database Schema & Business Logic Mapping
```sql
-- SalaryRecord Entity Mapping
CREATE TABLE salary_records (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,           -- 行业名称
    year_period INTEGER NOT NULL,          -- 年份(2010-2024)
    wages_per_fte_9 DECIMAL(10,2),         -- 薪资字段(千欧元) ⭐ CRITICAL
    UNIQUE(title, year_period)
);

-- 业务逻辑算法参考: data_analysis/interactive_crosstab_app.py
-- Growth Rate = (end_salary - start_salary) / start_salary * 100
-- Gap Ratio = max_avg_salary / min_avg_salary (2010-2024年平均)
```

### Critical Data Points & Business Rules
- **时间范围**: 2010-2024年 (15年数据，不是1995-2024年)
- **薪资字段**: `wages_per_fte_9` (工资和薪金，用户实际收入) ⭐
- **有效行业**: 必须在2010和2024年都有完整数据的行业
- **薪资差距趋势**: 3.15x → 2.90x (DECREASING trend, 数据来源验证)
- **增长冠军**: Information and Technology (45.2% growth)
- **API端点**: 3个核心端点提供前端完整数据

## 🚨 Important Project Rules

### NEVER Hardcode Data
- ❌ `salaryGap: { from: "3.15x", to: "3.21x" }` (hardcoded)
- ✅ Dynamic API calls with `Promise.all()` for real-time data

### Always Verify Data Consistency  
- Backend calculations must match frontend display
- Use parallel API calls to reduce loading time
- Error handling at service, hook, and component levels

### Environment Configuration
```bash
# Frontend .env
VITE_API_BASE_URL=http://localhost:8080

# Backend application.yml
server.port: 8080
spring.datasource.url: jdbc:postgresql://localhost:5432/dutch_salary_db
```

## 🎯 Claude Code Working Instructions

### Core Development Philosophy
- **Do what has been asked; nothing more, nothing less**
- **NEVER create files** unless absolutely necessary for achieving the goal
- **ALWAYS prefer editing** an existing file to creating a new one
- **NEVER proactively create documentation files** (*.md) or README files unless explicitly requested

### Quality Assurance Process
1. **Read First**: Always use Read tool before editing any file
2. **Lint & Build**: Run quality checks after every code change
3. **TypeScript Strict**: Zero tolerance for `any` types
4. **Test Coverage**: Verify functionality works end-to-end

### Git Workflow
- **Commit Standard**: Chinese + English descriptive messages
- **Co-authoring**: Include Claude Code attribution in commits
- **Branch Strategy**: Use sprint branches for feature development
- **Quality Gates**: Lint + build + test before commit

### Development Priorities
1. **Data Consistency**: Frontend must match backend calculations
2. **Performance**: Use parallel API calls (`Promise.all()`)
3. **Error Handling**: Service → Hook → Component error propagation
4. **Type Safety**: Interface-driven development with TypeScript

### Debugging Approach
- **API Issues**: Check response format transformation in `/services/api.ts`
- **State Issues**: Verify Custom Hook state management in `/hooks/`
- **Build Issues**: Check TypeScript strict mode compliance
- **Data Issues**: Compare backend calculations with frontend display

## 🔗 File Interdependencies & Call Chain

### Backend Call Chain (4层架构)
```
1. SalaryController.java (REST层)
   ├── @GetMapping("/api/v1/core-insights")
   ├── @GetMapping("/api/v1/growth-rankings") 
   └── @GetMapping("/api/v1/salary-gap-trends")
   ↓
2. SalaryService.java (业务层)
   ├── getCoreInsights() → 3个核心算法
   ├── getGrowthRankings() → 排名计算+排序
   └── getSalaryGapTrends() → 年度趋势分析
   ↓
3. SalaryRecordRepository.java (数据层) 
   ├── findByYearPeriodBetween(2010, 2024)
   ├── findByYearPeriod(year)
   └── findAll() [JPA自带方法]
   ↓
4. SalaryRecord.java (实体层)
   └── @Entity映射salary_records表
```

### Frontend Call Chain (Hook→Service→Component)
```
1. pages/HomePage.tsx & IceAndFirePage.tsx
   ├── useStoryData() hook调用
   ├── useGrowthRankings() hook调用  
   └── useGapTrends() hook调用
   ↓
2. hooks/useStoryData.ts (状态管理层)
   ├── fetchCoreInsights() API调用
   ├── loading/error/data状态管理
   └── useCallback优化重渲染
   ↓
3. services/api.ts (数据转换层)
   ├── getApiUrl() 环境变量处理
   ├── Promise.all() 并行API调用
   ├── 后端嵌套响应→前端扁平化转换
   └── 数据格式化(growthRate → "45.2%")
   ↓
4. types/salary.ts (类型契约层)
   ├── CoreInsights接口定义
   ├── GrowthRankings接口定义
   └── SalaryGapTrends接口定义
```

### Data Analysis Reference Chain
```
1. data_analysis/merged_data.csv (原始数据)
   ↓
2. interactive_crosstab_app.py (算法参考)
   ├── get_growth_champion_data() → SalaryService.getCoreInsights()
   ├── calculate_salary_gap_ratio_average() → 薪资差距计算
   └── calculate_yearly_gap_ratios() → SalaryService.getSalaryGapTrends()
   ↓
3. csv_to_sql_converter.py (数据转换)
   ↓
4. V2__Insert_salary_data.sql (SQL导入)
   ↓
5. PostgreSQL salary_records表 (持久化存储)
```

### Configuration Dependencies
```
Environment Variables (.env) → Vite Build (main.tsx) → Axios Config
Docker Compose (DB Config) → application.properties → Spring Boot Startup
Flyway Migration (V1,V2) → PostgreSQL Schema → JPA Entity Mapping
TypeScript Types (salary.ts) → API Service → Hook Consumption
```

### Critical File Interactions
- **api.ts ↔ salary.ts**: API函数必须返回接口定义的类型
- **SalaryService.java ↔ interactive_crosstab_app.py**: 业务算法必须一致
- **application.properties ↔ docker-compose.yml**: 数据库连接参数同步
- **useStoryData.ts ↔ HomePage.tsx**: Hook返回类型与组件期望类型匹配
- **SalaryRecord.java ↔ V1__Create_salary_tables.sql**: 实体字段与表结构对应