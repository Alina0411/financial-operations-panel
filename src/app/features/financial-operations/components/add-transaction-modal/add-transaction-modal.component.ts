import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {CommonModule} from '@angular/common';
import {TransactionService} from '../../../../core/services/transaction.service';
import {CreateTransactionDto, CreateTransactionForm} from '../../../../core/models/create-transaction.model';

@Component({
  selector: 'app-add-transaction-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-transaction-modal.component.html',
  styleUrl: './add-transaction-modal.component.scss'
})
export class AddTransactionModalComponent {
  form: FormGroup;
  error: string = '';
  loading: boolean = false;

  paymentTypes = [
    'Пополнение баланса',
    'Списание средств',
    'Бонусная выплата',
    'Комиссия',
    'Возврат средств'
  ];

  cashTypes = [
    'Нал.',
    'Б.Нал.'
  ];

  balanceTypes = [
    'Игровой',
    'Бонусный',
  ];

  authors = [
    'Admin1',
    'Admin2',
    'Admin3',
    'System'
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddTransactionModalComponent>,
    private transactionService: TransactionService
  ) {
    this.form = this.fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
      iziId: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      documentNumber: ['', Validators.required],
      paymentType: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      author: ['', Validators.required],
      cashType: ['', Validators.required],
      balanceType: ['', Validators.required],
      dockLink: [''],
      comment: ['']
    });

    const now = new Date();
    this.form.patchValue({
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5),
      author: 'Admin1'
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.error = '';

      const formValue: CreateTransactionForm = this.form.value;

      const selectedDate = new Date(formValue.date);
      const [hours, minutes] = formValue.time.split(':').map(Number);
      selectedDate.setHours(hours, minutes, 0, 0);

      const transactionData: CreateTransactionDto = {
        ...formValue,
        date: selectedDate.toISOString(),
        amount: Number(formValue.amount),
        dockLink: formValue.dockLink || undefined,
        comment: formValue.comment || undefined
      };

      this.transactionService.createTransaction(transactionData).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.error = error.message || 'Ошибка создания транзакции';
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  private markFormGroupTouched() {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }

  get date() { return this.form.get('date'); }
  get time() { return this.form.get('time'); }
  get iziId() { return this.form.get('iziId'); }
  get phone() { return this.form.get('phone'); }
  get documentNumber() { return this.form.get('documentNumber'); }
  get paymentType() { return this.form.get('paymentType'); }
  get amount() { return this.form.get('amount'); }
  get author() { return this.form.get('author'); }
  get cashType() { return this.form.get('cashType'); }
  get balanceType() { return this.form.get('balanceType'); }
  get dockLink() { return this.form.get('dockLink'); }
  get comment() { return this.form.get('comment'); }
}
