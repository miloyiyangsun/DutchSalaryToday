# Sprint 1 - Phase 1: API契约优先开发的第一步

## 目标
按照2025年主流的API-First开发方法，先创建API契约，再并行开发前后端

## 调研依据
基于对2025年全栈开发最佳实践的调研，主流推荐：
- ✅ **API契约优先** - 避免传统的"前端等后端"问题
- ✅ **并行开发** - 前后端基于相同契约同时进行
- ✅ **Mock服务器** - 前端立即开始开发，不被后端阻塞
- ✅ **减少集成问题** - 双方基于同一规范开发

## 具体步骤

### 第1步: 创建API规范文件结构

#### 基于故事域的文件组织（支持5个Sprint）：
```
/Users/sunyiyang/Desktop/DutchSalaryToday/
├── api/                        # 新建：API契约文件夹
│   ├── openapi.yaml           # 新建：主入口文件（Sprint 1单文件）
│   ├── mock-server.js         # 新建：Node.js Mock服务器
│   ├── package.json           # 新建：Mock服务器依赖
│   └── stories/               # 新建：未来按故事组织（Sprint 2+）
│       ├── sprint1-industry-saga/    # 行业冰与火之歌
│       ├── sprint2-gender-power/     # 女性职场力量崛起
│       ├── sprint3-hidden-costs/     # 隐形人力成本
│       ├── sprint4-work-revolution/  # 工作模式革命
│       ├── sprint5-efficiency-mystery/ # 效率之谜
│       └── explorer/                 # Sprint 6数据探索器
└── frontend/
    └── src/
        ├── services/          # 新建：API服务文件夹  
        │   └── api.ts         # 新建：API调用封装
        └── types/             # 新建：TypeScript类型定义
            └── salary.ts      # 新建：薪酬数据类型定义
```

**执行命令：**
```bash
# 在项目根目录执行
cd /Users/sunyiyang/Desktop/DutchSalaryToday
mkdir -p api/stories
mkdir -p frontend/src/services  
mkdir -p frontend/src/types
```

### 第2步: 编写OpenAPI规范文件

创建 `api/openapi.yaml`，采用**单文件开始，后期演进**策略：

#### Sprint 1: 单文件结构
- **版本**: v1.0.0 - 行业冰与火之歌
- **端点**: `/core-insights`, `/growth-analysis`, `/salary-gap-trend`
- **数据**: 基于已验证的3个核心数字（164.5%, 20.8%, 2.6倍→3.4倍）

#### 未来Sprint演进策略：
- **Sprint 2**: v1.1.0 - 添加女性职场力量端点（`/gender-power/*`）
- **Sprint 3**: v1.2.0 - 添加隐形成本端点（`/hidden-costs/*`）  
- **Sprint 4**: v1.3.0 - 添加工作革命端点（`/work-revolution/*`）
- **Sprint 5**: v1.4.0 - 添加效率分析端点（`/efficiency-mystery/*`）
- **Sprint 6**: v1.5.0 - 添加数据探索器（`/explorer/*`）

#### 文件拆分时机：
- **Sprint 1**: 使用单个openapi.yaml（快速开发）
- **Sprint 2开始**: 当文件超过200行时，拆分为stories/文件夹结构
- **最终结构**: 主文件仅包含$ref引用，具体定义分布在各story文件夹中

### 第3步: 创建Mock服务器

#### 基础配置：
- **技术栈**: Node.js + Express + CORS
- **端口**: 3001（避免与后端8080冲突）
- **数据**: 返回已验证的3个核心数字
- **功能**: 健康检查、请求日志、错误处理

#### 核心文件：
- `api/package.json` - 依赖管理（express, cors, nodemon）
- `api/mock-server.js` - 服务器主文件
- 启动命令: `npm start` 或 `npm run dev`（热重载）

#### API端点：
- `GET /api/v1/core-insights` - Sprint 1核心数据
- `GET /api/v1/growth-analysis` - 增长排行榜
- `GET /api/v1/salary-gap-trend` - 薪酬差距趋势
- `GET /health` - 健康检查

#### 扩展性设计：
- **模块化路由**: 每个Sprint可独立添加路由模块
- **数据隔离**: 各Story的Mock数据分文件管理  
- **版本支持**: 支持API版本演进和向后兼容

