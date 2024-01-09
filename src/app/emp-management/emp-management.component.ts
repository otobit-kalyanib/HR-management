import { Component } from '@angular/core';
import { EmployeeComponent } from './employee/employee.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-emp-management',
  templateUrl: './emp-management.component.html',
  styleUrls: ['./emp-management.component.scss'],
  standalone: true,
  imports:[EmployeeComponent,CommonModule,RouterOutlet]
  
})
export class EmpManagementComponent {

}
