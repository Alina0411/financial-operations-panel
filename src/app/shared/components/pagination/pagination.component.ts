import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Pagination} from '../../../core/models/pagination.model';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  @Input() pagination: Pagination = {page: 1, limit: 15, total: 0, totalPages: 0};
  @Output() pageChange = new EventEmitter<number>();
  @Output() limitChange = new EventEmitter<number>();

  onPageChange(page: number) {
    this.pageChange.emit(page);
  }

  onLimitChange(limit: number) {
    this.limitChange.emit(limit);
  }


  getPaginationInfo(): string {
    const start = (this.pagination.page - 1) * this.pagination.limit + 1;
    const end = Math.min(this.pagination.page * this.pagination.limit, this.pagination.total);
    return `${start}-${end} (${this.pagination.total})`;
  }


  getPageNumbers(): number[] {
    const totalPages = this.pagination.totalPages;
    const currentPage = this.pagination.page;
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return Array.from({length: totalPages}, (_, i) => i + 1);
    }

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({length: end - start + 1}, (_, i) => start + i);
  }

  onFirstPage() {
    this.onPageChange(1);
  }

  onPrevPage() {
    if (this.pagination.page > 1) {
      this.onPageChange(this.pagination.page - 1);
    }
  }

  onNextPage() {
    if (this.pagination.page < this.pagination.totalPages) {
      this.onPageChange(this.pagination.page + 1);
    }
  }

  onLastPage() {
    this.onPageChange(this.pagination.totalPages);
  }
}
