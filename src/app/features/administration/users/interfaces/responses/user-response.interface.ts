import { UserRole } from '../../../../../core/auth/auth.types';

export interface UserResponse {
  id: string;
  fullName: string;
  externalKey: string;
  roles: UserRole[];
}

export interface IdentityCandidateResponse {
  externalKey: string;
  fullName: string;
  email: string | null;
  login: string;
}
