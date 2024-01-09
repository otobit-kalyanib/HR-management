import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EmpSignupComponent } from './emp-signup/emp-signup.component';
import { EmpSigninComponent } from './emp-signin/emp-signin.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
  standalone: true,
  imports:[EmpSignupComponent,CommonModule,EmpSigninComponent, RouterOutlet]
})
export class EmployeeComponent {

}
