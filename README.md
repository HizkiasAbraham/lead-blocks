# LeadBlocks Mini Dashboard

A full-stack dashboard application for managing leads with company associations, built as a technical assessment project.

## 🌐 Demo

**Live Demo:** [https://lead-blocks.vercel.app/](https://lead-blocks.vercel.app/)

**Default Credentials:**
- Email: `admin@leadblocks.com`
- Password: `Pass12@rd!`

## 📋 Overview

This project is a mini dashboard that fetches, displays, and allows filtering of lead data. It includes a React frontend with TypeScript and Tailwind CSS, and an Express.js backend with SQLite database.

## ✨ Features Implemented

### Frontend (React + TypeScript + Tailwind)
- ✅ **Overview page with table**: Displays leads with Name, Company, Email, and Status columns
- ✅ **Status filtering**: Filter leads by status (Active, Inactive, Contacted, Qualified, Proposal, Negotiation, Converted, Lost)
- ✅ **Create Lead Modal**: Modal form to add new leads with validation
- ✅ **Update Lead Modal**: Edit existing leads with pre-populated form
- ✅ **Routing**: React Router with protected routes and authentication
- ✅ **Authentication**: Login page with JWT-based authentication
- ✅ **Companies Management**: Separate page for managing companies
- ✅ **Pagination**: Server-side pagination for leads and companies
- ✅ **Loading States**: Indefinite loading bar component
- ✅ **Error Handling**: Alert components for error messages
- ✅ **Responsive Design**: Mobile-friendly layout with Tailwind CSS
- ✅ **TanStack Table**: Modern table implementation with sorting and filtering

### Backend (Express.js + TypeScript + SQLite)
- ✅ **REST API Endpoints**:
  - `GET /api/leads` - List all leads with pagination and status filtering
  - `GET /api/leads/:id` - Get single lead
  - `POST /api/leads` - Create new lead
  - `PUT /api/leads/:id` - Update lead
  - `DELETE /api/leads/:id` - Delete lead
  - `GET /api/companies` - List all companies with pagination
  - `POST /api/companies` - Create new company
  - `PUT /api/companies/:id` - Update company
  - `DELETE /api/companies/:id` - Delete company
  - `POST /api/login` - User authentication
- ✅ **SQLite Database**: Persistent data storage with proper schema
- ✅ **Authentication**: JWT-based authentication with bcrypt password hashing
- ✅ **Database Relations**: Foreign key relationship between leads and companies
- ✅ **Pagination**: Server-side pagination with configurable page size
- ✅ **Error Handling**: Comprehensive error responses with appropriate HTTP status codes
- ✅ **CORS**: Configured for cross-origin requests

### Bonus Features
- ✅ **Authentication**: Full login system with JWT tokens
- ✅ **Deployment Ready**: 
  - Frontend configured for Vercel deployment
  - Backend configured with PM2 for production
  - Environment variable configuration
- ✅ **Visual Polish**: 
  - LeadBlocks-inspired color scheme
  - Smooth animations and transitions
  - Status badges with color coding
  - Modern UI components (Cards, Modals, Buttons, Inputs)
  - Loading states and error handling

## 🏗️ Architecture Decisions

### Why Express.js instead of Strapi?
- **Flexibility**: Full control over API structure and business logic
- **Performance**: Lightweight and fast for this use case
- **TypeScript**: Better type safety throughout the stack
- **SQLite**: Simple, file-based database perfect for this assignment
- **Learning**: Demonstrates understanding of REST API design from scratch

### Why SQLite?
- **Simplicity**: No separate database server needed
- **Portability**: Database file can be easily backed up and moved
- **Performance**: Fast for small to medium datasets
- **Zero Configuration**: Works out of the box

### Why TanStack Table?
- **Modern**: Industry-standard table library
- **Flexible**: Easy to extend with custom columns and filters
- **Performance**: Virtual scrolling and efficient rendering
- **TypeScript**: Excellent type support

### Why JWT Authentication?
- **Stateless**: No server-side session storage needed
- **Scalable**: Works well with multiple servers
- **Standard**: Industry-standard authentication method
- **Secure**: Tokens can be validated without database lookups

### File Structure
```
leadblocks/
├── backend/
│   ├── src/
│   │   ├── auth/          # Authentication logic
│   │   ├── controllers/    # API route handlers
│   │   ├── db/            # Database configuration
│   │   ├── middlewares/   # Auth middleware
│   │   └── index.ts       # Express server
│   ├── data/              # SQLite database (gitignored)
│   ├── ecosystem.config.cjs  # PM2 configuration
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/           # API client
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React contexts (Auth)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page components
│   │   └── main.tsx       # App entry point
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set:
   ```
   PORT=3000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

4. **Build the project:**
   ```bash
   npm run build
   ```

5. **Start the server:**
   ```bash
   # Development mode (with hot reload)
   npm run dev
   
   # Production mode
   npm start
   
   # With PM2 (production)
   npm run start:pm2
   ```

The backend will run on `http://localhost:3000` by default.

**Default Admin Credentials** (same as demo):
- Email: `admin@leadblocks.com`
- Password: `Pass12@rd!`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file (optional for local dev):**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` if you need to change the API URL:
   ```
   VITE_API_BASE_URL=http://localhost:3000
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy).

