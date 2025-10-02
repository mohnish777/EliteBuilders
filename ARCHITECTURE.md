# EliteBuilders - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                      │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Landing   │  │   Login    │  │   Signup   │            │
│  │    Page    │  │    Page    │  │    Page    │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│                                                              │
│  ┌────────────────────────────────────────────────┐         │
│  │         Protected Routes (Auth Required)        │         │
│  │                                                 │         │
│  │  ┌──────────────┐      ┌──────────────┐       │         │
│  │  │   Builder    │      │     Host     │       │         │
│  │  │  Dashboard   │      │  Dashboard   │       │         │
│  │  └──────────────┘      └──────────────┘       │         │
│  └────────────────────────────────────────────────┘         │
│                                                              │
│  ┌────────────────────────────────────────────────┐         │
│  │            React Context (State)                │         │
│  │  • AuthContext (user, session, auth methods)   │         │
│  └────────────────────────────────────────────────┘         │
│                                                              │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       │ Supabase Client
                       │
┌──────────────────────▼───────────────────────────────────────┐
│                    SUPABASE (Backend)                        │
│                                                              │
│  ┌────────────────────────────────────────────────┐         │
│  │              Authentication                     │         │
│  │  • Email/Password Auth                         │         │
│  │  • Session Management                          │         │
│  │  • User Metadata (user_type)                   │         │
│  └────────────────────────────────────────────────┘         │
│                                                              │
│  ┌────────────────────────────────────────────────┐         │
│  │              PostgreSQL Database                │         │
│  │                                                 │         │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐    │         │
│  │  │ profiles │  │challenges│  │submissions│    │         │
│  │  └──────────┘  └──────────┘  └──────────┘    │         │
│  │                                                 │         │
│  │  • Row Level Security (RLS) Enabled            │         │
│  │  • Real-time Subscriptions Ready               │         │
│  └────────────────────────────────────────────────┘         │
│                                                              │
│  ┌────────────────────────────────────────────────┐         │
│  │              Storage (Future)                   │         │
│  │  • Demo Videos                                  │         │
│  │  • User Avatars                                 │         │
│  └────────────────────────────────────────────────┘         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Data Flow

### Authentication Flow
```
User Action (Signup/Login)
    ↓
AuthContext.signIn/signUp()
    ↓
Supabase Auth API
    ↓
Create Session + JWT Token
    ↓
Store in Browser (localStorage)
    ↓
Update AuthContext State
    ↓
Redirect to Dashboard
```

### Protected Route Flow
```
User Navigates to /builder/dashboard
    ↓
ProtectedRoute Component
    ↓
Check AuthContext.user
    ↓
If null → Redirect to /login
If exists → Render Dashboard
```

### Data Fetching Flow (Future)
```
Component Mounts
    ↓
useEffect Hook
    ↓
supabase.from('table').select()
    ↓
Check RLS Policies
    ↓
Return Filtered Data
    ↓
Update Component State
    ↓
Render UI
```

## Component Hierarchy

```
App (Router)
├── AuthProvider (Context)
│   ├── LandingPage
│   ├── Login
│   ├── Signup
│   └── ProtectedRoute
│       ├── BuilderDashboard
│       └── HostDashboard
```

## Database Schema

### profiles
```sql
id                UUID (PK, FK to auth.users)
role              TEXT ('builder' | 'host')
company_name      TEXT (optional)
github_username   TEXT (optional)
created_at        TIMESTAMP
```

### challenges
```sql
id                UUID (PK)
title             TEXT
description       TEXT
duration_hours    INTEGER
host_id           UUID (FK to profiles)
status            TEXT (default: 'active')
created_at        TIMESTAMP
```

### submissions
```sql
id                UUID (PK)
challenge_id      UUID (FK to challenges)
builder_id        UUID (FK to profiles)
github_url        TEXT
demo_video_url    TEXT
llm_score         INTEGER (default: 0)
created_at        TIMESTAMP
```

## Security Model

### Row Level Security (RLS) Policies

**profiles**
- Users can view their own profile
- Users can update their own profile
- Users can insert their own profile (on signup)

**challenges**
- Anyone can view active challenges
- Hosts can view their own draft challenges
- Hosts can create challenges
- Hosts can update their own challenges

**submissions**
- Builders can view their own submissions
- Hosts can view submissions to their challenges
- Builders can create submissions
- Builders can update their own submissions

## Tech Stack Details

### Frontend
- **React 18.2**: UI library
- **TypeScript 5.2**: Type safety
- **Vite 5.0**: Build tool (fast HMR)
- **React Router 6**: Client-side routing
- **Tailwind CSS 3.4**: Utility-first styling
- **Lucide React**: Icon library

### Backend (Supabase)
- **PostgreSQL**: Database
- **PostgREST**: Auto-generated REST API
- **GoTrue**: Authentication service
- **Realtime**: WebSocket subscriptions
- **Storage**: File uploads (S3-compatible)

### Development Tools
- **ESLint**: Code linting
- **TypeScript**: Type checking
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixes

## Environment Variables

```
VITE_SUPABASE_URL          # Supabase project URL
VITE_SUPABASE_ANON_KEY     # Supabase anonymous key (public)
```

## API Endpoints (Auto-generated by Supabase)

```
GET    /rest/v1/profiles
POST   /rest/v1/profiles
PATCH  /rest/v1/profiles?id=eq.{id}
DELETE /rest/v1/profiles?id=eq.{id}

GET    /rest/v1/challenges
POST   /rest/v1/challenges
PATCH  /rest/v1/challenges?id=eq.{id}
DELETE /rest/v1/challenges?id=eq.{id}

GET    /rest/v1/submissions
POST   /rest/v1/submissions
PATCH  /rest/v1/submissions?id=eq.{id}
DELETE /rest/v1/submissions?id=eq.{id}

POST   /auth/v1/signup
POST   /auth/v1/token?grant_type=password
POST   /auth/v1/logout
```

## Future Integrations

### LLM Scoring (Phase 3)
```
Submission Created
    ↓
Supabase Edge Function Triggered
    ↓
Fetch GitHub Repo
    ↓
Send to OpenAI/Claude API
    ↓
Receive Score + Feedback
    ↓
Update Submission Record
    ↓
Trigger Notification
```

### Real-time Leaderboard
```
Submission Score Updated
    ↓
Supabase Realtime Event
    ↓
Frontend Subscription Receives Update
    ↓
Re-calculate Rankings
    ↓
Update UI (No Refresh Needed)
```

## Performance Considerations

### Current
- ✅ Code splitting (React Router)
- ✅ Tree shaking (Vite)
- ✅ CSS purging (Tailwind)
- ✅ Fast refresh (HMR)

### Future Optimizations
- [ ] Image optimization
- [ ] Lazy loading components
- [ ] Memoization (React.memo)
- [ ] Virtual scrolling (large lists)
- [ ] Service worker (PWA)
- [ ] CDN for static assets

## Deployment Architecture (Future)

```
GitHub Repository
    ↓
Push to main branch
    ↓
Vercel CI/CD
    ↓
Build & Deploy
    ↓
Edge Network (CDN)
    ↓
Users Worldwide
```

## Monitoring & Analytics (Future)

- **Sentry**: Error tracking
- **Vercel Analytics**: Performance monitoring
- **Supabase Dashboard**: Database metrics
- **Google Analytics**: User behavior

---

This architecture is designed to scale from hackathon prototype to production-ready platform while maintaining simplicity and developer experience.

