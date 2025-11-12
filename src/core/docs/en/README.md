# Core Layer

Core application layer containing shared functionalities, utilities, API services, authentication and configuration. Core is independent of business logic and can be used in any part of the application.

## Structure

```
src/core/
├── api/           # API clients, axios instance and React Query hooks
├── assets/        # Static assets (icons, images)
├── auth/          # Authentication, MSAL configuration and token management
├── config/        # Runtime application configuration
├── hooks/         # Shared React hooks
├── i18n/          # Internationalization and localization
├── lib/           # Shared libraries and definitions
├── messages/      # System messages and notifications
├── providers/     # React Context providers
├── stores/        # Global state management
├── tests/         # Test utilities and helpers
├── utils/         # Utility functions
└── index.ts       # Main export file
```

## Key Modules

### 🔗 API
Centralized server communication using Axios and React Query hooks.

### 🔐 Auth
Authentication for Azure AD and CSC with token management.

### ⚙️ Config
Runtime configuration, routes, environment variables and feature flags.

### 🎣 Hooks
Shared React hooks for localStorage, debounce and other common functionalities.

### 🛠️ Utils
Utility functions for file operations, tables and UI measurements.

## Principles

- **Independence from business logic** - everything is generic and reusable
- **Type safety** - fully typed with TypeScript
- **Stable API** - changes require careful impact assessment
- **Testability** - every module has tests

## Usage

```typescript
// Correct imports from core
import { apiClient } from '@/core/api'
import { useLocalStorage } from '@/core/hooks'
import { ROUTES } from '@/core/config'
```
