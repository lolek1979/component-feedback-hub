# Domains Layer

Business domain modules containing specific application functionalities and features. Each domain is self-contained with its own components, hooks, stores, and business logic.

## Structure

```
src/domains/
├── administrative-proceedings/    # Administrative proceedings management
├── audit-log/                    # System audit logging
├── central-codelist-management/  # Central codelist administration
├── electronic-requests/          # Electronic request processing
├── home/                         # Dashboard and home page
├── limits-copayments-center/     # Limits and copayments management
├── log-out/                      # User logout functionality
├── pdf-comparison/               # Document comparison tools
└── settings/                     # Application settings
```

## Domain Architecture

Each domain follows a consistent structure:

```
domain-name/
├── components/    # Domain-specific UI components
├── hooks/         # Domain-specific React hooks
├── stores/        # Domain state management
├── types/         # Domain type definitions
├── utils/         # Domain utility functions
└── index.ts       # Domain exports
```

## Key Domains

### 📋 Administrative Proceedings
Management of administrative proceedings, document processing and workflow handling.

### 📊 Audit Log
System audit trail, logging user actions and system events for compliance.

### 📚 Central Codelist Management
Administration of system codelists, categories and reference data.

### 📄 Electronic Requests
Processing electronic requests, form handling and submission workflows.

### 🏠 Home
Main dashboard with overview, statistics and quick access to key features.

### 💰 Limits & Copayments Center
Management of payment limits, copayment rules and financial calculations.

### 🔍 PDF Comparison
Document comparison tools for analyzing differences between PDF documents.

### ⚙️ Settings
User preferences, application configuration and system settings.

## Principles

- **Domain isolation** - each domain is independent and self-contained
- **Business focus** - contains specific business logic and rules
- **Reusable components** - domain components can be shared within the domain
- **Clear boundaries** - well-defined interfaces between domains

## Usage

```typescript
// Import from specific domains
import { ProcessingStatus } from '@/domains/administrative-proceedings'
import { AuditLogger } from '@/domains/audit-log'
import { UserSettings } from '@/domains/settings'
```
