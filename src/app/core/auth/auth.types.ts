export interface AuthUser {
  id: string;
  fullName: string;
  externalKey: string;
  isActive: boolean;
  roles: UserRole[];
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
