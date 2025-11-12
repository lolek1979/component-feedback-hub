/**
 * Action type codes for administrative proceedings.
 *
 * @type {object}
 */
export const adminProcessActionTypeCodes = {
  caseInit: 'CASE_INIT',
  reqProc: 'REQ_PROC',
  reqValid: 'REQ_VALID',
  decDraft: 'DEC_DRAFT',
} as const;

/**
 * Type representing possible action type codes for administrative proceedings.
 *
 * @see {@link adminProcessActionTypeCodes}
 */
export type AdminProcessActionTypeCode =
  (typeof adminProcessActionTypeCodes)[keyof typeof adminProcessActionTypeCodes];

/**
 * Decision type codes for administrative proceedings.
 *
 * @type {object}
 */
export const adminProcessDecisionTypeCodes = {
  full: 'FULL',
  part: 'PART',
  deny: 'DENY',
} as const;

/**
 * Type representing possible decision type codes for administrative proceedings.
 *
 * @see {@link adminProcessDecisionTypeCodes}
 */
export type AdminProcessDecisionTypeCode =
  (typeof adminProcessDecisionTypeCodes)[keyof typeof adminProcessDecisionTypeCodes];
