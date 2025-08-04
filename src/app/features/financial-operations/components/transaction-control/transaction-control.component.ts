import {Component, inject} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {TransactionService} from '../../../../core/services/transaction.service';
import {Transaction} from '../../../../core/models/transaction.model';
import {AddTransactionModalComponent} from '../add-transaction-modal/add-transaction-modal.component';
import {DateRangePickerComponent} from '../../../../shared/components/date-range-picker/date-range-picker.component';
import {ExportButtonsComponent} from '../../../../shared/components/export-buttons/export-buttons.component';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-transaction-control',
  standalone: true,
  imports: [
    DateRangePickerComponent,
    ExportButtonsComponent,
    AsyncPipe
  ],
  templateUrl: './transaction-control.component.html',
  styleUrl: './transaction-control.component.scss'
})
export class TransactionControlComponent {
  private transactionService = inject(TransactionService);
  private dialog = inject(MatDialog);

  transactions$ = this.transactionService.getTransactions$();
  pagination$ = this.transactionService.getPagination$();
  filters$ = this.transactionService.getFilters$();

  onDateRangeChange(dateRange: { startDate: string; endDate: string }) {
    this.transactionService.setFilters({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate
    });
  }

  onAddTransaction() {
    const dialogRef = this.dialog.open(AddTransactionModalComponent, {
      width: '750px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: true,
      autoFocus: false,
      panelClass: 'custom-dialog',
      hasBackdrop: true,
      backdropClass: 'custom-backdrop'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTransactions();
      }
    });
  }

  private loadTransactions() {
    this.transactionService.getTransactions().subscribe({
      error: (error) => {
        console.error('Ошибка загрузки транзакций:', error);
      }
    });
  }
}