### Database

The SQLite database is automatically created at `backend/data/app.db` on first run. The schema includes:
- **users**: User accounts for authentication
- **companies**: Company information
- **leads**: Lead information with foreign key to companies

A default admin user is automatically seeded if the users table is empty.

## 📚 API Documentation

### Authentication

**POST /api/login**
```json
{
  "email": "admin@leadblocks.com",
  "password": "Pass12@rd!"
}
```

Response:
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "email": "admin@leadblocks.com",
    "full_name": "Laura Dechesne"
  }
}
```

### Leads

**GET /api/leads?page=1&pageSize=10&status=active**
- Query params: `page`, `pageSize`, `status` (optional)

**GET /api/leads/:id**
- Returns single lead with associated company

**POST /api/leads**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "companyId": 1,
  "status": "active"
}
```

**PUT /api/leads/:id**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "companyId": 1,
  "status": "active"
}
```

**DELETE /api/leads/:id**

### Companies

**GET /api/companies?page=1&pageSize=10**

**POST /api/companies**
```json
{
  "name": "Acme Corp",
  "description": "Company description"
}
```

**PUT /api/companies/:id**

**DELETE /api/companies/:id**

All endpoints (except `/api/login`) require authentication via `Authorization: Bearer <token>` header.

## 🎨 Design Decisions

### Color Scheme
- Primary color: Indigo (matching LeadBlocks branding)
- Status colors: Color-coded badges for visual clarity
- Clean, modern interface with proper spacing

### Component Architecture
- Reusable components (Button, Input, Select, Modal, Table, Card)
- Consistent styling with Tailwind CSS
- Responsive design with mobile-first approach

### State Management
- React Context for authentication state
- Local state for forms and UI
- Custom `useApi` hook for API calls with loading/error states

## 🔧 What I Would Do Differently with More Time

1. **Testing**
   - Add unit tests for backend controllers and utilities
   - Add integration tests for API endpoints
   - Add frontend component tests with React Testing Library
   - Add E2E tests with Playwright or Cypress

2. **Error Handling**
   - More granular error messages
   - Retry logic for failed API calls
   - Better error boundaries in React
   - User-friendly error messages

3. **Performance**
   - Implement caching for frequently accessed data
   - Add database indexes for better query performance
   - Implement virtual scrolling for large datasets
   - Optimize bundle size with code splitting

4. **Features**
   - Search functionality for leads and companies
   - Bulk operations (delete multiple leads)
   - Export functionality (CSV, PDF)
   - Advanced filtering (date ranges, company filters)
   - Activity log/audit trail
   - User roles and permissions
   - Email notifications

5. **Code Quality**
   - More comprehensive TypeScript types
   - Input validation library (Zod or Yup)
   - API response validation
   - Better separation of concerns
   - More reusable utility functions

6. **Security**
   - Rate limiting on API endpoints
   - Input sanitization
   - CSRF protection
   - Password strength requirements
   - Account lockout after failed attempts

7. **DevOps**
   - CI/CD pipeline (GitHub Actions)
   - Automated testing in CI
   - Database migrations system
   - Health check endpoints
   - Monitoring and logging (Sentry, DataDog)

8. **Documentation**
   - API documentation with Swagger/OpenAPI
   - Component Storybook
   - More inline code comments
   - Architecture decision records

## 📦 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variable: `VITE_API_BASE_URL` to your backend URL
3. Deploy automatically on push to main branch

### Backend (EC2/PM2)
1. Build the project: `npm run build`
2. Set environment variables in `.env` file
3. Start with PM2: `pm2 start ecosystem.config.cjs --env production`
4. Setup auto-start: `pm2 startup && pm2 save`

**Note**: For production, ensure:
- Strong `JWT_SECRET` is set
- Database is backed up regularly
- HTTPS is configured (see SSL setup options)
- Security groups allow necessary ports

## 🛠️ Technologies Used

### Frontend
- React 19
- TypeScript
- Tailwind CSS
- React Router
- TanStack Table
- Vite

### Backend
- Node.js
- Express.js
- TypeScript
- SQLite (better-sqlite3)
- JWT (jsonwebtoken)
- bcryptjs
- PM2

## 📝 Notes

- The database file (`backend/data/app.db`) is gitignored and will be created on first run
- Default admin user is automatically created if no users exist
- All API endpoints require authentication except `/api/login`
- CORS is enabled for development; configure properly for production
- PM2 configuration is included for production deployment

## ⏱️ Time Spent

This project took approximately **10 hours** to complete, including:
- Planning and architecture decisions
- Backend API development with SQLite
- Frontend development with React and TypeScript
- Authentication implementation
- UI/UX design and polish
- Testing and debugging
- Documentation

## 👤 Author

Built as a technical assessment for LeadBlocks.

## 📄 License

This project was created as part of a technical assessment.

