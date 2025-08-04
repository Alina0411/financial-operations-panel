import {Component, inject, Input} from '@angular/core';
import {ExportService} from '../../../core/services/export.service';
import {Transaction} from '../../../core/models/transaction.model';

@Component({
  selector: 'app-export-buttons',
  imports: [],
  templateUrl: './export-buttons.component.html',
  styleUrl: './export-buttons.component.scss'
})
export class ExportButtonsComponent {
  exportService = inject(ExportService);
  @Input() transactions: Transaction[] = [];

  async onExportToPdf() {
    if (this.transactions && this.transactions.length > 0) {
      const tableElement = document.querySelector('.transaction-table-container') as HTMLElement;
      
      if (tableElement) {
        try {
          await this.exportService.exportToPDF(tableElement, 'transactions');
        } catch (error: any) {
          alert('Ошибка при экспорте PDF: ' + error.message);
        }
      } else {
        alert('Таблица не найдена на странице');
      }
    } else {
      alert('Нет данных для экспорта');
    }
  }

  onExportToExcel() {
    if (this.transactions && this.transactions.length > 0) {
      this.exportService.exportToExcel(this.transactions, 'transactions');
    }
  }
}
