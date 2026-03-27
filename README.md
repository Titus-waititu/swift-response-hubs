# Smart Accident Reporting System Frontend

Frontend application for the Smart Accident Reporting System (SRS). This app provides a public accident intake flow, a dispatcher workspace, and a responder workspace, with backend integration for authentication, accident creation, accident retrieval, and lifecycle status updates.

## Overview

The frontend is built as a role-based operational interface:

- Public users can submit accident reports
- Dispatchers can review and manage the accident queue
- Responders can view open and completed accidents
- The UI is aligned to the backend accident lifecycle:
  - `Submitted`
  - `Under Review`
  - `Resolved`
  - `Closed`

Where the backend does not yet support richer workflow features, the frontend has been simplified to match the real API contract rather than simulate unsupported behavior.

## Current Scope

### Public Intake

- Structured accident reporting flow
- Reporter details, severity, description, location, injuries, and vehicles
- GPS capture from the browser
- Backend-first submission with local fallback if the API is unavailable

### Dispatcher Workspace

- Login-gated dispatcher dashboard
- Queue, map, and analytics views
- Accident search and status filtering
- Accident detail review
- Backend status synchronization

### Responder Workspace

- Login-gated responder dashboard
- Open and completed accident views
- Read-only accident detail view aligned to current backend support

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS
- shadcn/ui
- Radix UI
- TanStack Query
- Vitest
- ESLint

## Project Structure

```text
src/
  components/
    dispatcher/
    responder/
    ui/
  context/
    IncidentStore.tsx
  data/
    mockIncidents.ts
  lib/
    backend-api.ts
    incident-analytics.ts
    incident-utils.ts
  pages/
    LandingPage.tsx
    ReportPage.tsx
    DispatcherPage.tsx
    ResponderPage.tsx
  test/
    incident-analytics.test.ts
  types/
    incident.ts
```

## Backend Integration

This frontend is wired to the SmartResponse API and expects the backend to run on:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

Configured frontend API behaviors:

- `POST /auth/signin`
- `POST /users`
- `POST /accidents/report`
- `POST /accidents` as a fallback when the AI/upload report path is unavailable
- `GET /accidents`
- `PATCH /accidents/:id/status`

The frontend includes a pragmatic bridge in `src/lib/backend-api.ts` that:

- creates prototype users when login is attempted for a non-existent user
- maps backend accident records into the frontend model
- falls back to local accident storage when backend submission fails

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- SmartResponse API running locally if you want live backend integration

### Installation

```bash
git clone https://github.com/arigavincent/swift-response-hub.git
cd swift-response-hub
npm ci
```

### Environment

Create a local environment file:

```bash
cp .env.example .env
```

Default frontend environment:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### Development

```bash
npm run dev
```

By default Vite will start on its first available port, commonly `5173`.

### Production Build

```bash
npm run build
npm run preview
```

## Available Scripts

- `npm run dev` starts the Vite development server
- `npm run build` creates a production build
- `npm run preview` previews the production build locally
- `npm run lint` runs ESLint
- `npm run test` runs the Vitest suite
- `npm run test:watch` runs tests in watch mode

## Routes

- `/` landing page
- `/report` public accident reporting flow
- `/dispatcher` dispatcher login and dashboard
- `/responder` responder login and dashboard

## Testing and Quality

Current verification workflow:

```bash
npm run test
npm run lint
npm run build
```

The project currently includes analytics-focused tests and standard lint/build checks.

## Design Notes

- Branding uses the SRS logo in the app header and favicon
- The landing page, report page, dispatcher page, and responder page have all been refined beyond the original scaffold
- Role surfaces use isolated navigation so each workspace only shows relevant actions

## Known Limitations

- Some internal code symbols still use `Incident` naming even though the visible product language now uses `Accident`
- The backend does not yet support the richer responder field workflow from the original prototype
- End-to-end functionality depends on the SmartResponse API, PostgreSQL, and Redis being correctly configured and running

## Related Backend

Backend repository:

- `https://github.com/Titus-waititu/SmartResponse-api.git`

## License

This repository currently does not declare a separate license file. Add one if you intend to distribute or open-source it formally.
