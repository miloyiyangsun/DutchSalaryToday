# Project Structure

## Root Level Organization

```
DutchSalaryToday/
├── .github/workflows/     # CI/CD pipelines
├── .kiro/steering/        # AI assistant guidance
├── Project_Plan/          # Sprint planning and documentation
├── backend/               # Spring Boot API service
├── frontend/              # React TypeScript application
├── data_acquisition/      # Python scripts for CBS data fetching
├── deploy/                # Azure Bicep infrastructure templates
├── docker-compose.yml     # Local development orchestration
└── README.md             # Project documentation
```

## Backend Structure (`backend/`)

```
backend/
├── src/main/java/com/dutchsalarytoday/dutch_salary_today/
│   └── DutchSalaryTodayApplication.java    # Main Spring Boot class
├── src/main/resources/
│   ├── application.properties              # Configuration
│   ├── static/                            # Static web assets
│   └── templates/                         # Server-side templates
├── src/test/java/                         # Unit tests
├── target/                                # Maven build output
├── Dockerfile                             # Container definition
├── pom.xml                               # Maven dependencies
└── mvnw, mvnw.cmd                        # Maven wrapper
```

## Frontend Structure (`frontend/`)

```
frontend/
├── src/
│   ├── assets/           # Static assets (images, icons)
│   ├── App.tsx          # Main React component
│   ├── main.tsx         # Application entry point
│   ├── index.css        # Global styles
│   └── vite-env.d.ts    # TypeScript definitions
├── public/              # Public static files
├── node_modules/        # NPM dependencies
├── Dockerfile           # Container definition
├── package.json         # NPM configuration
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite build configuration
└── eslint.config.js     # Code quality rules
```

## Data Processing (`data_acquisition/`)

```
data_acquisition/
├── raw_data/            # CBS API response cache
│   ├── CategoryGroups.json
│   ├── DataProperties.json
│   ├── Periods.json
│   ├── SectorBranchesSIC2008.json
│   ├── TableInfos.json
│   ├── TypedDataSet.json
│   └── UntypedDataSet.json
├── fetch_all_cbs_data.py    # Main data fetching script
├── requirements.txt         # Python dependencies
└── .venv/                  # Virtual environment
```

## Infrastructure (`deploy/`)

```
deploy/
├── infra.bicep          # Core Azure resources (ACR, PostgreSQL, App Service)
└── app-update.bicep     # Application deployment updates
```

## Planning & Documentation (`Project_Plan/`)

```
Project_Plan/
├── Project_Plan.md      # Master project roadmap
├── sprint0/             # Foundation sprint plans
│   ├── azure_cloud_plan.md
│   ├── backend_plan.md
│   └── frontend_plan.md
└── sprint1/             # Feature development plans
    └── frontAndBack.md
```

## Naming Conventions

### Java (Backend)

- **Packages**: `com.dutchsalarytoday.dutch_salary_today`
- **Classes**: PascalCase (`DutchSalaryTodayApplication`)
- **Methods**: camelCase
- **Constants**: UPPER_SNAKE_CASE

### TypeScript/React (Frontend)

- **Components**: PascalCase (`App.tsx`)
- **Files**: camelCase or kebab-case
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE

### Infrastructure

- **Resources**: kebab-case with descriptive prefixes
- **Containers**: `salary-frontend`, `salary-backend`, `salary-db`
- **Azure Resources**: Prefixed by type (`acr-`, `psql-`, `asp-`)

## Development Workflow

1. **Feature Development**: Work in story-based vertical slices
2. **Local Testing**: Use `docker-compose up --build` for full stack
3. **Code Quality**: ESLint/Prettier for frontend, Maven for backend
4. **Deployment**: Automated via GitHub Actions to Azure
5. **Data Updates**: Manual execution of Python scripts as needed

## File Organization Principles

- **Separation of Concerns**: Clear boundaries between frontend, backend, data, and infrastructure
- **Environment Parity**: Docker ensures consistent development/production environments
- **Infrastructure as Code**: All Azure resources defined in Bicep templates
- **Documentation Co-location**: Plans and specs live alongside code
