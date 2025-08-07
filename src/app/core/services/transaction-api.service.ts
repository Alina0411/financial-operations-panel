import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {catchError, throwError, of} from 'rxjs';
import {QueryParams} from '../models/query-params.model';
import {Transaction} from '../models/transaction.model';
import {CreateTransactionDto} from '../models/create-transaction.model';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

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
          catchError((error) => {
            return throwError(() => new Error('Ошибка загрузки транзакций'));
          })
        )
        .pipe(
          map(response => {
            const response2 = new HttpResponse({
              body: response.transactions,
              status: 200
            });
            return response2;
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
}
