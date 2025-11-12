// Use this file only as a guide for first steps using routes. Delete it when you have added your own route files.
// For a detailed explanation regarding each routes property, visit:
// https://mocks-server.org/docs/usage/routes

const CODELISTS_DATA = require('../../../json/codelists/CodeLists-data.js');

module.exports = [
  {
    id: 'get-codelists-data',
    url: '/api/rest/v1/codelists',
    method: 'GET',
    variants: [
      {
        id: 'success',
        type: 'json',
        options: {
          status: 200,
          body: CODELISTS_DATA,
        },
      },
      {
        id: 'error:404',
        type: 'json',
        options: {
          status: 404,
          body: {
            message: 'Not Found',
          },
        },
      },
      {
        id: 'error:500',
        type: 'json',
        options: {
          status: 500,
          body: {
            message: 'Internal Server Error',
          },
        },
      },
    ],
  },
];
