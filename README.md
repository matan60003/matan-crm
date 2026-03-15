Matan CRM - Enterprise-Ready Management System
A professional Full-Stack CRM (Customer Relationship Management) system built for managing leads, customers, and business operations. This project is now fully Dockerized, ensuring a seamless setup and production-ready environment [cite: 2026-02-18].

🚀 Key Updates (Dockerization)
The entire infrastructure is now managed via Docker. This includes:

Automated Environment: No need to install PostgreSQL or Node.js locally; everything runs inside isolated containers [cite: 2026-02-18].

Database Consistency: PostgreSQL 15 is configured within Docker with persistent volumes to ensure your data is never lost [cite: 2026-02-18].

Unified Setup: A single command builds the app, generates the Prisma client, and starts the database [cite: 2026-02-18].

✨ Core Features
Lead Management: Capture leads from Google, Facebook, or referrals and convert them to customers with one click.

Customer Database: Manage active clients, track company names, and transaction amounts with a clean, RTL-supported UI.

Task System with History: Create tasks with priority levels and track full comment histories with timestamps.

Integrated Database UI: Access Prisma Studio directly from the container to manage raw data [cite: 2026-02-18].

🛠️ Tech Stack
Framework: Next.js 15 (App Router) [cite: 2025-12-04].

Database & ORM: PostgreSQL + Prisma [cite: 2026-02-18].

Infrastructure: Docker & Docker Compose [cite: 2026-02-18].

Styling: Tailwind CSS [cite: 2025-12-04].

Icons: Lucide React [cite: 2026-02-18].

📦 Quick Start (Docker)
Clone the project:

Bash
git clone <repository-url>
Run the entire system:

Bash
docker-compose up --build -d
Sync the Database Schema:

Bash
docker-compose exec app npx prisma migrate dev --name init
Access the Apps:

CRM Dashboard: http://localhost:3000

Database Management (Prisma Studio):

Bash
docker-compose exec app npx prisma studio --port 5555 --hostname 0.0.0.0 --browser none
Then visit: http://localhost:5555
