/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

// Recursively replace /functions/ with /components/ in all HTML files
function replaceFunctionLinks(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceFunctionLinks(fullPath);
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const replaced = content.replace(/\/functions\//g, '/components/');
      if (replaced !== content) {
        fs.writeFileSync(fullPath, replaced, 'utf8');
      }
    }
  });
}

// Recursively copy a directory
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  fs.readdirSync(src).forEach((item) => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

const docsDir = path.join(__dirname, '../docs');
replaceFunctionLinks(docsDir);

// Copy components to functions
const componentsDir = path.join(docsDir, 'components');
const functionsDir = path.join(docsDir, 'functions');
if (fs.existsSync(componentsDir)) {
  copyDir(componentsDir, functionsDir);
}

// Copy interfaces to functions/interfaces
const interfacesDir = path.join(docsDir, 'interfaces');
const functionsInterfacesDir = path.join(functionsDir, 'interfaces');
if (fs.existsSync(interfacesDir)) {
  copyDir(interfacesDir, functionsInterfacesDir);
}

console.log('Docs post-processing complete.');

// Add /* eslint-disable */ to the top of main.js in docs/assets directory
const mainJsPath = path.join(docsDir, 'assets', 'main.js');
console.log('Checking for main.js at:', mainJsPath);
if (fs.existsSync(mainJsPath)) {
  let content = fs.readFileSync(mainJsPath, 'utf8');
  if (!content.startsWith('/* eslint-disable */')) {
    fs.writeFileSync(mainJsPath, '/* eslint-disable */\n' + content, 'utf8');
    console.log('Prepended /* eslint-disable */ to main.js');
  } else {
    console.log('main.js already contains /* eslint-disable */');
  }
} else {
  console.log('main.js not found at:', mainJsPath);
}
