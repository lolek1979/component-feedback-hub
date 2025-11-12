/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

// Base directory for components
const componentsDir = path.resolve(__dirname, '../src/design-system');

/**
 * Updates an MDX file with CSS content from a matching module.css file
 * @param {string} mdxPath - Path to the MDX file
 * @returns {boolean} - Whether the update was successful
 */
function updateMdxWithCss(mdxPath) {
  try {
    // Find the corresponding CSS module file in the same directory
    const mdxDir = path.dirname(mdxPath);
    const componentName = path.basename(mdxPath, '.mdx');
    const cssPath = path.join(mdxDir, `${componentName}.module.css`);

    // Check if CSS file exists
    if (!fs.existsSync(cssPath)) {
      console.log(`⚠️ No module.css file found for ${componentName}`);

      return false;
    }

    // Read files
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    const mdxContent = fs.readFileSync(mdxPath, 'utf8');

    // Create formatted CSS block for MDX with collapsible details element
    const cssCodeBlock = `<details>
<summary>View CSS Source</summary>

\`\`\`css
${cssContent}
\`\`\`
</details>`;

    // Check if MDX already has a CSS section
    const cssSection = '## CSS Source';

    if (mdxContent.includes(cssSection)) {
      // Update existing CSS section
      // Find the position of the CSS section title
      const cssSectionPos = mdxContent.indexOf(cssSection);

      // Find the content before CSS section
      const beforeCss = mdxContent.substring(0, cssSectionPos);

      // Find if there's another section after the CSS section
      const nextSectionMatch = mdxContent
        .substring(cssSectionPos + cssSection.length)
        .match(/\n## /);

      let updatedMdxContent;

      if (nextSectionMatch) {
        // There's another section after CSS section
        const nextSectionPos = cssSectionPos + cssSection.length + nextSectionMatch.index;
        const afterCss = mdxContent.substring(nextSectionPos);
        updatedMdxContent = `${beforeCss}## CSS Source\n\n${cssCodeBlock}${afterCss}`;
      } else {
        // CSS section is the last section
        updatedMdxContent = `${beforeCss}## CSS Source\n\n${cssCodeBlock}`;
      }

      fs.writeFileSync(mdxPath, updatedMdxContent, 'utf8');
      console.log(`✅ Updated existing CSS section in ${componentName}.mdx`);
    } else {
      // Add new CSS section at the end
      const updatedMdxContent = `${mdxContent}\n\n## CSS Source\n\n${cssCodeBlock}`;
      fs.writeFileSync(mdxPath, updatedMdxContent, 'utf8');
      console.log(`✅ Added new CSS section to ${componentName}.mdx`);
    }

    return true;
  } catch (error) {
    console.error(`❌ Error updating ${path.basename(mdxPath)}: ${error.message}`);

    return false;
  }
}

/**
 * Recursively find all MDX files in the directory and its subdirectories
 * @param {string} dir
 * @param {Array} results
 * @returns {Array}
 */
function findMdxFiles(dir, results = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findMdxFiles(filePath, results);
    } else if (file.endsWith('.mdx')) {
      results.push(filePath);
    }
  }

  return results;
}

/**
 * Main function to update all component MDX files with their CSS
 */
function updateAllComponentMdx() {
  const mdxFiles = findMdxFiles(componentsDir);

  if (mdxFiles.length === 0) {
    console.log('❌ No MDX files found in components directory');

    return;
  }

  console.log(`Found ${mdxFiles.length} MDX files to process`);

  let updatedCount = 0;

  // Process each MDX file
  for (const mdxFile of mdxFiles) {
    if (updateMdxWithCss(mdxFile)) {
      updatedCount++;
    }
  }

  console.log(`✅ Updated ${updatedCount} MDX files with CSS content`);
}

updateAllComponentMdx();
