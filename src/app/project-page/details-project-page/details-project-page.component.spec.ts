import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsProjectPageComponent } from './details-project-page.component';

describe('DetailsProjectPageComponent', () => {
  let component: DetailsProjectPageComponent;
  let fixture: ComponentFixture<DetailsProjectPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsProjectPageComponent]
    });
    fixture = TestBed.createComponent(DetailsProjectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
