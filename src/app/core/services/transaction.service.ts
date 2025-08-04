import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, tap, catchError, throwError} from 'rxjs';
import {Transaction} from '../models/transaction.model';
import {TransactionFilter} from '../models/transaction-filter.model';
import {SortConfig} from '../models/sort-config.model';
import {Pagination} from '../models/pagination.model';
import {TransactionApiService} from './transaction-api.service';
import {DateUtils} from '../utils/date.utils';
import {HttpResponse} from '@angular/common/http';
import {CreateTransactionDto} from '../models/create-transaction.model';
import {QueryParams} from '../models/query-params.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  private filtersSubject = new BehaviorSubject<TransactionFilter>({});
  private sortSubject = new BehaviorSubject<SortConfig>({column: 'date', direction: 'desc'});
  private paginationSubject = new BehaviorSubject<Pagination>({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 0
  });

  constructor(private apiService: TransactionApiService) {}

  getTransactions$() {
    return this.transactionsSubject.asObservable();
  }

  getFilters$() {
    return this.filtersSubject.asObservable();
  }

  getSort$() {
    return this.sortSubject.asObservable();
  }

  getPagination$() {
    return this.paginationSubject.asObservable();
  }

  getTransactions(): Observable<HttpResponse<Transaction[]>> {
    const filters = this.filtersSubject.value;
    const sort = this.sortSubject.value;
    const pagination = this.paginationSubject.value;

    const queryParams = this.buildQueryParams(filters, sort, pagination);

    return this.apiService.fetchTransactions(queryParams).pipe(
      tap((response: HttpResponse<Transaction[]>) => {
        this.transactionsSubject.next(response.body || []);
        const total = parseInt(response.headers.get('X-Total-Count') || '0');
        const totalPages = Math.ceil(total / pagination.limit);
        this.paginationSubject.next({
          ...pagination,
          total,
          totalPages
        });
      }),
      catchError(error => {
        return throwError(() => new Error('Ошибка загрузки транзакций'));
      })
    );
  }

  setFilters(filters: TransactionFilter) {
    this.filtersSubject.next(filters);
    const currentPagination = this.paginationSubject.value;
    this.paginationSubject.next({...currentPagination, page: 1});
    this.loadTransactions();
  }

  setSort(sort: SortConfig) {
    this.sortSubject.next(sort);
    const currentPagination = this.paginationSubject.value;
    this.paginationSubject.next({...currentPagination, page: 1});
    this.loadTransactions();
  }

  setPage(page: number) {
    const currentPagination = this.paginationSubject.value;
    this.paginationSubject.next({...currentPagination, page});
    this.loadTransactions();
  }

  setLimit(limit: number) {
    const currentPagination = this.paginationSubject.value;
    this.paginationSubject.next({...currentPagination, limit, page: 1});
    this.loadTransactions();
  }

  private loadTransactions() {
    this.getTransactions().subscribe({
      error: (error) => {
        console.error('Ошибка загрузки транзакций:', error);
      }
    });
  }

  resetPagination() {
    this.paginationSubject.next({
      page: 1,
      limit: 15,
      total: 0,
      totalPages: 0
    });
  }

  resetPage() {
    const currentPagination = this.paginationSubject.value;
    this.paginationSubject.next({...currentPagination, page: 1});
  }

  createTransaction(transactionData: CreateTransactionDto): Observable<Transaction> {
    return this.apiService.createTransaction(transactionData).pipe(
      tap((newTransaction: Transaction) => {
        const currentTransactions = this.transactionsSubject.value;
        this.transactionsSubject.next([newTransaction, ...currentTransactions]);
      }),
      catchError(error => {
        return throwError(() => new Error('Ошибка создания транзакции'));
      })
    );
  }

  private buildQueryParams(filters: TransactionFilter, sort: SortConfig, pagination: Pagination): QueryParams {
    const params: QueryParams = {
      _page: pagination.page,
      _limit: pagination.limit,
      _sort: sort.column,
      _order: sort.direction
    };

    if (filters.startDate && filters.endDate) {
      params.date_gte = DateUtils.toStartOfDay(filters.startDate);
      params.date_lte = DateUtils.toEndOfDay(filters.endDate);
    }

    return params;
  }
}
