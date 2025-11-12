// AuditLog type for the audit log entries
export interface AuditLog {
  id: number;
  timestamp: string;
  application: string;
  domain: string;
  component: string;
  identityId: string | null;
  entityId: string | null;
  sessionId: string | null;
  messageBody: {
    id: number;
    authentication: string;
    rbac: string;
    abac: string;
    operation: string;
  };
  success: boolean;
}
