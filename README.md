# DutchSalaryToday

A data storytelling platform showcasing Dutch salary insights based on CBS Netherlands Statistics Bureau data (2010-2024).

## Tech Stack

### Frontend
- **React 19** + **TypeScript** + **Vite**
- **Recharts** - Data visualization library
- **TailwindCSS** + **React Router** - UI framework and routing
- **Axios** - API request handling

### Backend  
- **Spring Boot 3.5.3** + **Java 17**
- **Spring Data JPA** + **PostgreSQL** - Data persistence
- **Flyway** - Database migration management
- **Maven** - Build tool

### Data Analysis
- **Python** + **Pandas** - Data processing and analysis
- **Jupyter Notebook** - Data exploration
- **CBS Netherlands Data** - Official statistics data source

### Deployment
- **Docker** + **Docker Compose** - Containerized deployment
- **Azure Cloud** - Cloud platform
- **GitHub Actions** - CI/CD automation

## Project Status

✅ **Completed**
- Homepage - Project overview and navigation
- Story 1: "Industry Ice and Fire" - Industry salary contrast analysis
- Complete backend API system (6 core endpoints)
- Data processing and analysis pipeline
- Docker containerized deployment

🚧 **In Development** 
- Story 2: Gender Power - Gender salary power analysis
- Story 3: Hidden Costs - Hidden cost analysis  
- Story 4: Work Revolution - Work pattern revolution
- Story 5: Efficiency Mystery - Efficiency mystery

## Quick Start

### Development Environment
```bash
# Start full application (frontend + backend + database)
docker-compose up --build

# Frontend development
cd frontend
npm install
npm run dev

# Backend development  
cd backend
./mvnw spring-boot:run
```

### Quality Checks
```bash
# Frontend
cd frontend && npm run lint && npm run build

# Backend
cd backend && ./mvnw test && ./mvnw compile
```

## API Endpoints

- `/api/v1/core-insights` - Industry growth insights
- `/api/v1/work-hours-analysis` - Work hours analysis
- `/api/v1/gender-power-insights` - Gender power analysis
- `/api/v1/work-intensification` - Work intensification analysis
- `/api/v1/hidden-costs-insights` - Hidden costs insights
- `/api/v1/salary-gap-trends` - Salary gap trends

## Data Source

Based on CBS Netherlands Statistics Bureau official data (2010-2024), with core field `wages_per_fte_9` (actual salary income).