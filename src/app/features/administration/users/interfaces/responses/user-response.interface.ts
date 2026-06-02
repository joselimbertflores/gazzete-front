export interface UserResponse {
  id: string;
  fullName: string;
  externalKey: string;
  isActive: boolean;
  roles: string[];
}

export interface IdentityCandidateResponse {
  externalKey: string;
  fullName: string;
  email: string | null;
  login: string;
}
