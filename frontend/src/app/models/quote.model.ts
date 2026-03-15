export type QuoteStatus = 'pending' | 'accepted' | 'rejected';

export interface Quote {
  _id: string;
  requestId: string;
  providerId: string;
  price: number;
  message: string;
  daysToComplete: number;
  status: QuoteStatus;
  createdAt?: string;
}