import { Route } from '@angular/router';
import { EmpManagementComponent } from './emp-management/emp-management.component';
import { HomeComponent } from './emp-management/employee/home/home.component';
import { DashboardComponent } from './emp-management/admin/dashboard/dashboard.component';
// import { LandingHomeComponent } from './modules/landing/home/home.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [
    {path:'',redirectTo:'/user/signin',pathMatch:'full'},
    {path:'user',component:EmpManagementComponent,loadChildren:()=> import('./emp-management/emp-management.routes')},
    {path:'dashboard',component:DashboardComponent},
    {path:'home',component:HomeComponent}
];
