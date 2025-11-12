export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Every SVG component imported from a .svg file must have an id attribute',
    },
    schema: [],
  },
  create(context) {
    const svgImports = new Set();

    return {
      ImportDeclaration(node) {
        if (node.source.value.endsWith('.svg')) {
          for (const specifier of node.specifiers) {
            if (specifier.type === 'ImportDefaultSpecifier') {
              svgImports.add(specifier.local.name);
            }
          }
        }
      },

      JSXOpeningElement(node) {
        const name = node.name.name;
        if (svgImports.has(name)) {
          const hasId = node.attributes.some(
            (attr) => attr.type === 'JSXAttribute' && attr.name.name === 'id',
          );

          if (!hasId) {
            context.report({
              node,
              message: `SVG component "${name}" must have an "id" attribute.`,
            });
          }
        }
      },
    };
  },
};
