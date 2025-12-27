# PC Forge

**Forge your own PC build.** A web application for crafting, sharing, and rating custom PC builds. A project for the **Databases 2025/26** course.

## ✨ Features

- 🔨 Forge custom PC builds from a comprehensive component database
- 💾 Browse CPUs, GPUs, motherboards, storage, and more
- ⭐ Rate and review community builds
- 💬 Suggest new components for the database
- 👤 User authentication and admin management

## 🛠️ Tech Stack

- **Frontend**: React 19, Material-UI, Emotion
- **Backend**: Hono, Node.js
- **Database**: PostgreSQL 16
- **ORM**: Drizzle ORM
- **Build Tool**: Vite
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) (latest version)
- Docker Compose V2 (included with Docker Desktop)
- [Node.js 20+](https://nodejs.org/) (optional, for local development)
- [npm](https://www.npmjs.com/)

## 🚀 Quick Start

### 1. Clone the Repository
```agsl
git clone https://github.com/nkvtd/pc-forge.git
cd pc-forge
```

### 2. Configure Environment

**Copy the example environment file:**
```agsl
cp .env.example .env
```
**Update only the AUTH_SECRET in `.env`:**
```agsl
DATABASE_URL="postgresql://app:app@db:5432/postgres"
AUTH_SECRET="YOUR_GENERATED_SECRET_KEY_HERE"
PORT=8080
```
> **Important**: The `DATABASE_URL` and `PORT` are pre-configured for Docker. Only change the `AUTH_SECRET` to a random, secure value (you can generate one using `openssl rand -base64 32`).

### 3. Start with Docker
```agsl
docker compose up --build
```

The application will automatically:
- ✅ Start PostgreSQL database on port **5432**
- ✅ Run database migrations
- ✅ Seed initial data (users, components, builds)
- ✅ Start the web server on port **8080**

**Access the application at: http://localhost:8080**

## ⚙️ Pre-configured Settings

The following settings are pre-configured for Docker and should **not** be changed unless you know what you're doing:

- **Database Host**: `db` (Docker service name)
- **Database Port**: `5432`
- **Database Name**: `postgres`
- **Database User**: `app`
- **Database Password**: `app`
- **Application Port**: `8080`

## 💻 Development

### Local Development (Without Docker)
**Install dependencies**
```agsl
npm install
```
**Update DATABASE_URL in .env to use localhost**
```agsl
DATABASE_URL="postgresql://app:app@localhost:5432/postgres"
```
**Run database migrations**
```agsl
npm run drizzle:migrate
```

**Seed database**
```agsl
npm run drizzle:seed
```

**Start development server**
```agsl
npm run dev
```

## 📁 Project Structure
```agsl
pc-forge/
├── database/
│ └── drizzle/
│ ├── schema/ # Database schema definitions
│ ├── queries/ # Database queries
│ └── util/
│ └── seed.ts # Database seeding script
├── dist/ # Built application
├── migrations/ # Generated database migrations
├── pages/ # Vike pages
├── server/ # Backend server code
├── Dockerfile # Docker image configuration
├── docker-compose.yml # Docker services orchestration
├── docker-entrypoint.sh # Container startup script
├── drizzle.config.ts # Drizzle ORM configuration
├── .env.example # Example environment variables
└── package.json
```


## 👥 Default Users

After the database is seeded, you can log in with these accounts:

| Username | Password | Role |
|----------|----------|------|
| admin | admin | Admin |
| tome | tg | User |
| mihail | mn | User |
| stefan | sv | User |
| pc_wizard | pw | User |
| budget_king | bk | User |
| rgb_lover | rgb | User |
| streamer_pro | sp | User |
| office_guy | og | User |
| linux_fan | lf | User |
| first_timer | ft | User |

## 🔧 Environment Variables

| Variable | Description | Default | Should Change? |
|----------|-------------|---------|----------------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://app:app@db:5432/postgres` | ❌ No (pre-configured) |
| `AUTH_SECRET` | Authentication secret key | - | ✅ **Yes (required)** |
| `PORT` | Application port | `8080` | ❌ No (pre-configured) |

# 📚 Course Information

This project was developed for the Databases 2025/26 course. It demonstrates:

- Complex relational database design with PostgreSQL
- Database migrations and seeding
- ORM usage (Drizzle ORM)
- Full-stack web application development
- Containerization with Docker

# 📄 License

MIT License
