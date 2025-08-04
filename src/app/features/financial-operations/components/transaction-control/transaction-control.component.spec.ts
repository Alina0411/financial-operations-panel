import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionControlComponent } from './transaction-control.component';

describe('TransactionControlComponent', () => {
  let component: TransactionControlComponent;
  let fixture: ComponentFixture<TransactionControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
