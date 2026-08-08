export interface AuthUser {
  id: string;
  fullName: string;
  externalKey: string;
  roles: UserRole[];
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
