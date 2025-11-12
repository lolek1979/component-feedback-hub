#!/usr/bin/env node
/* eslint-disable */

/**
 * Script to convert CSS module class names from kebab-case to camelCase
 * Usage: node scripts/migrateCssModules.js <file-path>
 */

const fs = require('fs');
const path = require('path');

function kebabToCamelCase(str) {
  return str.replace(/-([a-z0-9])/g, (match, letter) => letter.toUpperCase());
}

function convertCssFile(filePath) {
  console.log(`\n🔄 Converting: ${filePath}`);

  const content = fs.readFileSync(filePath, 'utf8');

  // Find all class selectors with kebab-case
  const classPattern = /\.([a-z][a-z0-9]*(?:-[a-z0-9]+)+)/g;
  const matches = [...content.matchAll(classPattern)];

  if (matches.length === 0) {
    console.log('✅ No kebab-case classes found. File is already in camelCase.');

    return;
  }

  let newContent = content;
  const conversions = new Map();

  matches.forEach((match) => {
    const kebabCase = match[1];
    const camelCase = kebabToCamelCase(kebabCase);
    conversions.set(kebabCase, camelCase);
  });

  // Replace all occurrences
  conversions.forEach((camelCase, kebabCase) => {
    const kebabRegex = new RegExp(`\\.${kebabCase}\\b`, 'g');
    newContent = newContent.replace(kebabRegex, `.${camelCase}`);
  });

  // Write back
  fs.writeFileSync(filePath, newContent, 'utf8');

  console.log('✅ Converted classes:');
  conversions.forEach((camelCase, kebabCase) => {
    console.log(`   .${kebabCase} → .${camelCase}`);
  });
}

function findAllCssModules(dir) {
  const files = [];

  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        traverse(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.module.css')) {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);

  return files;
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: node scripts/migrateCssModules.js <file-path-or-directory>');
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/migrateCssModules.js src/domains/home/index.module.css');
  console.log('  node scripts/migrateCssModules.js src/domains/settings');
  console.log('  node scripts/migrateCssModules.js src/domains');
  process.exit(1);
}

const target = args[0];
const fullPath = path.resolve(target);

if (!fs.existsSync(fullPath)) {
  console.error(`❌ Error: Path does not exist: ${fullPath}`);
  process.exit(1);
}

const stat = fs.statSync(fullPath);

if (stat.isDirectory()) {
  console.log(`🔍 Finding all CSS modules in: ${fullPath}\n`);
  const files = findAllCssModules(fullPath);

  if (files.length === 0) {
    console.log('No CSS module files found.');
    process.exit(0);
  }

  console.log(`Found ${files.length} CSS module file(s)\n`);

  files.forEach((file) => {
    convertCssFile(file);
  });

  console.log(`\n✅ Successfully converted ${files.length} file(s)!`);
} else if (fullPath.endsWith('.module.css')) {
  convertCssFile(fullPath);
  console.log('\n✅ Successfully converted file!');
} else {
  console.error('❌ Error: File must be a .module.css file');
  process.exit(1);
}
