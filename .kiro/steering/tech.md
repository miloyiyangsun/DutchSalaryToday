# Technology Stack

## Backend

- **Framework**: Spring Boot 3.5.3
- **Language**: Java 17
- **Build Tool**: Maven
- **Database**: PostgreSQL 15
- **Key Dependencies**:
  - Spring Data JPA (data persistence)
  - Spring Boot Actuator (health checks)
  - Spring Validation
  - Lombok (code generation)
  - HikariCP (connection pooling)

## Frontend

- **Framework**: React 19.1.0 + TypeScript
- **Build Tool**: Vite 7.0.4
- **Key Libraries**:
  - Axios (HTTP client with timeout configuration)
  - Recharts (data visualization)
- **Development**: ESLint + Prettier for code quality

## Data Processing

- **Language**: Python 3
- **Libraries**: requests, certifi, urllib3
- **Data Source**: CBS (Statistics Netherlands) OData API

## Infrastructure & Deployment

- **Cloud Provider**: Azure
- **Infrastructure as Code**: Bicep templates
- **Container Registry**: Azure Container Registry (ACR)
- **Hosting**: Azure App Service (Linux containers)
- **Database**: Azure Database for PostgreSQL Flexible Server
- **CI/CD**: GitHub Actions

## Development Environment

- **Containerization**: Docker + docker-compose
- **Local Database**: PostgreSQL 15 container
- **Port Mapping**: Frontend (3000), Backend (8080), Database (5432)

## Common Commands

### Local Development

```bash
# Start all services
docker-compose up --build

# Backend only (requires local PostgreSQL)
cd backend && ./mvnw spring-boot:run

# Frontend only
cd frontend && npm run dev

# Build frontend
cd frontend && npm run build
```

### Testing & Quality

```bash
# Backend compile check
cd backend && mvn -B compile

# Frontend build check
cd frontend && npm install && npm run build

# Linting
cd frontend && npm run lint
```

### Data Processing

```bash
# Fetch CBS data
cd data_acquisition && python fetch_all_cbs_data.py
```

## Architecture Patterns

- **Microservices**: Separate frontend/backend containers
- **Database-per-Service**: PostgreSQL for backend data
- **API-First**: RESTful APIs between frontend/backend
- **Retry Pattern**: Spring Retry for transient failures
- **Connection Pooling**: HikariCP for database connections
