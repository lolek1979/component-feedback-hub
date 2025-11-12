module.exports = [
  {
    id: 'post-codelist-version-import',
    url: '/codelists/api/rest/v1/codelists/:id/drafts/import',
    method: 'POST',
    variants: [
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
      {
        id: 'error:400',
        type: 'json',
        options: {
          status: 400,
          body: {
            message: 'Bad Request',
          },
        },
      },
      {
        id: 'error:401',
        type: 'json',
        options: {
          status: 401,
          body: {
            message: 'Unauthorized',
          },
        },
      },
      {
        id: 'error:403',
        type: 'json',
        options: {
          status: 403,
          body: {
            message: 'Forbidden',
          },
        },
      },
    ],
  },
];
