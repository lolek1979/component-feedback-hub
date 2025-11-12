# Core Layer

Základní vrstva aplikace obsahující sdílené funkcionality, utilities, API služby, autentizaci a konfiguraci. Core je nezávislý na business logice a může být použit v jakékoliv části aplikace.

## Struktura

```
src/core/
├── api/           # API klienti, axios instance a React Query hooks
├── assets/        # Statické assety (ikony, obrázky)
├── auth/          # Autentizace, MSAL konfigurace a token management
├── config/        # Runtime konfigurace aplikace
├── hooks/         # Sdílené React hooks
├── i18n/          # Internacionalizace a lokalizace
├── lib/           # Sdílené knihovny a definice
├── messages/      # Systémové zprávy a notifikace
├── providers/     # React Context providers
├── stores/        # Globální správa stavu
├── tests/         # Test utilities a helpery
├── utils/         # Utility funkce
└── index.ts       # Hlavní export soubor
```

## Klíčové moduly

### 🔗 API
Centralizovaná komunikace se serverem pomocí Axios a React Query hooks.

### 🔐 Auth
Autentizace pro Azure AD a CSC s managementem tokenů.

### ⚙️ Config
Runtime konfigurace, routy, environment proměnné a feature flags.

### 🎣 Hooks
Sdílené React hooks pro localStorage, debounce a další běžné funkcionality.

### 🛠️ Utils
Utility funkce pro práci se soubory, tabulkami a UI měřeními.

## Principy

- **Nezávislost na business logice** - vše je generické a znovupoužitelné
- **Type safety** - plně typované s TypeScript
- **Stabilní API** - změny vyžadují pečlivé posouzení dopadu
- **Testovatelnost** - každý modul má testy

## Použití

```typescript
// Správné importy z core
import { apiClient } from '@/core/api'
import { useLocalStorage } from '@/core/hooks'
import { ROUTES } from '@/core/config'
```
