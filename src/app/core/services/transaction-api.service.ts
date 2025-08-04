import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {catchError, throwError} from 'rxjs';
import {QueryParams} from '../models/query-params.model';
import {Transaction} from '../models/transaction.model';
import {CreateTransactionDto} from '../models/create-transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionApiService {
  #http = inject(HttpClient);
  baseUrl = 'http://localhost:3000';

  fetchTransactions(params: QueryParams) {
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
    return this.#http
      .post<Transaction>(`${this.baseUrl}/transactions`, transaction)
      .pipe(
        catchError((error) => {
          return throwError(() => new Error('Ошибка создания транзакции'));
        })
      );
  }
}
