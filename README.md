# NIS

## Core Principles

### CSS Usage

- We use CSS Modules (`*.module.css`) for all component styling to ensure local scoping and avoid global conflicts.
- All colors, font sizes, spacing, and other design values should be referenced using CSS variables (design tokens) defined according to the Figma design system.
- Do not use hardcoded color values or sizes in component styles. Always use the appropriate variable/token for consistency and maintainability.
- Design tokens are centrally managed and should be updated in sync with Figma to ensure visual consistency across the application.

### Accessibility

- Always follow basic accessibility principles (a11y) when developing UI components and pages.
- Ensure semantic HTML, proper labeling, keyboard navigation.
- Test components for accessibility and use tools such as [axe](https://www.deque.com/axe/) or browser devtools to identify and fix issues.

---

## Tech Stack & Tooling

- [Next.js](https://nextjs.org)
- [TypeScript](https://www.typescriptlang.org)
- [Storybook](https://storybook.js.org) for component documentation
- Strict Mode for TypeScript and React 18
- Linting with [ESLint](https://eslint.org)
- Code formatting with [Prettier](https://prettier.io)
- Testing with [Jest](https://jestjs.io/) and [react-testing-library](https://testing-library.com/)
- Component generation with [Plop](https://plopjs.com/) following the [atomic design](https://bradfrost.com/blog/post/atomic-web-design/) convention
- [TanStack React Query](https://tanstack.com/query/latest) is used for all backend data fetching and request management, providing caching, synchronization, and state management for server data.
- Authentication is handled using [MSAL (Microsoft Authentication Library)](https://github.com/AzureAD/microsoft-authentication-library-for-js), which enables secure sign-in and token management with Azure Active Directory.

---

## Architecture

The application follows a **3-layer architecture** pattern that promotes separation of concerns, maintainability, and scalability. The architecture is organized into three main layers:

### 📁 Layer Structure

```
src/
├── core/           # Core Layer - Shared foundation
├── design-system/  # Design System Layer - UI components
├── domains/        # Domain Layer - Business logic
└── app/           # Next.js App Router pages
```

### 🏗️ Layer Overview

#### 1. Core Layer (`/src/core/`)

**Purpose**: Provides the foundational infrastructure and shared utilities used across the entire application.

**Contains**:

- **API clients** and server communication services
- **Authentication** and security services (MSAL, Azure AD)
- **Configuration** (routes, environments, breakpoints)
- **Shared React hooks** for common functionality
- **Internationalization** (i18n) setup
- **Utility functions** and helper libraries
- **Global providers** and stores

**Key Principles**:

- Technology-agnostic utilities
- No business logic
- Reusable across all domains
- Well-tested and stable

[📖 Read Core Layer Documentation](src/core/README.md)

#### 2. Design System Layer (`/src/design-system/`)

**Purpose**: Contains all UI components following atomic design principles and design system tokens.

**Contains**:

- **Atoms** - Basic UI building blocks (Button, Input, Text)
- **Molecules** - Simple component combinations (SearchBox, Card)
- **Organisms** - Complex UI sections (Header, DataTable, Forms)
- **Design tokens** - Colors, typography, spacing variables
- **Component utilities** and shared styling logic

**Key Principles**:

- Follows atomic design methodology
- Uses CSS Modules for styling
- Implements design tokens from Figma
- Fully documented with Storybook
- Accessibility-first approach

#### 3. Domain Layer (`/src/domains/`)

**Purpose**: Implements business-specific logic and features organized by functional domains.

**Current Domains**:

- **Administrative Proceedings** (`administrative-proceedings/`)
- **Audit Log** (`audit-log/`)
- **Central Codelist Management** (`central-codelist-management/`)
- **Electronic Requests** (`electronic-requests/`)
- **Home** (`home/`)
- **Limits & Copayments Center** (`limits-copayments-center/`)
- **PDF Comparison** (`pdf-comparison/`)
- **Settings** (`settings/`)

**Key Principles**:

- Domain-driven design
- Business logic encapsulation
- Domain-specific components and hooks
- Independent and loosely coupled

### 🔄 Layer Dependencies

The architecture follows a strict dependency hierarchy:

```
Domains Layer
    ↓ (can use)
Design System Layer
    ↓ (can use)
Core Layer
    ↓ (no dependencies on application layers)
External Libraries & Next.js
```

**Dependency Rules**:

- **Core** can only depend on external libraries and Next.js APIs
- **Design System** can use Core utilities but not Domain logic
- **Domains** can use both Core and Design System layers
- **Cross-domain dependencies** are discouraged - shared logic should move to Core

### 📦 Import Patterns

Each layer provides a clean barrel export through its `index.ts`:

```typescript
// Import from Core layer
import { useCSCAuth, ROUTES, apiClient } from '@/core';

// Import from Design System layer
import { Button, DataTable, SearchBox } from '@/design-system';

// Import from specific domain
import { CodelistForm } from '@/domains/central-codelist-management';
```

---

## Local Development Setup

To run the project locally, follow these steps:

### Prerequisites

- **Node.js** (version 18.x or higher recommended)
- **npm** (comes with Node.js)

### 1. Install dependencies

**Note:**
To ensure `npm install` works successfully, follow the steps in the [@vzp/\* npm packages](#vzp-npm-packages) section below.

```shell
npm install
```

### 2. Environment variables

Copy the example environment file and adjust values as needed:

```shell
cp .env.example .env
```

Edit `.env` to set up any required environment variables for your local setup.

### 3. Start the development server

```shell
npm run dev
```

The app will be available at [http://localhost:7296](http://localhost:7296).

---

## Documentation (TypeDoc)

The project uses [TypeDoc](https://typedoc.org/) to generate API documentation for UI components and hooks.

### Generating Documentation

To generate documentation, **always use**:

```shell
npm run docs:all
```

This will:

- Generate documentation in the `docs/` directory using TypeDoc and the `typedoc-plugin-react` plugin.
- Run a post-processing script to ensure components (not just their props) are visible and navigable in the docs.

> **Note:** Running only `npm run docs` will not apply the necessary post-processing for React components.  
> Always use `npm run docs:all` to get the correct documentation output.

### Viewing Documentation

Open `docs/index.html` in your browser to view the generated documentation.

- The documentation includes all exported components from `src/components/atoms`, `src/components/molecules`, `src/components/organisms`, and hooks from `src/hooks`.
- Navigation links for "Components" and "Hooks" are available in the sidebar.

### Example of Documentation Comments

For reference on how to write documentation comments for components and props, see  
[`src/components/molecules/Table/Table.tsx`](src/components/molecules/Table/Table.tsx) as a comprehensive example.

---

## Testing

All tests are collated with the source code in the same directory, making them easy to find. The coverage threshold is set to `70%`. In the `.jest` folder, there is a custom provider for all tests.

## How To Use

### Installation

```shell
npm install
```

### Development

```shell
npm run dev
```

### Storybook

```shell
npm run storybook
```

---

## Generating Components

```bash
pnpm generate
```

If you choose to generate an atom component, the result will look like this:

```
└── components
      └── atoms
        └── Button
          ├── index.ts
          ├── Button.stories.tsx
          ├── Button.module.css
          ├── Button.test.tsx
          └── Button.tsx
```

An import and export will be added to the `index.ts` file in the corresponding components section.

For example, after creating a new atom:

```
└── components
      └── atoms
        └── Button
            ...
        index.ts - will have a new import and export for the newly generated component
```

```ts
import { Button } from './Button';
export { Button };
```

After that, you can import the component elsewhere like this:

```ts
import { Button } from '@/components/atoms';
```

### CSS

- Use **kebab-case** for .css files and **camelCase** for .tsx files (to be discussed with the FE team)
- Use **CSS modules** for styling components
- **Color variables** should be defined and used only from the **\_colors.css** file

### Assets

- Store icons in `assets/icons`

### Code Check Before Pushing

1. Run:

```
npm run check
```

2. Resolve any issues (linting, formatting, etc.):

```
npm run fix
```

3. Run tests:

```
npm run test
```

Currently, only the 'components' folder is tested. Add the rest of the folders later.

```json
{
  "test": "jest test ./src/components/*_/*.test.{ts,tsx}"
}
```

### Git Flow

- The `main` branch is the production branch
- Use the prefix `f` for feature branches
- Use the prefix `b` for bugfix branches
- Use the prefix `h` for hotfix branches (urgent bug fixes)
- Use the prefix `r` for refactoring branches

```
└── main
      └── h/AO-fix-button (hotfix branch) (Initials of your name ex: Adam Ondra => AO)
      └── f/AO-add-button (feature branch) (Initials of your name ex: Adam Ondra => AO)
      └── b/AO-fix-button (bugfix branch) (Initials of your name ex: Adam Ondra => AO)
      └── r/AO-fix-button (refactoring branch) (Initials of your name ex: Adam Ondra => AO)

```

---

## Keyboard shortcuts

The application has a global provider `src/providers/KeyboardShortcutsProvider.tsx` which should take care of setting up the correct set of shortcuts (TODO). The config JSON `src/config/shortcuts.json` is available for demonstration.

The individual default shortcuts are then un/registered on specific components and passed to the service via the local provider `src/providers/ComponentShortcutsProvider.tsx`.

### Example

```tsx
const shortcuts: KeyboardShortcut[] = [
  {
    actionId: 'goToNextPage',
    action: handleNextPageClick,
    defaultShortcut: 'shift+N',
  },
  {
    actionId: 'goToPreviousPage',
    action: handlePreviousPageClick,
    defaultShortcut: 'shift+P',
  },
];

return <ComponentShortcutsProvider shortcuts={shortcuts}>...</ComponentShortcutsProvider>;
```

### Demo

On the "_/centralni-sprava-ciselniku_" is available shortcut for opening the modal window for entering the new codebook.
Default shortcut is `ctrl+n` but is overwritten by `alt+c`.

Pagination has default shortcuts for the next and previous page. `shift+N` and `shift+P` respectively.

## Husky and Lint-Staged

The project uses [Husky](https://typicode.github.io/husky/) to manage Git hooks and [lint-staged](https://github.com/okonet/lint-staged) to run linters on staged files before committing.

### Pre-commit Hook

The pre-commit hook ensures that code is linted and tested before being committed. If there are failed tests or linting issues, the commit will be blocked.

### Skipping Pre-commit Hook

If you need to skip the pre-commit hook for any reason, such as overriding failed tests or linting issues, you can use the following command:

```shell
git commit -m "Commit message" --no-verify
```

Use this option cautiously, as it bypasses the checks that ensure code quality.

---

## @vzp/\* npm packages

To install and use `@vzp/*` npm packages published in Azure DevOps Artifacts, you must configure your local user `.npmrc` file for authentication.

### 1. Set up authentication in your user `.npmrc`

In your user profile (`C:\Users\USERNAME\.npmrc` on Windows or `~/.npmrc` on Linux and macOS), add your authentication token:

```txt
; begin auth token
//pkgs.dev.azure.com/<ORGANIZATION_NAME>/<PROJECT_NAME>/_packaging/<FEED_NAME>/npm/registry/:username=anyvalue
//pkgs.dev.azure.com/<ORGANIZATION_NAME>/<PROJECT_NAME>/_packaging/<FEED_NAME>/npm/registry/:_password=<BASE64_ENCODED_PERSONAL_ACCESS_TOKEN>
//pkgs.dev.azure.com/<ORGANIZATION_NAME>/<PROJECT_NAME>/_packaging/<FEED_NAME>/npm/registry/:email=npm requires email to be set but doesn't use the value
; end auth token
```

Example

```txt
; begin auth token
//pkgs.dev.azure.com/vzp/NIS/_packaging/nis/npm/registry/:username=YOUR.EMAIL@vzp.cz
//pkgs.dev.azure.com/vzp/NIS/_packaging/nis/npm/registry/:_password=MTM3YW...
//pkgs.dev.azure.com/vzp/NIS/_packaging/nis/npm/registry/:email=YOUR.EMAIL@vzp.cz
; end auth token

```

- Generate a **Personal Access Token** (PAT) with _Packaging > Read_ permission. See [docs](https://learn.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&tabs=Windows#create-a-pat).
- Encode the PAT in Base64. You can use node.js to do this:

```bash
node -e "require('readline') .createInterface({input:process.stdin,output:process.stdout,historySize:0}) .question('PAT> ',p => { b64=Buffer.from(p.trim()).toString('base64');console.log(b64);process.exit(); })"
```

- Replace `<BASE64_ENCODED_PERSONAL_ACCESS_TOKEN>` with your encoded token.

> **Warning:** Never commit authentication details or tokens to your repository. Store them only in your user profile.

### 2. Install the Package

Add the package to your `package.json` dependencies:

```json
{
  "dependencies": {
    "@vzp/ui-library": "^0.1.0"
  }
}
```

or install directly:

```
npm install @vzp/ui-library
```

Npm will use the `.npmrc` configuration to fetch the package from Azure Artifacts.

### 3. Use the Package in Your Code

You can now import and use the package as usual:

```js
import { Button } from '@vzp/ui-library';
```

**Official documentation:**

- [Use npm scopes in Azure Artifacts](https://learn.microsoft.com/en-us/azure/devops/artifacts/npm/scopes?view=azure-devops)
- [Set up credentials for Azure Artifacts](https://learn.microsoft.com/en-us/azure/devops/artifacts/npm/scopes?view=azure-devops#set-up-credentials)
- [Use packages from npmjs.com in Azure Artifacts](https://learn.microsoft.com/en-us/azure/devops/artifacts/npm/upstream-sources?view=azure-devops)

**Component ID Naming Convention**

To keep the codebase consistent and easy to navigate, we’ve agreed on the following naming convention for component IDs:

```bash
component-type - location - purpose - [number/suffix if needed]
```

### Examples:

```bash
button-form-close – a button to close the form

icon-form-delete-1 – the first delete icon in the form

icon-form-delete-2 – the second delete icon in the form
```

### Structure:

component-type – e.g. button, icon, input, label, etc.

location – where the component is used (e.g. form, modal, header, ...)

purpose – what the component does (e.g. submit, close, delete, edit, ...)

number/suffix (optional) – if multiple components with the same purpose exist in the same location, use a number or appropriate suffix to distinguish them.

This convention helps with faster identification of components and their context, making the code easier to maintain and debug.

# Update notes

✅ React 19.2 Update Complete!
Major Updates Implemented:
React: 18.3.1 → 19.2.0
React DOM: 18.3.1 → 19.2.0
Next.js: 14.2.28 → 15.5.4 (required for React 19 support)
@next/env: 15.2.2 → 15.5.4
eslint-config-next: 15.3.1 → 15.5.4
@types/react: 18.3.18 → 19.0.2
@types/react-dom: 18.3.5 → 19.0.2
Key Issues Resolved:

1. Fixed the fs Module Error
   The original build error "Module not found: Can't resolve 'fs'" has been completely resolved
   Separated server-only code (loadEnvVariables) from client-side exports
   Added proper webpack fallbacks for Node.js modules in next.config.mjs
2. React 19 TypeScript Compatibility
   Fixed all TypeScript errors related to React 19's stricter child.props typing
   Updated the Select component with proper type guards for accessing React element properties
   Fixed the TableContainer component's type guard function
   All components now properly handle React 19's unknown type for element props
3. Architecture Improvements
   Created a separate types.ts file for shared types like ParsedEnv
   Properly separated server-only and client-side code exports
   Maintained backward compatibility for all existing functionality

## CSS Modules and Turbopack

After updating to Next.js 15, Turbopack has issues with kebab-case class names in CSS modules. For compatibility with both webpack and Turbopack:

- **Use camelCase** for all new CSS module class names (e.g., `.myComponent`, `.primaryButton`)
- Stylelint has been configured to accept both kebab-case and camelCase
- Existing files with kebab-case work with webpack mode (`npm run dev`) but not with Turbopack mode (`npm run dev:turbo`)
- Use the migration script to convert existing files: `node scripts/migrateCssModules.js <path>`

📖 **See [CSS Modules Migration Guide](css_modules_migration.md) for detailed instructions and migration steps.**
