# Core Layer

Core vrstva obsahuje základní funkcionality a sdílené komponenty aplikace, které jsou používány napříč celou aplikací.

## Struktura

```
core/
├── api/           # API klienti a služby
├── auth/          # Autentizace a security služby
├── config/        # Runtime konfigurace aplikace
├── hooks/         # Sdílené React hooks
├── i18n/          # Internacionalizace
├── lib/           # Sdílené knihovny a definice
├── utils/         # Utility funkce
└── index.ts       # Hlavní export soubor
```

## Moduly

### 🔧 Config

- **Účel**: Runtime konfigurace aplikace
- **Obsahuje**:
  - Definice routes (`ROUTES`)
  - Environment konfigurace (`ENVIRONMENTS`)
  - Breakpointy pro responsive design
  - Helper funkce pro prostředí (`isProd()`, `isDev()`)

### 🔗 API

- **Účel**: API klienti a komunikace se serverem
- **Obsahuje**:
  - Axios instance s konfigurací
  - React Query hooks pro data fetching
  - API service definice

### 🔐 Auth

- **Účel**: Autentizace a bezpečnostní služby
- **Obsahuje**:
  - MSAL konfigurace pro Azure AD
  - Token management
  - Local storage utilities
  - User role management

### 🎣 Hooks

- **Účel**: Sdílené React hooks
- **Obsahuje**:
  - `useCSCAuth` - CSC autentizace
  - `useLocalStorage` - Local storage management
  - `useRequestAuth` - Request autentizace
  - `useSyncScroll` - Synchronizace scrollování

### 🌐 i18n

- **Účel**: Internacionalizace aplikace
- **Obsahuje**:
  - Konfigurace pro next-intl
  - Request handling pro lokalizaci

### 📚 Lib

- **Účel**: Sdílené knihovny a definice
- **Obsahuje**:
  - TypeScript definice
  - OpenAPI specifikace
  - Environment variables
  - Utility typy

### 🛠️ Utils

- **Účel**: Utility funkce
- **Obsahuje**:
  - File operations
  - Text width calculations
  - Error handling
  - Table utilities

## Použití

### Import z Core vrstvy

```typescript
// Import konkrétního modulu
import { ROUTES, getCurrentEnvironment } from '@core/config';
import { useCSCAuth } from '@core/hooks';
import { getFromLocalStorage } from '@core/auth';

// Nebo import z hlavního index
import { ROUTES, useCSCAuth, getFromLocalStorage } from '@core';
```

### Pravidla

1. **Žádné cross-dependencies**: Core moduly nesmí záviset na business doménách
2. **Pouze sdílená funkcionalita**: Vše v Core vrstvě musí být použitelné napříč aplikací
3. **Stabilní API**: Změny v Core vrstvě ovlivňují celou aplikaci

## TypeScript Path Mapping

Ujistěte se, že máte nakonfigurované path mapping v `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@core/*": ["./src/core/*"]
    }
  }
}
```

## Testování

Core vrstva by měla mít vysoké pokrytí testy, protože se jedná o kritickou infrastrukturu aplikace.

```bash
# Spuštění testů pro Core vrstvu
npm test src/core
```

---

**Poznámka**: Tato vrstva je základem pro škálovatelnou architekturu a připravu na monorepo řešení.
