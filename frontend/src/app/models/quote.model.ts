export type QuoteStatus = 'pending' | 'accepted' | 'rejected';

export interface Quote {
  _id: string;
  requestId: string | { _id: string; title: string; status: string; location: string; categoryId?: { _id: string; name: string } };
  providerId: string | { _id: string; fullName: string; email: string };
  price: number;
  message: string;
  daysToComplete: number;
  status: QuoteStatus;
  createdAt?: string;
}
