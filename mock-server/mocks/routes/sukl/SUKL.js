// Use this file only as a guide for first steps using routes. Delete it when you have added your own route files.
// For a detailed explanation regarding each routes property, visit:
// https://mocks-server.org/docs/usage/routes

const SUKL_DATA = require('../../../json/sukl/SUKL-data.js');

const SUKK_DATA_ONE_ROW = JSON.parse(JSON.stringify(SUKL_DATA));
SUKK_DATA_ONE_ROW.payload.totalCount = 1;
SUKK_DATA_ONE_ROW.payload.data.data = SUKK_DATA_ONE_ROW.payload.data.data.slice(0, 1);

const SUKK_DATA_EMPTY = JSON.parse(JSON.stringify(SUKL_DATA));
SUKK_DATA_EMPTY.payload.totalCount = 0;
SUKK_DATA_EMPTY.payload.data.data = SUKK_DATA_EMPTY.payload.data.data = [];

module.exports = [
  {
    id: 'get-sukl-data', // route id
    url: '/integration-sukl/api/rest/v1/sukl-cuer-data/:insuredId/creditable-surcharges',
    method: 'GET', // HTTP method
    variants: [
      {
        id: 'success', // variant id
        type: 'json', // variant handler id
        options: {
          status: 200, // status to send
          body: SUKL_DATA, // body to send
        },
      },
      {
        id: 'one-row', // variant id
        type: 'json', // variant handler id
        options: {
          status: 200, // status to send
          body: SUKK_DATA_ONE_ROW, // body to send
        },
      },
      {
        id: 'empty', // variant id
        type: 'json', // variant handler id
        options: {
          status: 200, // status to send
          body: SUKK_DATA_EMPTY, // body to send
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
