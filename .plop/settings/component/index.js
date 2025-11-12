const fs = require('fs');
const path = require('path');

function getDomains() {
  const domainsPath = path.resolve(__dirname, '../../../src/domains');
  if (!fs.existsSync(domainsPath)) return [];
  const dirs = fs
    .readdirSync(domainsPath)
    .filter((f) => fs.statSync(path.join(domainsPath, f)).isDirectory());

  return dirs;
}

module.exports = {
  description: 'Creates a new component',
  prompts: [
    {
      type: 'list',
      name: 'componentDestination',
      message: 'Where do you want to create your component?',
      choices: ['design-system', 'domains'],
    },
    // If design-system, ask for component type
    {
      type: 'list',
      name: 'componentType',
      message: 'What component do you want to create?',
      choices: ['atoms', 'molecules', 'organisms', 'templates'],
      when: (answers) => answers.componentDestination === 'design-system',
    },
    // If domains, ask for domain
    {
      type: 'list',
      name: 'domain',
      message: 'What do you want to create?',
      choices: ['component', 'new-domain'],
      when: (answers) => answers.componentDestination === 'domains',
    },

    {
      type: 'input',
      name: 'newDomainName',
      message: 'What do you want to call your new domain?',
      when: (answers) => answers.domain === 'new-domain',
    },

    {
      type: 'list',
      name: 'domainComp',
      message: 'In which domain do you want to create the component?',
      choices: () => getDomains(),
      when: (answers) => answers.domain === 'component',
    },
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of the component?',
      when: (answers) => !!answers.domainComp || !!answers.componentType,
    },
  ],
  actions: function (data) {
    const actions = [];
    if (data.componentDestination === 'design-system') {
      actions.push(
        // index.ts
        {
          type: 'add',
          path: '../src/design-system/{{componentType}}/{{pascalCase name}}/index.ts',
          templateFile: 'templates/component/index.ts.hbs',
        },
        // component
        {
          type: 'add',
          path: '../src/design-system/{{componentType}}/{{pascalCase name}}/{{pascalCase name}}.tsx',
          templateFile: 'templates/component/component.tsx.hbs',
        },
        // storybook
        {
          type: 'add',
          path: '../src/design-system/{{componentType}}/{{pascalCase name}}/{{pascalCase name}}.stories.tsx',
          templateFile: 'templates/component/stories.tsx.hbs',
        },
        // tests
        {
          type: 'add',
          path: '../src/design-system/{{componentType}}/{{pascalCase name}}/{{pascalCase name}}.test.tsx',
          templateFile: 'templates/component/test.tsx.hbs',
        },
        // css
        {
          type: 'add',
          path: '../src/design-system/{{componentType}}/{{pascalCase name}}/{{pascalCase name}}.module.css',
          templateFile: 'templates/component/module.css.hbs',
        },
        // mdx
        {
          type: 'add',
          path: '../src/design-system/{{componentType}}/{{pascalCase name}}/{{pascalCase name}}.mdx',
          templateFile: 'templates/component/documentation.mdx.hbs',
        },
        // add modules import and export to index.ts in the componentType folder
        {
          type: 'modify',
          path: '../src/design-system/{{componentType}}/index.ts',
          pattern: /(\/\/ COMPONENT IMPORTS)/g,
          template: "import { {{pascalCase name}} } from './{{pascalCase name}}';\n$1",
        },
        {
          type: 'modify',
          path: '../src/design-system/{{componentType}}/index.ts',
          pattern: /(\/\/ COMPONENT EXPORTS)/g,
          template: '\t{{pascalCase name}},\n$1',
        },
      );
    }
    if (data.componentDestination === 'domains' && data.domain === 'new-domain') {
      // Create domain folder structure
      actions.push(
        {
          type: 'add',
          path: '../src/domains/{{camelCase newDomainName}}/api/.gitkeep',
          template: '',
        },
        {
          type: 'add',
          path: '../src/domains/{{camelCase newDomainName}}/components/index.tsx',
          templateFile: 'templates/component/componentIndex.tsx.hbs',
        },
        {
          type: 'add',
          path: '../src/domains/{{camelCase newDomainName}}/utils/.gitkeep',
        },
        {
          type: 'add',
          path: '../src/domains/{{camelCase newDomainName}}/index.module.css',
        },
        {
          type: 'add',
          path: '../src/domains/{{camelCase newDomainName}}/index.tsx',
          templateFile: 'templates/component/domain.tsx.hbs',
        },
      );
    } else if (data.componentDestination === 'domains' && data.domain === 'component') {
      actions.push(
        // index.ts
        {
          type: 'add',
          path: '../src/domains/{{domainComp}}/components/{{pascalCase name}}/index.ts',
          templateFile: 'templates/component/index.ts.hbs',
        },
        // component
        {
          type: 'add',
          path: '../src/domains/{{domainComp}}/components/{{pascalCase name}}/{{pascalCase name}}.tsx',
          templateFile: 'templates/component/component.tsx.hbs',
        },
        // tests
        {
          type: 'add',
          path: '../src/domains/{{domainComp}}/components/{{pascalCase name}}/{{pascalCase name}}.test.tsx',
          templateFile: 'templates/component/test.tsx.hbs',
        },
        // css
        {
          type: 'add',
          path: '../src/domains/{{domainComp}}/components/{{pascalCase name}}/{{pascalCase name}}.module.css',
          templateFile: 'templates/component/module.css.hbs',
        },
        // add modules import and export to index.ts in the components folder
        {
          type: 'modify',
          path: '../src/domains/{{domainComp}}/components/index.ts',
          pattern: /(\/\/ COMPONENT IMPORTS)/g,
          template: "import { {{pascalCase name}} } from './{{pascalCase name}}';\n$1",
        },
        {
          type: 'modify',
          path: '../src/domains/{{domainComp}}/components/index.ts',
          pattern: /(\/\/ COMPONENT EXPORTS)/g,
          template: '\t{{pascalCase name}},\n$1',
        },
      );
    }

    return actions;
  },
};
