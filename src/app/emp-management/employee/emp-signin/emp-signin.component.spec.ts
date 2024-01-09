import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpSigninComponent } from './emp-signin.component';

describe('EmpSigninComponent', () => {
  let component: EmpSigninComponent;
  let fixture: ComponentFixture<EmpSigninComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmpSigninComponent]
    });
    fixture = TestBed.createComponent(EmpSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
