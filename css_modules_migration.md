# CSS Modules Migration Guide

## Issue with Turbopack and kebab-case

After updating to Next.js 15, an issue appeared with Turbopack - it incorrectly processed CSS modules with kebab-case class names (e.g., `.cards-grid`), even though webpack had `exportLocalsConvention: 'camelCase'` configured.

## Solution

### 1. Updated Stylelint Configuration

Stylelint has been configured to accept **both conventions**:

- **kebab-case**: `.cards-grid`, `.date-color`
- **camelCase**: `.cardsGrid`, `.dateColor`

### 2. Convention for New Files

**For all new CSS modules, use camelCase:**

```css
/* ✅ Correct - camelCase */
.myComponent {
  background: red;
}

.primaryButton {
  color: blue;
}

/* ❌ Incorrect - kebab-case (doesn't work with Turbopack) */
.my-component {
  background: red;
}

.primary-button {
  color: blue;
}
```

### 3. Migrating Existing Files

Old files with kebab-case work normally with webpack (`npm run dev`), but not with Turbopack (`npm run dev:turbo`).

**Recommended approach:**

- Migrate files gradually as you edit them
- Use the `node scripts/migrateCssModules.js` script for automatic conversion

### 4. Migration Example

**Before (kebab-case):**

```css
.home-page {
  padding: 1rem;
}

.cards-grid {
  display: grid;
}
```

**After (camelCase):**

```css
.homePage {
  padding: 1rem;
}

.cardsGrid {
  display: grid;
}
```

**TypeScript code remains the same:**

```tsx
import styles from './index.module.css';

// Works with both thanks to webpack configuration
<div className={styles.homePage}>
  <div className={styles.cardsGrid}>{/* content */}</div>
</div>;
```

## Files to Migrate

To get a list of files with kebab-case class names:

```bash
find src -name "*.module.css" -type f -exec grep -l "\.[a-z][a-z0-9]*-[a-z]" {} \;
```

## Migration Script Usage

The project includes an automated migration script to convert CSS modules from kebab-case to camelCase:

```bash
# Convert a single file
node scripts/migrateCssModules.js src/domains/home/index.module.css

# Convert all CSS modules in a directory
node scripts/migrateCssModules.js src/domains/settings

# Convert all CSS modules in the domains folder
node scripts/migrateCssModules.js src/domains
```

The script will:

- Find all kebab-case class names (e.g., `.my-class-name`)
- Convert them to camelCase (e.g., `.myClassName`)
- Display all conversions made
- Preserve all other CSS content unchanged

## Notes

- The change is **backward compatible** thanks to webpack configuration
- Stylelint now accepts both conventions
- Turbopack works correctly only with camelCase class names
- Existing files with kebab-case continue to work with standard webpack mode (`npm run dev`)
- For Turbopack mode (`npm run dev:turbo`), files must use camelCase class names
