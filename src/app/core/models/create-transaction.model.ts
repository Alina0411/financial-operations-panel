export interface CreateTransactionDto {
  date: string;
  iziId: string;
  phone: string;
  documentNumber: string;
  paymentType: string;
  amount: number;
  author: string;
  cashType: string;
  balanceType: string;
  dockLink?: string;
  comment?: string;
}

export interface CreateTransactionForm {
  date: string;
  time: string;
  iziId: string;
  phone: string;
  documentNumber: string;
  paymentType: string;
  amount: number;
  author: string;
  cashType: string;
  balanceType: string;
  dockLink: string;
  comment: string;
} 