# Sprint 0: 后端架构与初始化权威指南 (2025 版)

您好！遵照您的指示，并结合我通过 DuckDuckGo 搜索到的 2025 年 Spring Boot 3 最新主流实践，我为您编写了这份全新的后端架构与初始化权威指南。

首先，我可以非常肯定地告诉您：您选择的 `Spring Boot + Java 17 + Maven + PostgreSQL` 技术栈，是当前构建健壮、高性能 REST API 的**绝对主流和黄金标准**。多阶段 Dockerfile 的使用也是完全正确的生产实践。

这份文档将深入探讨并细化我们的后端策略，确保我们构建的不仅是一个能工作的应用，更是一个**高质量、可维护、易于扩展的企业级应用**。

---

## Part 1: 方案评估 - 为什么这是 2025 年的正确选择？

- **Spring Boot 3 & Java 17:**

  - **历史与现状:** Spring Boot 3 是一个重要的里程碑，它要求必须使用 Java 17 或更高版本。这使我们能够利用 Java 17 的所有新特性（如 Records, Sealed Classes, Pattern Matching），编写出更简洁、更安全的代码。同时，Spring Boot 3 全面拥抱 Jakarta EE 9+，并为虚拟线程 (Project Loom) 和 GraalVM 原生镜像 (Native Image) 等前沿技术奠定了坚实基础。
  - **结论:** 选择这个组合意味着我们站在了 Java 生态系统的最前沿，能够享受到最佳的性能和最新的功能。

- **Spring Web & Spring Data JPA:**

  - **解决的问题:** 这是 Spring 生态中最经典的组合。`Spring Web` 让我们能够快速构建 RESTful API，而 `Spring Data JPA` 则极大地简化了数据库访问层的代码，让我们能用非常简单的方式操作数据库，而无需编写繁琐的 SQL 语句。
  - **结论:** 这个组合经过了数百万项目的实战检验，稳定、高效且功能强大。

- **Maven (构建工具):**

  - **对比:** 虽然 `Gradle` 是一个同样优秀的选择，但 `Maven` 凭借其 XML 的声明性、庞大的社区和成熟的生态系统，在企业级项目中仍然占据主导地位。它的依赖管理和项目生命周期非常清晰。
  - **结论:** 选择 Maven 是一个稳妥、可靠且主流的选择。

- **多阶段 Docker 构建:**
  - **优势:** 正如前端方案中所述，这种方式可以构建出体积小、更安全的生产镜像。对于 Spring Boot 应用，它还有一个额外的好处：可以利用 Spring Boot 构建插件的**分层 (Layering)** 功能，将变化不频繁的依赖库和变化频繁的业务代码分到不同的 Docker 层中，从而在代码变更时，只需重新构建最上层的业务代码层，极大地提升了 CI/CD 流水线中的镜像构建速度。
  - **结论:** 这是容器化 Spring Boot 应用的最高效、最标准的实践。

---

## Part 2: 增强与细化 - 构建坚实的企业级后端基础

### 1. 推荐的包结构 (Recommended Package Structure)

一个清晰的、按功能分层的包结构至关重要。

```
backend/
└── src/
    └── main/
        ├── java/
        │   └── com/
        │       └── yourproject/
        │           └── dutchsalaraytoday/
        │               ├── config/          # 配置类 (e.g., SecurityConfig)
        │               ├── controller/      # API 入口层 (e.g., SalaryController)
        │               ├── dto/             # 数据传输对象 (e.g., SalaryDTO, StoryDTO)
        │               ├── exception/       # 自定义异常和全局异常处理器
        │               ├── model/           # JPA 实体/领域模型 (e.g., SalaryData)
        │               ├── repository/      # 数据访问层接口 (e.g., SalaryRepository)
        │               └── service/         # 业务逻辑层 (e.g., SalaryService)
        └── resources/
            ├── static/
            ├── templates/
            ├── application.yml      # 主配置文件
            ├── application-dev.yml  # 开发环境配置
            └── application-prod.yml # 生产环境配置
```

### 2. 推荐增加的核心依赖

在您选择的基础上，我强烈建议增加以下几个“必备”依赖，以提升开发效率和生产环境的可观测性。

- **Spring Boot Actuator:**
  - **作用:** 它为应用提供了一系列用于**监控和管理**的生产级端点 (Endpoint)。例如，我们可以通过访问 `/actuator/health` 来检查应用的健康状况，这对于自动化运维和容器编排系统（如 Kubernetes）至关重要。
  - **依赖:** `spring-boot-starter-actuator`
