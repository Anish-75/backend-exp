export interface AuthUser {
  id: string;
  instId: string;
  roleId: string;
  permissions: string[];
  isTempPassword: boolean;
}
