export type UserRole = 'resident' | 'provider';

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}