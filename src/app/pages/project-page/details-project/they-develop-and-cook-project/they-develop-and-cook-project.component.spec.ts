import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheyDevelopAndCookProjectComponent } from './they-develop-and-cook-project.component';

describe('TheyDevelopAndCookProjectComponent', () => {
  let component: TheyDevelopAndCookProjectComponent;
  let fixture: ComponentFixture<TheyDevelopAndCookProjectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TheyDevelopAndCookProjectComponent]
    });
    fixture = TestBed.createComponent(TheyDevelopAndCookProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
