/**
 * ESLint rule to restrict imports within /src/domains directories
 *
 * Rules:
 * - Files in /src/domains/<module>/* can only import from:
 *   - Third-party packages
 *   - /src/core/*
 *   - /src/design-system/*
 *   - Same domain module /src/domains/<module>/*
 * - Cannot import from other domain modules /src/domains/<other-module>/*
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Restrict imports in domain modules to prevent cross-domain dependencies',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      restrictedImport:
        'Import from "{{importPath}}" is not allowed. Domain modules can only import from third-party packages, /core, /design-system, or the same domain module.',
    },
  },

  create(context) {
    const filename = context.getFilename();

    // Check if the current file is in a domains directory
    const domainsMatch = filename.match(/\/src\/domains\/([^/]+)/);
    if (!domainsMatch) {
      // Rule doesn't apply to files outside domains
      return {};
    }

    const currentDomain = domainsMatch[1];

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;

        // Skip relative imports (they're within the same directory structure)
        if (importPath.startsWith('.')) {
          return;
        }

        // Allow third-party packages (don't start with @/ or /)
        if (!importPath.startsWith('@/') && !importPath.startsWith('/')) {
          return;
        }

        // Normalize the import path to handle both @/ and / prefixes
        const normalizedPath = importPath.startsWith('@/')
          ? importPath.slice(2) // Remove @/
          : importPath.startsWith('/src/')
            ? importPath.slice(5) // Remove /src/
            : importPath.startsWith('/')
              ? importPath.slice(1) // Remove /
              : importPath;

        // Allow imports from core and design-system
        if (normalizedPath.startsWith('core/') || normalizedPath.startsWith('design-system/')) {
          return;
        }

        // Allow imports from the same domain
        if (normalizedPath.startsWith(`domains/${currentDomain}/`)) {
          return;
        }

        // Check if it's trying to import from another domain
        if (normalizedPath.startsWith('domains/')) {
          const targetDomain = normalizedPath.match(/domains\/([^/]+)/);
          if (targetDomain && targetDomain[1] !== currentDomain) {
            context.report({
              node: node.source,
              messageId: 'restrictedImport',
              data: {
                importPath: importPath,
              },
            });
          }
        }
      },
    };
  },
};
