import {Component, inject, OnInit} from '@angular/core';
import {CdkTableModule} from '@angular/cdk/table';
import {TransactionControlComponent} from './components/transaction-control/transaction-control.component';
import {PaginationComponent} from '../../shared/components/pagination/pagination.component';
import {TransactionTableComponent} from './components/transaction-table/transaction-table.component';
import {TransactionService} from '../../core/services/transaction.service';
import {AsyncPipe} from '@angular/common';
import {MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-financial-operations',
  imports: [
    CdkTableModule, 
    TransactionControlComponent, 
    PaginationComponent, 
    TransactionTableComponent, 
    AsyncPipe,
    MatDialogModule
  ],
  templateUrl: './financial-operations.component.html',
  styleUrl: './financial-operations.component.scss',
})

export class FinancialOperationsComponent implements OnInit {
  transactionService = inject(TransactionService)
  transactions$ = this.transactionService.getTransactions$();
  pagination$ = this.transactionService.getPagination$();

  ngOnInit() {
    this.transactionService.getTransactions().subscribe();
  }

  onSort(sortData: string) {
    const [columnKey, direction] = sortData.split(':');
    this.transactionService.setSort({column: columnKey, direction: direction as 'asc' | 'desc'});
  }

  onPageChange(page: number) {
    this.transactionService.setPage(page);
  }

  onLimitChange(limit: number) {
    this.transactionService.setLimit(limit);
  }
}

