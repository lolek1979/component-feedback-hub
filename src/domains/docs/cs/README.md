# Domains Layer

Doménové moduly obsahující specifické aplikační funkcionality a features. Každá doména je samostatná s vlastními komponentami, hooks, stores a business logikou.

## Struktura

```
src/domains/
├── administrative-proceedings/    # Správní řízení
├── audit-log/                    # Systémové auditní logy
├── central-codelist-management/  # Centrální správa číselníků
├── electronic-requests/          # Zpracování eŽádanek
├── home/                         # Dashboard a hlavní stránka
├── limits-copayments-center/     # Centrum Limitů a Doplatků
├── log-out/                      # Odhlášení uživatele
├── pdf-comparison/               # Porovnání PDF dokumentů
└── settings/                     # Nastavení aplikace
```

## Architektura domén

Každá doména následuje konzistentní strukturu:

```
domain-name/
├── components/    # Doménově specifické UI komponenty
├── hooks/         # Doménově specifické React hooks
├── stores/        # Správa stavu domény
├── types/         # Definice typů domény
├── utils/         # Utility funkce domény
└── index.ts       # Exporty domény
```

## Klíčové domény

### 📋 Administrative Proceedings
Správa správních řízení, zpracování dokumentů a workflow handling.

### 📊 Audit Log
Systémový audit trail, logování akcí uživatelů a systémových událostí pro compliance.

### 📚 Central Codelist Management
Administrace systémových číselníků, kategorií a referenčních dat.

### 📄 Electronic Requests
Zpracování elektronických žádostí, handling formulářů a submission workflows.

### 🏠 Home
Hlavní dashboard s přehledem, statistikami a rychlým přístupem ke klíčovým funkcím.

### 💰 Limits & Copayments Center
Správa platebních limitů, pravidel doplatků a finančních kalkulací.

### 🔍 PDF Comparison
Nástroje pro porovnání dokumentů a analýzu rozdílů mezi PDF dokumenty.

### ⚙️ Settings
Uživatelské preference, konfigurace aplikace a systémová nastavení.

## Principy

- **Izolace domén** - každá doména je nezávislá a samostatná
- **Business zaměření** - obsahuje specifickou business logiku a pravidla
- **Znovupoužitelné komponenty** - doménové komponenty lze sdílet v rámci domény
- **Jasné hranice** - dobře definovaná rozhraní zwischen doménami

## Použití

```typescript
// Import ze specifických domén
import { ProcessingStatus } from '@/domains/administrative-proceedings'
import { AuditLogger } from '@/domains/audit-log'
import { UserSettings } from '@/domains/settings'
```
