# School Management System

A comprehensive school management system built with Next.js, PostgreSQL, and Prisma.

## Features

- **Role-based Authentication**: Admin, Teacher, and Student roles
- **Student Dashboard**: View homework, exam results, attendance, and fees
- **Teacher Dashboard**: Manage classes, create homework, mark attendance, and enter exam results
- **Admin Dashboard**: Manage announcements, holidays, classes, and view statistics
- **Public Homepage**: View announcements, upcoming exams, and holidays

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT with bcrypt
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

## Setup Instructions

1. **Clone the repository** (if applicable)

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/school_management?schema=public"
   JWT_SECRET="your-secret-key-change-in-production"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Set up the database**:
   ```bash
   # Generate Prisma Client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Or run migrations
   npm run db:migrate
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The database includes the following main tables:
- `profiles` - User profiles with authentication
- `students` - Student information
- `teachers` - Teacher information
- `classes` - Class information
- `homework` - Homework assignments
- `exams` - Exam schedules
- `exam_results` - Exam results
- `attendance` - Attendance records
- `fees` - Fee records
- `announcements` - School announcements
- `holidays` - Holiday calendar
- `notifications` - User notifications
- `gallery` - Image gallery

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   └── auth/         # Authentication endpoints
│   ├── admin-dashboard/   # Admin dashboard page
│   ├── teacher-dashboard/ # Teacher dashboard page
│   ├── student-dashboard/ # Student dashboard page
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── role-selection/    # Role selection page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── AuthProvider.tsx   # Authentication context
│   ├── Header.tsx        # Navigation header
│   └── PublicHome.tsx    # Public homepage
├── lib/                   # Utility functions
│   ├── auth.ts           # Authentication utilities
│   └── db.ts             # Prisma client
└── types/                # TypeScript types
    └── index.ts          # Type definitions

prisma/
└── schema.prisma         # Prisma schema
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## Authentication

The system uses JWT-based authentication with bcrypt for password hashing. Users can:
- Sign up as Teacher or Student (Admin accounts must be created manually)
- Login with email and password
- Access role-specific dashboards

## Notes

- Admin accounts cannot be created through the signup page
- All passwords are hashed using bcrypt
- JWT tokens are stored in HTTP-only cookies
- The database schema is defined in `prisma/schema.prisma`

## License

This project is private and proprietary.

