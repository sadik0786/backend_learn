# BACKEND + DATABASE + FRONTEND MASTER LEARNING SUMMARY

## Student
- Name: Sadik Ali
- Current profile: Senior UI Developer
- Goal: Become capable of building complete production-style full-stack applications independently.

## Target Stack

### Frontend
- JavaScript
- React.js
- TypeScript
- Next.js
- API integration
- Authentication UI
- Protected routes
- Forms and validation
- State management
- Production frontend practices

### Backend
- Node.js
- Express.js
- REST APIs
- MVC / modular architecture
- Authentication
- JWT
- Authorization / RBAC
- Validation
- Error handling
- Security
- File upload
- Transactions
- Advanced API design
- Testing
- Deployment

### Database
- PostgreSQL
- SQL
- Tables
- Constraints
- Functions
- Stored procedures
- Pagination
- Search
- Sorting
- Filtering
- Transactions
- Indexes
- Query optimization
- Relationships
- Production database design

### DevOps / Professional
- Git
- GitHub
- Environment variables
- API testing
- CI/CD
- Deployment
- Production configuration
- Logging
- Interview preparation

---

# CURRENT PROJECT

Database:
- my_next_app
- schema: auth

Backend architecture:

Client
↓
Routes
↓
Validation Middleware
↓
Controller
↓
Service
↓
Repository
↓
PostgreSQL

Error flow:

Controller/Service
↓
asyncHandler
↓
next(error)
↓
errorHandler
↓
HTTP response

---

# CURRENT BACKEND FOLDER STRUCTURE

src/
├── app.js
├── server.js
│
├── config/
│   └── db.js
│
├── middleware/
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── validate.middleware.js
│
├── modules/
│   ├── auth/
│   │   ├── auth.controller.js
│   │   ├── auth.repository.js
│   │   ├── auth.routes.js
│   │   ├── auth.service.js
│   │   └── auth.validation.js
│   │
│   └── users/
│       ├── user.controller.js
│       ├── user.repository.js
│       ├── user.routes.js
│       ├── user.service.js
│       └── user.validation.js
│
└── utils/
    ├── AppError.js
    ├── asyncHandler.js
    └── jwt.js

---

# COMPLETED THROUGH LECTURE 11

## Lecture 1 — Node.js fundamentals
Status: COMPLETED

## Lecture 2 — Express.js fundamentals
Status: COMPLETED

## Lecture 3 — Project structure / modular architecture
Status: COMPLETED

## Lecture 4 — PostgreSQL connection
Status: COMPLETED

## Lecture 5 — PostgreSQL schema, tables, functions and procedures
Status: COMPLETED

## Lecture 6 — Repository / Service / Controller / Routes
Status: COMPLETED

## Lecture 7 — Authentication foundation
Status: COMPLETED

Includes:
- bcrypt password hashing
- register
- login
- JWT generation
- profile
- auth middleware foundation

## Lecture 8 — User CRUD
Status: COMPLETED

Includes:
- create user
- get users
- get user by id
- update user
- delete user

## Lecture 9 — Pagination / Search / Sort / Filter
Status: COMPLETED

Includes:
- pagination
- pagination count
- search
- search count
- search + sort
- filter + search + sort + pagination

## Lecture 10 — Error handling / asyncHandler / AppError
Status: COMPLETED

## Lecture 11 — Zod validation
Status: COMPLETED

Includes:
- register validation
- login validation
- create user validation
- update user validation
- ID validation
- query validation

---

# IMPORTANT CURRENT CODE AUDIT

The current uploaded source code was audited before continuing.

## Already working / present

### JWT
`src/utils/jwt.js` already has:
- `generateToken`
- JWT_SECRET check
- id/email/role payload
- 1-day expiration

### Authentication middleware
`src/middleware/auth.middleware.js` already verifies JWT and puts decoded payload into:
`req.user`

### Profile
`GET /api/auth/profile` already uses the authentication middleware.

### asyncHandler
Most user controllers already use asyncHandler.

### Database
The auth SQL already contains:
- auth.users
- register procedure
- admin create-user procedure
- login function
- get-user function
- get-users function
- get-user-by-id function
- update procedure
- delete procedure
- pagination
- search
- sorting
- filtering

---

# BUGS / INCOMPLETE ITEMS FOUND

## 1. UPDATE route validation source bug

Current route uses:

validate(userIdSchema)
validate(updateUserSchema)

The first validation defaults to `body`, so the ID schema is incorrectly applied to `req.body`.

Correct:

validate(userIdSchema, "params")
validate(updateUserSchema, "body")

This must be fixed before continuing.

## 2. DELETE route has no ID validation

Current:
`router.delete("/:id", deleteUser)`

Should validate params with:
`validate(userIdSchema, "params")`

## 3. Login controller still uses try/catch

`login()` in auth.controller.js does not use asyncHandler.

## 4. Profile controller still uses try/catch

`profile()` in auth.controller.js does not use asyncHandler.

## 5. Role authorization is NOT implemented

JWT authentication exists, but there is no separate:
`authorizeRoles("admin")`

Therefore authentication and authorization are not yet complete.

## 6. User routes are currently not protected

The current user routes do not require JWT.

This means the CRUD/list APIs are not yet protected.

## 7. Database role constraint is missing

The database has a `role` VARCHAR with default `user`, but there is no database CHECK constraint limiting roles to `admin` and `user`.

Application Zod validation exists, but database-level defense should also be added.

## 8. Authentication header validation can be improved

Current middleware checks whether Authorization exists and then splits it.

It should explicitly require:
`Authorization: Bearer <token>`

