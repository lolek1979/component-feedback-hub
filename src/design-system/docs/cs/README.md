# Design System

Univerzální design system pro VZP NIS aplikaci obsahující atomy, molekuly, design tokeny a utility funkce.

## Struktura

```
src/design-system/
├── atoms/           # Základní UI komponenty (Button, Input, Text, atd.)
├── molecules/       # Kompozitní komponenty (Modal, Table, Form komponenty)
├── tokens/          # Design tokeny (barvy, typography, spacing)
├── utils/           # Utility funkce pro komponenty
└── index.ts         # Hlavní export soubor
```

## Komponenty

### Atomy

- **Avatar** - Uživatelský avatar
- **Badge** - Malý indikátor nebo štítek
- **Button** - Základní tlačítko
- **Card** - Kontejner pro obsah
- **Checkbox** - Zaškrtávací políčko
- **Divider** - Oddělovač obsahu
- **Input** - Textové vstupní pole
- **RadioButton** - Přepínač
- **Select** - Výběrové pole
- **Skeleton** - Loading placeholder
- **Spinner** - Loading indikátor
- **Text** - Textové komponenty
- **Textarea** - Víceřádkové textové pole
- **Toggle** - Přepínač on/off
- **ToggleContent** - Rozbalovací obsah
- **Tooltip** - Nápověda

### Molekuly

- **Breadcrumbs** - Navigační breadcrumbs
- **Chip** - Malý informační chip
- **DatePicker** - Výběr data
- **FileUpload** - Upload souborů
- **InlineMessage** - Inline zprávy
- **Modal** - Modální okno
- **Multiselect** - Vícenásobný výběr
- **Pagination** - Stránkování
- **Popover** - Vyskakovací obsah
- **RadioGroup** - Skupina radio buttonů
- **TabGroup** - Skupina tabů
- **Table** - Datová tabulka
- **Tag** - Štítek
- **Toast** - Notifikace

## Použití

```typescript
// Import jednotlivých komponent
import { Button, Input } from '@/design-system/atoms';
import { Modal, Table } from '@/design-system/molecules';

// Nebo import celého design systému
import * as DesignSystem from '@/design-system';
```

## Storybook

Pro dokumentaci a testování komponent používáme Storybook:

```bash
npm run storybook
```

Storybook obsahuje:

- Dokumentaci všech komponent
- Interaktivní playground
- Příklady použití
- Design tokeny

## Pravidla

1. **Univerzálnost** - Komponenty v design-system musí být univerzální a nezávislé na business logice
2. **Atomic Design** - Dodržujeme principy atomic design (atomy, molekuly)
3. **Dokumentace** - Každý komponent musí mít Storybook dokumentaci
4. **TypeScript** - Všechny komponenty musí být plně typované
5. **Testy** - Komponenty by měly mít unit testy

## Design Tokeny

Design tokeny budou obsahovat:

- Barevná paleta
- Typography škály
- Spacing systém
- Border radius hodnoty
- Stíny
- Breakpointy

## Utilities

Utility funkce pro:

- Theme utilities
- Component prop helpers
- Validační funkce
- Style utilities
