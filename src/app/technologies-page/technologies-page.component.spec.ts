import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnologiesPageComponent } from './technologies-page.component';

describe('TechnologiesPageComponent', () => {
  let component: TechnologiesPageComponent;
  let fixture: ComponentFixture<TechnologiesPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TechnologiesPageComponent]
    });
    fixture = TestBed.createComponent(TechnologiesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
