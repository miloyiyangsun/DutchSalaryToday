# frontend/Dockerfile - 07.14, 04:30

# --- 构建阶段 (Build Stage) ---
# 使用一个特定版本的 Node.js Alpine 镜像作为构建环境，确保环境一致性
FROM node:20-alpine AS build

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
# 单独复制这两个文件可以利用 Docker 的层缓存机制。
# 只有当这两个文件变化时，才会重新执行 npm ci，否则会直接使用缓存，加快构建速度。
COPY package*.json ./

# 使用 npm ci 代替 npm install。
# ci (clean install) 会严格按照 package-lock.json 安装依赖，确保构建环境的确定性，且速度更快。
RUN npm ci

# 复制所有剩余的源代码
COPY . .

# 执行构建命令，生成生产环境的静态文件
RUN npm run build

# --- 生产阶段 (Production Stage) ---
# 使用一个极其轻量的 Nginx Alpine 镜像作为最终的服务器
FROM nginx:stable-alpine

# 从构建阶段，将构建好的静态文件复制到 Nginx 的网站根目录
COPY --from=build /app/dist /usr/share/nginx/html

# （可选）可以添加一个自定义的 Nginx 配置文件来优化路由或缓存策略
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 Nginx 默认的 80 端口
EXPOSE 80

# Nginx 镜像自带启动命令，我们无需指定 ENTRYPOINT 或 CMD