const requeterRequests = require('../../../json/requests/RequeterRequests');
const requestById = require('../../../json/requests/RequestById');
const userRequests = require('../../../json/requests/UserRequests');
const newRequestResponse = require('../../../json/requests/NewRequestResponse');
const cscCatalogue = require('../../../json/requests/CSCCatalogue');

module.exports = [
  // GET requester requests
  {
    id: 'get-requester-requests',
    url: '/requestform/api/v1/Request/ForRequester',
    method: 'GET',
    variants: [
      {
        id: 'success',
        type: 'json',
        options: {
          status: 200,
          body: requeterRequests.success,
        },
      },
      {
        id: 'error',
        type: 'json',
        options: {
          status: 400,
          body: requeterRequests.error,
        },
      },
    ],
  },

  // GET admin requests
  {
    id: 'get-admin-requests',
    url: '/requestform/api/v1/Request/ForAdmin',
    method: 'GET',
    variants: [
      {
        id: 'success',
        type: 'json',
        options: {
          status: 200,
          body: requeterRequests.success,
        },
      },
      {
        id: 'error',
        type: 'json',
        options: {
          status: 400,
          body: requeterRequests.error,
        },
      },
    ],
  },

  // GET approver requests
  {
    id: 'get-approver-requests',
    url: '/requestform/api/v1/Request/ForApprover',
    method: 'GET',
    variants: [
      {
        id: 'success',
        type: 'json',
        options: {
          status: 200,
          body: requeterRequests.success,
        },
      },
      {
        id: 'error',
        type: 'json',
        options: {
          status: 400,
          body: requeterRequests.error,
        },
      },
    ],
  },

  // GET purchaser requests
  {
    id: 'get-purchaser-requests',
    url: '/requestform/api/v1/Request/ForPurchaser',
    method: 'GET',
    variants: [
      {
        id: 'success',
        type: 'json',
        options: {
          status: 200,
          body: requeterRequests.success,
        },
      },
      {
        id: 'error',
        type: 'json',
        options: {
          status: 400,
          body: requeterRequests.error,
        },
      },
    ],
  },

  // GET request by id
  {
    id: 'get-request-by-id',
    url: '/requestform/api/v1/Request/:id',
    method: 'GET',
    variants: [
      {
        id: 'success',
        type: 'json',
        options: {
          status: 200,
          body: requestById.success,
        },
      },
      {
        id: 'error',
        type: 'json',
        options: {
          status: 400,
          body: requestById.error,
        },
      },
    ],
  },

  // GET user info
  {
    id: 'get-user-info',
    url: '/requestform/api/v1/User/Self',
    method: 'GET',
    variants: [
      {
        id: 'success',
        type: 'json',
        options: {
          status: 200,
          body: userRequests.success,
        },
      },
      {
        id: 'error',
        type: 'json',
        options: {
          status: 400,
          body: userRequests.error,
        },
      },
    ],
  },

  // POST new request
  {
    id: 'post-new-request',
    url: '/requestform/api/v1/Request',
    method: 'POST',
    variants: [
      {
        id: 'success',
        type: 'json',
        options: {
          status: 201,
          body: newRequestResponse.success,
        },
      },
      {
        id: 'error',
        type: 'json',
        options: {
          status: 400,
          body: newRequestResponse.error,
        },
      },
    ],
  },

  // GET catalogue items
  {
    id: 'get-csc-catalogue',
    url: '/requestform/api/v1/Codebook/Catalogue',
    method: 'GET',
    variants: [
      {
        id: 'success',
        type: 'middleware',
        options: {
          middleware: (req, res) => {
            const { fulltextSearch, favouriteOnly } = req.query;

            // Start with all items
            let filteredItems = [...cscCatalogue.success.payload.items];

            // Filter by search text if provided
            if (fulltextSearch) {
              const searchLower = fulltextSearch.toLowerCase();
              filteredItems = filteredItems.filter(
                (item) =>
                  item.description.toLowerCase().includes(searchLower) ||
                  item.sapNumber.toLowerCase().includes(searchLower),
              );
            }

            // Filter by favorites if specified
            if (favouriteOnly === 'true') {
              filteredItems = filteredItems.filter((item) => item.isFavorite);
            }

            // Create response with filtered items
            const response = {
              ...cscCatalogue.success,
              payload: {
                total: filteredItems.length,
                items: filteredItems,
              },
            };

            res.status(200).json(response);
          },
        },
      },
      {
        id: 'error',
        type: 'json',
        options: {
          status: 400,
          body: cscCatalogue.error,
        },
      },
      // Add a standard JSON variant as fallback
      {
        id: 'default',
        type: 'json',
        options: {
          status: 200,
          body: cscCatalogue.success,
        },
      },
    ],
  },
];
