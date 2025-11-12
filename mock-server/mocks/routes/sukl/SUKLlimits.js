// Use this file only as a guide for first steps using routes. Delete it when you have added your own route files.
// For a detailed explanation regarding each routes property, visit:
// https://mocks-server.org/docs/usage/routes

const SUKL_LIMITS = require('../../../json/sukl/SUKL-limits.js');

module.exports = [
  {
    id: 'get-sukl-limits', // route id
    url: '/integration-sukl/api/rest/v1/sukl-cuer-data/:insuredId/surcharge-limit', // url in express format
    method: 'GET', // HTTP method
    variants: [
      {
        id: 'success', // variant id
        type: 'json', // variant handler id
        options: {
          status: 200, // status to send
          body: SUKL_LIMITS, // body to send
        },
      },
      {
        id: 'error:404', // variant id
        type: 'json', // variant handler id
        options: {
          status: 404, // status to send
          // body to send
          body: {
            message: 'Not Found',
          },
        },
      },
      {
        id: 'error:403', // variant id
        type: 'json', // variant handler id
        options: {
          status: 403, // status to send
          // body to send
          body: {
            message: 'Forbidden',
          },
        },
      },
      {
        id: 'error:401', // variant id
        type: 'json', // variant handler id
        options: {
          status: 401, // status to send
          // body to send
          body: {
            message: 'Unauthorized',
          },
        },
      },
      {
        id: 'error:500', // variant id
        type: 'json', // variant handler id
        options: {
          status: 500, // status to send
          // body to send
          body: {
            message: 'Internal Server Error',
          },
        },
      },
      {
        id: 'error:501',
        type: 'json',
        options: {
          status: 501,
          body: {
            message: 'Not Implemented',
          },
        },
      },
      {
        id: 'error:502',
        type: 'json',
        options: {
          status: 502,
          body: {
            message: 'Bad Gateway',
          },
        },
      },
      {
        id: 'error:504',
        type: 'json',
        options: {
          status: 504,
          body: {
            message: 'Gateway Timeout',
          },
        },
      },
    ],
  },
];
