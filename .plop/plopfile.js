const { component } = require('./settings');
const { helpers } = require('./settings');

module.exports = function (plop) {
  // Add here more generators
  plop.setGenerator('component', component);
  plop.setHelper('wrapInBraces', (text) => `{${text}}`);

  // Register each helper from helpers/index.js
  Object.keys(helpers).forEach((helperName) => {
    plop.setHelper(helperName, helpers[helperName]);
  });
};
