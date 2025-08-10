import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {catchError, throwError, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {QueryParams} from '../models/query-params.model';
import {Transaction} from '../models/transaction.model';
import {CreateTransactionDto} from '../models/create-transaction.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionApiService {
  #http = inject(HttpClient);
  baseUrl = environment.apiUrl;

  fetchTransactions(params: QueryParams) {
    // В production используем статический JSON файл
    if (environment.production) {
      return this.#http
        .get<{transactions: Transaction[]}>('/assets/data/db.json')
        .pipe(
          map(response => {
            let transactions = response.transactions;
            
            // Применяем фильтрацию по датам на клиентской стороне
            if (params.date_gte && params.date_lte) {
              transactions = this.filterTransactionsByDate(transactions, params.date_gte, params.date_lte);
            }
            
            // Применяем сортировку на клиентской стороне
            if (params._sort && params._order) {
              transactions = this.sortTransactions(transactions, params._sort, params._order);
            }
            
            // Применяем пагинацию на клиентской стороне
            if (params._page && params._limit) {
              const startIndex = (params._page - 1) * params._limit;
              const endIndex = startIndex + params._limit;
              transactions = transactions.slice(startIndex, endIndex);
            }
            
            const response2 = new HttpResponse({
              body: transactions,
              status: 200,
              headers: new Map([
                ['X-Total-Count', response.transactions.length.toString()]
              ]) as any
            });
            return response2;
          }),
          catchError((error) => {
            return throwError(() => new Error('Ошибка загрузки транзакций'));
          })
        );
    }

    // В development используем json-server
    let httpParams = new HttpParams();
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, value.toString());
        }
      }
    }
    return this.#http
      .get<Transaction[]>(`${this.baseUrl}/transactions`, {
        params: httpParams,
        observe: 'response'
      }).pipe(
        catchError((error) => {
          return throwError(() => new Error('Ошибка загрузки транзакций'));
        })
      )
  }

  createTransaction(transaction: CreateTransactionDto) {
    // В production просто возвращаем успех (данные не сохраняются)
    if (environment.production) {
      const newTransaction: Transaction = {
        ...transaction,
        id: Date.now() // Временный ID
      };
      return of(newTransaction);
    }

    // В development используем json-server
    return this.#http
      .post<Transaction>(`${this.baseUrl}/transactions`, transaction)
      .pipe(
        catchError((error) => {
          return throwError(() => new Error('Ошибка создания транзакции'));
        })
      );
  }

  private filterTransactionsByDate(transactions: Transaction[], startDate: string, endDate: string): Transaction[] {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= start && transactionDate <= end;
    });
  }

  private sortTransactions(transactions: Transaction[], column: string, direction: 'asc' | 'desc'): Transaction[] {
    return [...transactions].sort((a, b) => {
      let aValue: any = a[column as keyof Transaction];
      let bValue: any = b[column as keyof Transaction];

      // Обработка специальных типов данных
      if (column === 'date') {
        // Более надежная обработка дат
        const dateA = new Date(aValue);
        const dateB = new Date(bValue);
        
        // Проверяем, что даты валидные
        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
          console.warn('Invalid date format:', aValue, bValue);
          return 0;
        }
        
        aValue = dateA.getTime();
        bValue = dateB.getTime();
      } else if (column === 'amount') {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      } else if (typeof aValue === 'number') {
        aValue = aValue || 0;
        bValue = bValue || 0;
      }

      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
}
