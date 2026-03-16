export type RequestStatus =
  | 'open'
  | 'quoted'
  | 'assigned'
  | 'completed'
  | 'cancelled';

export interface ServiceRequest {
  _id: string;
  title: string;
  description: string;
  categoryId: string | { _id: string; name: string };
  createdBy: string | { _id: string; fullName: string; email: string };
  location: string;
  status: RequestStatus;
  acceptedQuoteId?: string;
  createdAt?: string;
  updatedAt?: string;
}
