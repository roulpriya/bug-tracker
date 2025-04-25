# Bug Tracker Application

A full-featured bug tracking application built with Next.js, Prisma, and NextAuth.

## Features

- 🔐 Secure authentication with Google and GitHub OAuth
- 🏢 Organization management
- 📋 Project organization
- 🐛 Issue tracking with labels and status
- 👤 User profiles
- 💬 Comments and discussions
- 👑 Role-based permissions

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: SQLite (Prisma ORM)
- **Authentication**: NextAuth.js

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/bug-tracker.git
   cd bug-tracker
   ```

2. Install dependencies
   ```
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory with the following:
   ```
   DATABASE_URL="file:./prisma/dev.db"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   ```

4. Initialize the database
   ```
   npx prisma migrate dev
   ```

5. Start the development server
   ```
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

