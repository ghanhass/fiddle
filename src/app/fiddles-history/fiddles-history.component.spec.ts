import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiddlesHistoryComponent } from './fiddles-history.component';

describe('FiddlesHistoryComponent', () => {
  let component: FiddlesHistoryComponent;
  let fixture: ComponentFixture<FiddlesHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiddlesHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiddlesHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
