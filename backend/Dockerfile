# backend/Dockerfile - 07.14, 04:40

# --- 构建阶段 (Build Stage) ---
# 使用一个包含 Maven 和 JDK 17 的标准镜像
FROM maven:3.9.10-eclipse-temurin-17 AS build

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
RUN mvn package -DskipTests

# --- 生产阶段 (Production Stage) ---
# 使用一个极度轻量级的、仅包含 Java 运行时的 slim 镜像
FROM openjdk:17-jdk-slim

# 设置工作目录
WORKDIR /app

# 从构建阶段，将分层的应用内容复制到生产镜像中
# 这种方式比直接复制一个 fat JAR 更好，因为它能更好地利用 Docker 的层缓存机制
COPY --from=build /app/target/*.jar app.jar

# 暴露应用运行的端口
EXPOSE 8080

# 设置应用的启动命令
ENTRYPOINT ["java","-jar","app.jar"]