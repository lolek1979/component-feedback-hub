# Design System

Universal design system for VZP NIS application containing atoms, molecules, design tokens and utility functions.

## Structure

```
src/design-system/
├── atoms/           # Basic UI components (Button, Input, Text, etc.)
├── molecules/       # Composite components (Modal, Table, Form components)
├── tokens/          # Design tokens (colors, typography, spacing)
├── utils/           # Utility functions for components
└── index.ts         # Main export file
```

## Components

### Atoms

- **Avatar** - User avatar
- **Badge** - Small indicator or label
- **Button** - Basic button
- **Card** - Content container
- **Checkbox** - Checkbox input
- **Divider** - Content separator
- **Input** - Text input field
- **RadioButton** - Radio button
- **Select** - Select dropdown
- **Skeleton** - Loading placeholder
- **Spinner** - Loading indicator
- **Text** - Text components
- **Textarea** - Multi-line text field
- **Toggle** - On/off switch
- **ToggleContent** - Collapsible content
- **Tooltip** - Help tooltip

### Molecules

- **Breadcrumbs** - Navigation breadcrumbs
- **Chip** - Small information chip
- **DatePicker** - Date picker
- **FileUpload** - File upload
- **InlineMessage** - Inline messages
- **Modal** - Modal dialog
- **Multiselect** - Multiple selection
- **Pagination** - Pagination
- **Popover** - Popover content
- **RadioGroup** - Radio button group
- **TabGroup** - Tab group
- **Table** - Data table
- **Tag** - Tag label
- **Toast** - Notification toast

## Usage

```typescript
// Import individual components
import { Button, Input } from '@/design-system/atoms';
import { Modal, Table } from '@/design-system/molecules';

// Or import entire design system
import * as DesignSystem from '@/design-system';
```

## Storybook

We use Storybook for component documentation and testing:

```bash
npm run storybook
```

Storybook includes:

- Documentation for all components
- Interactive playground
- Usage examples
- Design tokens

## Rules

1. **Universality** - Components in design-system must be universal and independent of business logic
2. **Atomic Design** - We follow atomic design principles (atoms, molecules)
3. **Documentation** - Every component must have Storybook documentation
4. **TypeScript** - All components must be fully typed
5. **Testing** - Components should have unit tests

## Design Tokens

Design tokens will contain:

- Color palette
- Typography scales
- Spacing system
- Border radius values
- Shadows
- Breakpoints

## Utilities

Utility functions for:

- Component styling
- Theme management
- Responsive design
- Accessibility helpers
