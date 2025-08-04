export interface ColumnConfig  {
  key: string;
  title: string;
  sortable: boolean;
  format: 'date' | 'currency' | 'phone'  | 'text' | 'link';
}


