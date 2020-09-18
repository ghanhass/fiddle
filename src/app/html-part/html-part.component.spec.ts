import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlPartComponent } from './html-part.component';

describe('HtmlPartComponent', () => {
  let component: HtmlPartComponent;
  let fixture: ComponentFixture<HtmlPartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HtmlPartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
