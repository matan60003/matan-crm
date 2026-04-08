Matan CRM - Enterprise-Ready Management System
A professional Full-Stack CRM (Customer Relationship Management) system built for managing leads, customers, and business operations. This project is fully Dockerized, ensuring a seamless setup and production-ready environment.

🚀 Key Updates (Dockerization)
The entire infrastructure is managed via Docker. This includes:

Automated Environment: No need to install PostgreSQL or Node.js locally; everything runs inside isolated containers.

Database Consistency: PostgreSQL 15 is configured with persistent volumes to ensure your data is never lost.

Unified Setup: A single command builds the app, generates the Prisma client, and starts the database.

✨ Core Features
Lead Management: Capture leads and convert them to customers with one click.

Customer Database: Manage active clients, track company names, and transaction amounts with a clean, RTL-supported UI.

Task System: Create tasks with priority levels and track full comment histories.

Integrated Database UI: Access Prisma Studio directly from the container to manage raw data.

🛠️ Tech Stack
Framework: Next.js 15 (App Router)

Database & ORM: PostgreSQL + Prisma

Infrastructure: Docker & Docker Compose

Styling: Tailwind CSS

Icons: Lucide React

📦 Quick Start (Docker)

1. Clone the project
   Bash
   git clone <repository-url>
   cd matan-crm
2. Configure Environment Variables
   Create a .env file in the root directory and add your connection string (example based on docker-compose.yml):
   DATABASE_URL="postgresql://postgres:123@db:5432/matan_crm?schema=public"
   NEXTAUTH_SECRET="your_random_secret_key"
   NEXTAUTH_URL="http://localhost:3000" 3. Run the entire system
   Bash
   docker-compose up --build -d 4. Sync the Database Schema
   Since the database starts empty in a new environment, you must push the Prisma schema to create the tables:
   Bash
   docker-compose exec matan-crm-app-1 npx prisma db push
   🌐 Access the Apps
   CRM Dashboard: http://localhost:3000

Database Management (Prisma Studio):
Bash
docker-compose exec matan-crm-app-1 npx prisma studio
Then visit: http://localhost:5555
