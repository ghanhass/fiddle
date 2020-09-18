import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JsPartComponent } from './js-part.component';

describe('JsPartComponent', () => {
  let component: JsPartComponent;
  let fixture: ComponentFixture<JsPartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JsPartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
