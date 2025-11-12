export const parseAsBoolean = {
  withDefault: jest.fn().mockReturnValue({}),
};

export const useQueryState = jest.fn();

export const parseAsString = {
  withDefault: jest.fn().mockReturnValue({}),
};

export const parseAsInteger = {
  withDefault: jest.fn().mockReturnValue({}),
};

export const createParser = jest.fn().mockReturnValue({
  withDefault: jest.fn().mockReturnValue({}),
});

const nuqs = {
  parseAsBoolean,
  useQueryState,
  parseAsString,
  parseAsInteger,
  createParser,
};

export default nuqs;
