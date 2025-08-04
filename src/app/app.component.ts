import { Component } from '@angular/core';
import {FinancialOperationsComponent} from './features/financial-operations/financial-operations.component';

@Component({
  selector: 'app-root',
  imports: [FinancialOperationsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'financial-operations-panel';
}
