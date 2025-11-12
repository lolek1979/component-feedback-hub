export const codeListMode = {
  read: 'read',
  edit: 'edit',
} as const;

export const codeListStatus = {
  planned: 'planned',
  active: 'active',
  concept: 'concept',
  expired: 'expired',
  approval: 'waitingforapproval',
  rejected: 'rejected',
} as const;

export type CodeListStatus = (typeof codeListStatus)[keyof typeof codeListStatus];

export const feedbackScreenshotKey = 'feedbackScreenshot';

export * from './administrativeProceeding';
