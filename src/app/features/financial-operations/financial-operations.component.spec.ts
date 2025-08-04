import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialOperationsComponent } from './financial-operations.component';

describe('FinancialOperationsComponent', () => {
  let component: FinancialOperationsComponent;
  let fixture: ComponentFixture<FinancialOperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialOperationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
