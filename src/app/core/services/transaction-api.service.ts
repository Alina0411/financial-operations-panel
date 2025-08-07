import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {catchError, throwError, of} from 'rxjs';
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

  // Моковые данные для демонстрации
  private mockTransactions: Transaction[] = [
    {
      id: 1,
      date: '2024-01-15T10:30:00',
      iziId: 'IZI001',
      phone: '7771234567',
      documentNumber: 'DOC001',
      paymentType: 'Наличные',
      amount: 15000,
      author: 'Admin1',
      cashType: 'Касса',
      balanceType: 'Основной',
      dockLink: 'https://example.com/doc1',
      comment: 'Первая транзакция'
    },
    {
      id: 2,
      date: '2024-01-16T14:20:00',
      iziId: 'IZI002',
      phone: '7777654321',
      documentNumber: 'DOC002',
      paymentType: 'Банковская карта',
      amount: 25000,
      author: 'Admin2',
      cashType: 'Банк',
      balanceType: 'Резервный',
      dockLink: 'https://example.com/doc2',
      comment: 'Вторая транзакция'
    }
  ];

  fetchTransactions(params: QueryParams) {
    // В production используем моковые данные
    if (environment.production) {
      const response = new HttpResponse({
        body: this.mockTransactions,
        status: 200
      });
      return of(response);
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
    // В production добавляем к моковым данным
    if (environment.production) {
      const newTransaction: Transaction = {
        ...transaction,
        id: this.mockTransactions.length + 1
      };
      this.mockTransactions.push(newTransaction);
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
