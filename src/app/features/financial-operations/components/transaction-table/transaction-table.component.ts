import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {AsyncPipe, DatePipe} from "@angular/common";
import {PaginationComponent} from "../../../../shared/components/pagination/pagination.component";
import {ColumnConfig} from '../../../../core/models/table.model';
import {TransactionService} from '../../../../core/services/transaction.service';
import {Transaction} from '../../../../core/models/transaction.model';

@Component({
  selector: 'app-transaction-table',
    imports: [
        DatePipe,
    ],
  templateUrl: './transaction-table.component.html',
  styleUrl: './transaction-table.component.scss'
})
export class TransactionTableComponent  {
  currentSortColumn: string | null = null;
  currentSortDirection: 'asc' | 'desc' = 'asc';
  @Input() transactions: Transaction[] = [];
  @Input() loading: boolean = false;
  @Output() sort = new EventEmitter<string>();

  columns: ColumnConfig[] = [
    {
      key: 'date',
      title: 'Дата',
      sortable: true,
      format: 'date'
    },
    {
      key: 'iziId',
      title: 'IZI ID',
      sortable: true,
      format: 'text'
    },
    {
      key: 'phone',
      title: 'Телефон',
      sortable: true,
      format: 'phone'
    },
    {
      key: 'documentNumber',
      title: '№ Документа',
      sortable: true,
      format: 'text'
    },
    {
      key: 'paymentType',
      title: 'Статья платежа',
      sortable: true,
      format: 'text'
    },
    {
      key: 'amount',
      title: 'Сумма',
      sortable: true,
      format: 'currency'
    },
    {
      key: 'author',
      title: 'Автор',
      sortable: true,
      format: 'text'
    },
    {
      key: 'cashType',
      title: 'Касса',
      sortable: true,
      format: 'text'
    },
    {
      key: 'balanceType',
      title: 'Баланс',
      sortable: true,
      format: 'text'
    },
    {
      key: 'dockLink',
      title: 'Dock',
      sortable: true,
      format: 'link'
    },
    {
      key: 'comment',
      title: 'Комментарий',
      sortable: true,
      format: 'text'
    }
  ];

  onSort(columnKey: string) {
    const column = this.columns.find(c => c.key === columnKey);
    if (!column?.sortable) {
      return
    }

    if(this.currentSortColumn === columnKey) {
      this.currentSortDirection = this.currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSortColumn = columnKey;
      this.currentSortDirection = 'asc';
    }
    this.sort.emit(`${columnKey}:${this.currentSortDirection}`)
  }

  isSortAscActive(columnKey: string): boolean {
    return this.currentSortColumn === columnKey && this.currentSortDirection === 'asc';
  }

  isSortDescActive(columnKey: string): boolean {
    return this.currentSortColumn === columnKey && this.currentSortDirection === 'desc';
  }

  formatCurrency(amount: number): string {
    const formattedAmount = Math.abs(amount).toFixed(2);
    const sign = amount < 0 ? '-' : '';
    return `${sign}${formattedAmount} ₽`;
  }

  formatPhone(phone: string): string {
    const digits = phone.replace(/\D/g, '');

    if (digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'))) {
      return `+ 7 ${digits.slice(1, 4)} ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
    } else if (digits.length === 10) {
      return `+ 7 ${digits.slice(0, 3)} ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 10)}`;
    }

    return phone;
  }
}
