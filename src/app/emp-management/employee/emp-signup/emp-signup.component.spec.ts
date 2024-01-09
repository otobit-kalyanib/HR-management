import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpSignupComponent } from './emp-signup.component';

describe('EmpSignupComponent', () => {
  let component: EmpSignupComponent;
  let fixture: ComponentFixture<EmpSignupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmpSignupComponent]
    });
    fixture = TestBed.createComponent(EmpSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