## 9. JWT utility has only generateToken

A reusable `verifyToken()` utility should be added, so token verification logic is centralized.

## 10. Pagination route validation is inconsistent

The pagination endpoint does not currently use the query validation schema.

## 11. Search endpoint validation is inconsistent

The basic `/search` endpoint does not currently use query validation.

---

# CURRENT NEXT LECTURE

## Lecture 12 — Authorization / Role-Based Access Control

This is the correct next lecture.

Do NOT repeat:
- register
- login
- JWT generation
- basic authentication
- CRUD
- pagination
- search
- sorting
- filtering
- Zod basics

---

# LECTURE 12 — RBAC

Goal:

Authentication:
"Who are you?"

Authorization:
"What are you allowed to do?"

Implement:
- role middleware
- admin-only APIs
- authenticated APIs
- 401 vs 403
- database role constraint
- protected user routes
- admin testing
- normal-user testing

Files:
- src/middleware/role.middleware.js (new)
- src/middleware/auth.middleware.js
- src/modules/users/user.routes.js
- src/modules/auth/auth.routes.js
- src/modules/auth/auth.controller.js
- src/modules/auth/auth.service.js
- src/modules/auth/auth.repository.js
- src/modules/users/user.routes.js
- src/modules/users/user.validation.js
- auth_schema.sql / database

Core middleware:

authorizeRoles(...allowedRoles)

Rules:
- no token -> 401
- invalid token -> 401
- valid token but wrong role -> 403
- valid admin -> continue

Use lowercase roles consistently:
- admin
- user

If existing data contains Admin/User, normalize it before testing.

---

# LECTURE 13 — API SECURITY

After RBAC:

- Helmet
- CORS
- request body limits
- safe HTTP headers
- environment secrets
- password security
- SQL injection awareness
- parameterized queries
- authentication error handling
- authorization checks
- rate limiting
- brute-force protection
- sensitive response protection
- production error responses
- logging basics

---

# LECTURE 14 — POSTGRESQL ADVANCED + TRANSACTIONS

After security:

- database transactions
- BEGIN
- COMMIT
- ROLLBACK
- pool connection
- transaction helper
- multi-step operations
- foreign keys
- relationships
- indexes
- EXPLAIN
- query optimization
- atomic operations

Example concept:

BEGIN
↓
INSERT
↓
INSERT
↓
UPDATE
↓
COMMIT

If any step fails:
ROLLBACK

---

# PENDING BACKEND ROADMAP

15. File upload
16. Advanced PostgreSQL relationships
17. Transactions deeper
18. API testing / automated tests
19. Production logging
20. API documentation
21. Production-ready Express architecture
22. Backend deployment

---

# PENDING FRONTEND ROADMAP

After backend fundamentals are solid:

1. React API integration
2. TypeScript API types
3. Axios/fetch
4. Login UI
5. Register UI
6. Token handling
7. Protected routes
8. Auth context/state
9. User CRUD UI
10. Pagination UI
11. Search UI
12. Filter UI
13. Sorting UI
14. Role-based UI
15. Error/loading states
16. Form validation
17. File upload UI
18. Next.js frontend integration
19. Server/client component decisions
20. Production frontend practices

---

# FULL-STACK INTEGRATION

Final architecture:

Next.js / React
↓
API Client
↓
Express REST API
↓
Auth Middleware
↓
Role Middleware
↓
Controller
↓
Service
↓
Repository
↓
PostgreSQL

---

# DEVOPS ROADMAP

After full-stack integration:

1. Git fundamentals
2. Branching
3. Pull requests
4. Environment variables
5. GitHub
6. CI
7. CD
8. Build
9. Test
10. Deploy backend
11. Deploy frontend
12. Database deployment
13. Production environment
14. Domain
15. HTTPS
16. Monitoring basics

---

# FINAL PROJECT

Build one complete production-style application using:

Next.js
+
TypeScript
+
Node.js
+
Express
+
PostgreSQL

Features:

- Register
- Login
- JWT
- Refresh/auth strategy
- Logout
- Protected routes
- RBAC
- Admin dashboard
- User management
- CRUD
- Search
- Filter
- Sort
- Pagination
- File upload
- Validation
- Error handling
- Transactions
- Security
- Testing
- Git
- CI/CD
- Deployment

---

# TEACHING RULES

1. Do not skip steps.
2. Do not skip files.
3. Do not skip methods.
4. Do not skip SQL.
5. Explain in simple Hinglish.
6. Give exact file path.
7. Give exact code.
8. Explain why the code is needed.
9. Give testing steps.
10. Give expected response.
11. Do not repeat completed lectures.
12. Before a new lecture, audit the current code.
13. If existing code conflicts with the plan, explain first.
14. Do not silently overwrite working code.
15. Prefer stable additions over unnecessary renaming.
16. Complete 2-3 lectures together when requested.
17. Wait for "done" before moving ahead unless the user explicitly asks for multiple lectures.
18. Always maintain COMPLETED / CURRENT / PENDING.
19. Backend, database and frontend must all be completed.
20. The final goal is independent full-stack development.

---

# CONTINUE INSTRUCTION

When this file is provided in a new chat:

1. Read this entire file.
2. Read the current source code if provided.
3. Compare actual code with this status.
4. Do not repeat completed topics.
5. Start from CURRENT NEXT LECTURE.
6. Tell me what will be changed.
7. Teach step-by-step.
8. After completion update the progress.

CURRENT:
Lecture 11 completed.

NEXT:
Lecture 12 — Role-Based Authorization / RBAC.

DO NOT START FROM AUTHENTICATION AGAIN.
