export interface Product {
  id: string;
  name: string;
  category: string;
  expirationDate: string; // YYYY-MM-DD
  quantity: number;
  unit: string;
  notes?: string;
}

export enum ExpirationStatus {
  GOOD = 'GOOD',
  WARNING = 'WARNING', // The 29-day rule
  EXPIRED = 'EXPIRED'
}

export interface SuggestionResult {
  productName: string;
  suggestions: string;
}
