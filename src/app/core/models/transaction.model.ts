
export interface Transaction {
  id: number;
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


export const PAYMENT_TYPES = [
  'Пополнение баланса',
  'Списание средств',
  'Бонусная выплата'
] as const;

export const CASH_TYPES = [
  'Нал.',
  'Б.Нал.'
] as const;

export const BALANCE_TYPES = [
  'Игровой',
  'Бонусный'
] as const;

export const AUTHORS = [
  'Admin1',
  'Admin2',
  'Admin3',
  'System'
] as const;

