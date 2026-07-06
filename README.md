# AntiGravity - Full-Stack Physics Simulation Platform

A platform for interactive anti-gravity physics simulation, experimentation, and AI-powered learning. Built with Next.js 14, Node.js, Three.js, and Nvidia Nemotron via OpenRouter.

## Prerequisites
- Node.js 20+
- Docker Desktop
- pnpm

## Getting Started

1. Clone the repository and install dependencies
```bash
git clone <repo-url>
cd antigravity
pnpm install
```

2. Setup Environment Variables
```bash
cp .env.example .env
# Add your OPENROUTER_API_KEY to .env
```

3. Start Infrastructure (Postgres, Redis, MinIO)
```bash
docker compose up --build -d
```

4. Database Migration & Seeding
```bash
pnpm --filter backend prisma migrate dev
pnpm --filter backend prisma db seed
```

5. Run Development Servers
```bash
pnpm dev
```

## URLs
- Frontend: `http://localhost:3000`
- API Backend: `http://localhost:4000`
- MinIO Console: `http://localhost:9001` (login: minioadmin / minioadmin)
