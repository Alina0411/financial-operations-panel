import {Component, EventEmitter, OnDestroy, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Subject} from 'rxjs';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {DateUtils} from '../../../core/utils/date.utils';

@Component({
  selector: 'app-date-range-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './date-range-picker.component.html',
  styleUrl: './date-range-picker.component.scss'
})
export class DateRangePickerComponent implements OnDestroy {
  @Output() dateRangeChange = new EventEmitter<{startDate: string; endDate: string}>();

  startDate: string = '';
  endDate: string = '';

  private dateChangeSubject = new Subject<void>();
  private destroy$ = new Subject<void>();

  constructor() {
    this.dateChangeSubject.pipe(
      debounceTime(500),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.emitDateRange();
    });
  }

  onStartDateChange() {
    this.dateChangeSubject.next();
  }

  onEndDateChange() {
    this.dateChangeSubject.next();
  }

  onShowClick() {
    this.emitDateRange();
  }

  private emitDateRange() {
    this.dateRangeChange.emit({
      startDate: DateUtils.toISODate(this.startDate),
      endDate: DateUtils.toISODate(this.endDate)
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
