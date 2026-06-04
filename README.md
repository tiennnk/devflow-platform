# devflow-platform

DevFlow Platform by tiennnk (Tien Nguyen)

## What This Project Includes

- **Backend Framework:** NestJS (Node.js) with TypeScript, modular architecture.

- **Frontend:** Next.js 16, React 19, Tailwind CSS, Lucide React icons, fully responsive UI.

- **Authentication:** JWT-based login and registration, Passport.js, bcrypt password hashing, access control via guards.

- **Task Management:** Create, update, delete tasks with status tracking (TODO / IN_PROGRESS / DONE), per-user ownership.

- **Real-time Updates:** WebSocket (Socket.IO) broadcasts task created, updated, and deleted events to all connected clients.

- **Queue Processing:** BullMQ + Redis for async task event processing and background jobs.

- **Internationalization:** Multi-language support (Vietnamese / English) using next-intl with JSON language files.

- **API Documentation:** Swagger (OpenAPI) auto-generated from decorators, accessible at `/api`.

- **Database:** PostgreSQL with TypeORM for entity management and optimized queries.

- **Logging:** Winston + nest-winston for structured application logging.

- **State Management:** Zustand for global state, TanStack React Query for server state and caching.

- **Docker:** Dockerfile and docker-compose for backend, frontend, PostgreSQL, and Redis environments.

- **CI/CD:** GitHub Actions workflow for automated testing and build validation.
