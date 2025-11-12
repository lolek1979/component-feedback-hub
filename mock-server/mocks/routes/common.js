// Use this file only as a guide for first steps using middleware variants. You can delete it when you have understood the concepts.
// For a detailed explanation about using middlewares, visit:
// https://mocks-server.org/docs/usage/variants/middlewares

module.exports = [
  {
    id: 'add-headers', //route id
    url: '*', // url in express format
    method: ['GET', 'POST', 'PUT', 'PATCH'], // HTTP methods
    variants: [
      {
        id: 'default',
        response: {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization',
          },
        },
      },
    ],
  },
];
