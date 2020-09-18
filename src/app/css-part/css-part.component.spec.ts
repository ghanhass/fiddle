import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CssPartComponent } from './css-part.component';

describe('CssPartComponent', () => {
  let component: CssPartComponent;
  let fixture: ComponentFixture<CssPartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CssPartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CssPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
