import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestProjectsComponent } from './latest-projects.component';

describe('LatestProjectsComponent', () => {
  let component: LatestProjectsComponent;
  let fixture: ComponentFixture<LatestProjectsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LatestProjectsComponent]
    });
    fixture = TestBed.createComponent(LatestProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