### 第4步: 前端API服务层

#### TypeScript类型系统：
- **核心接口**: `CoreInsights`, `IndustryGrowth`, `SalaryGapSummary`
- **扩展性**: 为未来5个Sprint预留接口扩展空间
- **类型安全**: 编译时错误检查，避免API数据不匹配

#### API服务封装：
- **基础URL**: `http://localhost:3001/api/v1` (Mock服务器)
- **错误处理**: 统一的异常处理和重试机制
- **缓存策略**: 支持数据缓存，减少不必要的API调用
- **环境切换**: 开发/生产环境的API地址自动切换

#### 服务架构：
- `frontend/src/types/salary.ts` - TypeScript接口定义
- `frontend/src/services/api.ts` - API调用封装
- **未来扩展**: 每个Sprint可添加对应的类型和服务方法

### 第5步: 验证测试

#### 5.1 启动Mock服务器：
```bash
cd api
npm start
```

#### 5.2 验证API端点：
```bash
# 测试核心洞察API
curl http://localhost:3001/api/v1/core-insights

# 测试健康检查
curl http://localhost:3001/health

# 期望响应：包含3个核心数字的JSON数据
```

#### 5.3 浏览器验证：
访问 `http://localhost:3001/api/v1/core-insights`，应该看到JSON响应

### 第6步: 前端集成准备

#### React组件集成：
- **修改**: `frontend/src/App.tsx` - 添加API调用和状态管理
- **展示**: 3个核心数字的卡片式布局
- **状态**: Loading、Error、Success状态处理
- **样式**: 基础的响应式布局和视觉层次

#### 集成验证点：
- **数据获取**: useEffect + async/await模式
- **错误处理**: 网络错误和数据解析错误
- **类型安全**: TypeScript编译检查
- **用户体验**: 加载状态和错误提示

#### 为Story页面预留：
- **路由准备**: 为后续页面跳转做准备
- **组件复用**: 数据卡片组件可复用到详情页
- **状态管理**: 考虑使用Context或Zustand管理跨组件状态

## API演进策略补充

### 版本管理方法
- **语义版本**: 遵循semver规范（Major.Minor.Patch）
- **向后兼容**: 新功能通过Minor版本增加，避免Breaking Changes
- **废弃管理**: 旧端点通过HTTP响应头和文档提前6个月通知废弃

### 5个Sprint的API路径规划
```
Sprint 1 (v1.0.0): /stories/industry-saga/*
Sprint 2 (v1.1.0): /stories/gender-power/*  
Sprint 3 (v1.2.0): /stories/hidden-costs/*
Sprint 4 (v1.3.0): /stories/work-revolution/*
Sprint 5 (v1.4.0): /stories/efficiency-mystery/*
Sprint 6 (v1.5.0): /explorer/* (通用数据探索)
```

## 完成标志

✅ **基础架构就绪** - 支持5个Sprint的扩展性文件结构  
✅ **API契约完整** - OpenAPI规范定义清晰，支持版本演进  
✅ **Mock服务运行** - 3个核心端点正常响应  
✅ **前端集成成功** - React应用显示3个核心数字  
✅ **类型安全保障** - TypeScript编译无错误  
✅ **演进策略明确** - 后续4个Sprint的API扩展路径清晰  

## 验证清单

- [ ] 文件夹结构包含stories/子文件夹（为未来5个Sprint准备）
- [ ] Mock API返回164.5%、20.8%、2.6倍→3.4倍数据
- [ ] 前端显示3个数据卡片，样式和功能正常
- [ ] OpenAPI文档版本为v1.0.0，包含演进计划
- [ ] 所有TypeScript类型编译通过

## 预计时间
**2-3小时** (包含架构设计思考时间)

## 下一步预告

Phase 1完成后的**并行开发**优势：
- **前端**: 基于稳定的API契约继续UI开发，不等待后端
- **后端**: 并行实现真实数据查询，符合已定义的契约
- **扩展性**: 为后续4个Sprint的故事开发奠定了清晰的架构基础

这种方法确保每个Sprint都能独立开发，同时保持整体架构的一致性。