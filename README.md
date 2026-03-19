# 🌸 Cycle Tracker

A women's health cycle tracking app built with Next.js, Prisma, Clerk, and Railway.

## Live URL
cycle-tracker-production.up.railway.app

## Tech Stack
- Framework: Next.js (App Router)
- Database: PostgreSQL on Railway
- ORM: Prisma 5
- Auth: Clerk (RBAC with User/Admin roles)
- Styling: Tailwind CSS
- Hosting: Railway

## Features
- Log and track menstrual cycles
- Symptom tracking with mood logging
- Personal notes per cycle
- Calendar view with period predictions
- Admin dashboard with user management

## Roles
- **User** — can log cycles, symptoms, notes, view their own data only
- **Admin** — all user features plus admin dashboard at /admin

## Local Setup
1. Clone the repo
2. Run `npm install`
3. Copy `.env.example` to `.env` and fill in values
4. Run `npx prisma migrate dev`
5. Run `npm run dev`

## Assign Admin Role
Clerk Dashboard → Users → select user → 
Public metadata: `{ "role": "admin" }`
