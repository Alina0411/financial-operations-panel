import {Injectable} from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  exportToExcel(data: any[], filename: string = 'transactions'): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  }

  async exportToPDF(element: HTMLElement, filename: string = 'transactions'): Promise<void> {
    try {
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;

      const title = 'Transactions Report';
      let yPosition = margin + 10;

      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(title, pageWidth / 2, yPosition, {align: 'center'});
      yPosition += 15;

      const headers = ['Date', 'ID', 'Phone', 'Document', 'Type', 'Amount', 'Author', 'Cash', 'Balance', 'Link', 'Comment'];
      const columnWidths = [25, 15, 40, 25, 15, 20, 20, 15, 20, 15, 20];

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      let xPosition = margin;
      headers.forEach((header, index) => {
        pdf.text(header, xPosition, yPosition);
        xPosition += columnWidths[index];
      });
      yPosition += 8;

      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'normal');

      const tableData = this.extractTableData(element);

      tableData.forEach((row: any) => {
        if (yPosition > pageHeight - margin - 10) {
          pdf.addPage();
          yPosition = margin + 10;
        }

        xPosition = margin;
        Object.values(row).forEach((value: any, index: number) => {
          let text = String(value || '').trim();

          if (index === 2) {
            text = text.substring(0, 25);
          } else {
            text = text.substring(0, 15);
          }

          if (text && text.length > 0) {
            try {
              pdf.text(text, xPosition, yPosition);
            } catch (error) {
              console.warn('Ошибка добавления текста:', error);
            }
          }
          xPosition += columnWidths[index];
        });
        yPosition += 5;
      });

      pdf.save(`${filename}.pdf`);

    } catch (error: any) {
      console.error('Ошибка при экспорте PDF:', error);
      alert(`Ошибка при создании PDF: ${error.message || 'Неизвестная ошибка'}`);
    }
  }

  private extractTableData(tableElement: HTMLElement): any[] {
    const tableRows = tableElement.querySelectorAll('.table-row');
    const data: any[] = [];

    tableRows.forEach((row) => {
      const cells = row.querySelectorAll('.table-cell');
      const rowData: any = {};

      cells.forEach((cell, cellIndex) => {
        const key = `column${cellIndex}`;
        let text = cell.textContent?.trim() || '';

        text = text.replace(/\s+/g, ' ');
        text = text.replace(/[^\w\s\-\.\/\(\)\+:]/g, '');

        rowData[key] = text || '-';
      });

      data.push(rowData);
    });

    return data;
  }


}
