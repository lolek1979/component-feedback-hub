module.exports = {
  id: '7bab6f47-a4a2-4684-8d78-be1a46d9aef0',
  name: 'Test',
  description: 'This is just test',
  validFrom: '2024-12-01T00:00:00',
  validTo: null,
  garants: [
    {
      abbrev: 'JB',
      fullName: 'Jiřina Bohdalová',
    },
    {
      abbrev: 'SS',
      fullName: 'Sylvester Stallone',
    },
    {
      abbrev: 'TC',
      fullName: 'Tom Cruise',
    },
  ],
  content: {
    Content: [
      {
        Name: 'beer',
        Price: 55,
      },
      {
        Name: 'coke',
        Price: 45,
      },
      {
        Name: 'water',
        Price: 27,
      },
    ],
    Structure: [
      {
        Code: 'NM',
        Order: 0,
        Default: null,
        ValueType: 'String',
        ColumnName: 'Name',
        Description: 'Item name',
        Validations: [],
      },
      {
        Code: 'PC',
        Order: 1,
        Default: null,
        ValueType: 'Number',
        ColumnName: 'Price',
        Description: 'Item price',
        Validations: [],
      },
    ],
  },
};
