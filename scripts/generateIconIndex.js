/* eslint-disable newline-before-return */
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

// Path to your icons directory
const iconsDir = path.join(__dirname, '../src/core/assets/icons');
const outputFile = path.join(iconsDir, 'index.ts');

// Read the directory
fs.readdir(iconsDir, (err, files) => {
  if (err) {
    console.error('Error reading icons directory:', err);
    return;
  }

  // Filter for SVG files
  const svgFiles = files.filter((file) => file.endsWith('.svg'));

  // Track component names to avoid duplicates
  const componentNames = new Set();
  const imports = [];
  const exports = [];

  // Process each SVG file
  svgFiles.forEach((file) => {
    if (file === 'index.ts') return; // Skip index file

    const baseName = path.basename(file, '.svg');

    // Convert kebab-case to PascalCase with I prefix
    let componentName =
      'I' +
      baseName
        .replace(/^icon-/, '')
        .split(/[-_]/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');

    // Handle special cases like "close copy.svg"
    componentName = componentName.replace(/\s+/g, '_');

    // Skip if this component name already exists
    if (componentNames.has(componentName)) {
      console.log(`Skipping duplicate component name: ${componentName} for file ${file}`);
      return;
    }

    // Add to our tracking sets
    componentNames.add(componentName);
    imports.push(`import ${componentName} from '@/core/assets/icons/${file}';`);
    exports.push(componentName);
  });

  // Generate export block
  const exportBlock = `export {\n  ${exports.join(',\n  ')}\n};`;

  // Combine into file content
  const fileContent = `${imports.join('\n')}\n\n\n${exportBlock}`;

  // Write to index.ts
  fs.writeFile(outputFile, fileContent, (err) => {
    if (err) {
      console.error('Error writing index.ts:', err);
      return;
    }
    console.log(`Successfully generated index.ts for ${exports.length} unique icons`);
  });
});