- **Spring Validation:**
  - **作用:** 允许我们通过注解的方式，对 API 的输入参数进行声明式的验证（例如 `@NotNull`, `@Min(1)`），让代码更整洁、更健壮。
  - **依赖:** `spring-boot-starter-validation`
- **Lombok:**
  - **作用:** 一个非常流行的 Java 库，可以通过注解（如 `@Data`, `@Getter`, `@Setter`, `@Builder`）在编译时自动生成样板代码 (boilerplate code)，极大地简化了我们的实体类和 DTO。
  - **依赖:** `lombok` (通常需要配合 IDE 插件使用)

### 3. 配置最佳实践：`.yml` 优于 `.properties`

我建议使用 `application.yml` 代替传统的 `application.properties`。

- **优势:** YAML 格式具有层级结构，可读性更强，尤其是在配置复杂时。它还能更好地支持列表和复杂的对象结构。
- **环境隔离:** 通过创建 `application-dev.yml` 和 `application-prod.yml`，我们可以为不同环境（开发、生产）维护独立的配置。只需在主 `application.yml` 中通过 `spring.profiles.active=dev` 来激活特定环境的配置。

### 4. API 设计最佳实践：使用 DTO (Data Transfer Objects)

这是一个非常重要的设计模式。我们**不应该**直接将数据库实体 (`model`) 暴露给 API 的调用者。

- **原因:**
  1.  **安全:** 避免意外泄露数据库的敏感字段（如密码、内部状态等）。
  2.  **解耦:** API 的数据结构（给前端看的样子）和数据库的表结构（数据存储的样子）应该解耦。它们的需求和变化频率是不同的。
- **做法:** 我们为每个 API 端点创建专门的 DTO 类。Controller 接收 DTO，Service 层负责将 DTO 和数据库实体 (Model) 进行转换。

### 5. 详细的初始化执行步骤

1.  **访问 Spring Initializr (`start.spring.io`)**
2.  **配置项目元数据:**
    - Project: `Maven`
    - Language: `Java`
    - Spring Boot: `3.x.x` (选择最新的稳定版)
    - Group: `com.yourproject`
    - Artifact: `dutch-salary-today`
    - Packaging: `Jar`
    - Java: `17`
3.  **添加依赖 (Dependencies):**
    - `Spring Web`
    - `Spring Data JPA`
    - `PostgreSQL Driver`
    - `Spring Boot Actuator`
    - `Validation`
    - `Lombok`
4.  **生成并解压:** 点击 "GENERATE"，下载 ZIP 文件并将其内容解压到 `backend` 目录。
5.  **创建 Dockerfile:** 在 `backend` 目录下运行 `touch Dockerfile`。

### 6. 增强版的 Dockerfile (利用分层特性)

这个版本的 Dockerfile 利用了 Spring Boot Maven 插件的“分层”功能，可以显著加快后续构建速度。

```dockerfile
# backend/Dockerfile - 07.14, 04:40

# --- 构建阶段 (Build Stage) ---
# 使用一个包含 Maven 和 JDK 17 的标准镜像
FROM maven:3.8.6-openjdk-17 AS build

# 设置工作目录
WORKDIR /app

# 复制 Maven 项目定义文件
COPY pom.xml .

# (可选，但推荐) 仅下载依赖项，这一步可以被 Docker 缓存
# RUN mvn dependency:go-offline

# 复制整个项目源代码
COPY src ./src

# 使用 Spring Boot 的打包命令，它会自动创建优化的分层 JAR
# -DskipTests 会跳过耗时的单元测试，这在 CI/CD 流程中是常见做法
RUN mvn spring-boot:repackage -DskipTests

# --- 生产阶段 (Production Stage) ---
# 使用一个极度轻量级的、仅包含 Java 运行时的 slim 镜像
FROM openjdk:17-jdk-slim

# 设置工作目录
WORKDIR /app

# 从构建阶段，将分层的应用内容复制到生产镜像中
# 这种方式比直接复制一个 fat JAR 更好，因为它能更好地利用 Docker 的层缓存机制
COPY --from=build /app/target/dutch-salary-today-0.0.1-SNAPSHOT.jar app.jar

# 暴露应用运行的端口
EXPOSE 8080

# 设置应用的启动命令
ENTRYPOINT ["java","-jar","app.jar"]
```

通过遵循这份增强版的计划，我们将构建一个结构清晰、配置合理、易于维护和高效部署的现代化后端服务。
