export interface AuthUser {
  id: string;
  instId: string;
  roleId: string;
  roleName: string; 
  permissions: string[];
  isTempPassword: boolean;
}