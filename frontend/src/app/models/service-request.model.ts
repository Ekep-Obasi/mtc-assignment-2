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
  categoryId: string;
  createdBy: string;
  location: string;
  status: RequestStatus;
  acceptedQuoteId?: string;
  createdAt?: string;
  updatedAt?: string;
}