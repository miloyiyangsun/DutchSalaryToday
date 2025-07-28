# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

DutchSalaryToday is a data storytelling platform for Dutch salary insights, built with a modern cloud-native stack:

- **Frontend**: React 19 + TypeScript + Vite + Recharts for data visualization
- **Backend**: Spring Boot 3.5.3 + Java 17 + JPA + PostgreSQL
- **Deployment**: Azure cloud services with Docker containers and GitHub Actions CI/CD
- **Data Source**: Netherlands Statistics Bureau (CBS) OData API data (2010-2024)

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

## Key Commands

### Frontend (React/TypeScript)
```bash
cd frontend
npm install
npm run dev        # Development server
npm run build      # Production build
npm run lint       # ESLint
npm run preview    # Preview production build
```

### Backend (Spring Boot)
```bash
cd backend
./mvnw compile     # Compile only
./mvnw test        # Run tests
./mvnw spring-boot:run  # Local development
./mvnw package     # Build JAR
```

### Docker Operations
```bash
# Development
docker-compose up --build

# Individual services
docker-compose up db       # Database only
docker-compose up backend  # Backend only
docker-compose up frontend # Frontend only
```

### Data Analysis
```bash
cd data_analysis
python temp_profiling_script.py  # Data profiling
jupyter notebook Sprint1_Data_Cleaning.ipynb  # EDA
```

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

## Sprint Structure

Current progress: Sprint 1 in progress ("Industry Ice and Fire" story)
- Sprint-1: Data exploration ✅
- Sprint 0: Infrastructure ✅
- Sprint 1: First story development 🔄
- Sprint 2-5: Additional stories
- Sprint 6: Data explorer feature + v1.0 release