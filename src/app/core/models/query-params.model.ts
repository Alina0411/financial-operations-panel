export interface QueryParams {
  _sort?: string;
  _order?: 'asc' | 'desc';
  _page?: number;
  _limit?: number;
  fromDate?: string;
  toDate?: string;
  date_gte?: string;
  date_lte?: string;
  paymentType?: string;
  author?: string;
  cashType?: string;
  balanceType?: string;
  search?: string;
}
