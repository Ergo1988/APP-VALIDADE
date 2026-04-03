import { ExpirationStatus } from '../types';

export const getDaysUntilExpiration = (expirationDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(expirationDate);
  // Fix timezone offset issue by explicitly setting UTC or just using simple calc
  // A simple way to avoid TZ issues with YYYY-MM-DD strings is to treat them as UTC or append T00:00
  const expDate = new Date(exp.getUTCFullYear(), exp.getUTCMonth(), exp.getUTCDate());
  
  const diffTime = expDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getExpirationStatus = (expirationDate: string): ExpirationStatus => {
  const days = getDaysUntilExpiration(expirationDate);

  if (days < 0) return ExpirationStatus.EXPIRED;
  if (days <= 29) return ExpirationStatus.WARNING; // The requested 29-day rule
  return ExpirationStatus.GOOD;
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '-';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};
