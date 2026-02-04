# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Vite) at localhost:5173
npm run build    # TypeScript check + Vite build
npm run lint     # ESLint
npm run preview  # Preview production build
```

## Architecture

This is a React 19 admin panel for managing D&D adventures, built with Vite, TypeScript, and MUI v7.

### Backend Integration
- API proxy configured in `vite.config.ts`: `/api` and `/files` routes proxy to `http://localhost:8080` (Spring Boot backend)
- Authentication uses HTTP Basic Auth stored in localStorage (`basicAuth` key)
- All API calls go through `src/api/fetchWithAuth.ts` which attaches the auth header

### Directory Structure
- `src/api/` - Service modules (AdventureService, UserService, etc.) with CRUD operations
- `src/types/` - TypeScript interfaces for DTOs and enums (Adventure, User, GameSession, etc.)
- `src/pages/` - Route components (List, Form, Details patterns)
- `src/components/` - Shared components (AuthGuard, NavigationBar, SortableHeader)
- `src/theme/muiTheme.ts` - MUI theme with custom colors and typography

### Key Patterns
- **PageResponse<T>**: Standard paginated API response format with `content`, `page`, `size`, `totalElements`, `totalPages`
- **DTO naming**: `*Dto` for read, `*CreateDto` for create, `*PatchDto` for partial updates
- **Auth flow**: `AuthGuard` component redirects to `/login` if no `basicAuth` in localStorage
- **Routes**: All protected routes wrapped in `AuthGuard`, defined in `App.tsx`

### Domain Types
- **Adventure**: ONESHOT | MULTISHOT | CAMPAIGN with statuses PLANNED | RECRUITING | IN_PROGRESS | COMPLETED | CANCELLED
- **User roles**: PLAYER | DUNGEON_MASTER | ADMIN
- **GameSession**: Scheduled sessions linked to adventures
- **AdventureSignup**: Player registrations with status PENDING | APPROVED | CANCELED
