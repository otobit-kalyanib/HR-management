import { Routes } from "@angular/router"
import { EmpSigninComponent } from "./employee/emp-signin/emp-signin.component";
import { EmpSignupComponent } from "./employee/emp-signup/emp-signup.component";

export default [
    {path:'signin',component:EmpSigninComponent},
    {path:'signup',component:EmpSignupComponent},
    {path:'',redirectTo:'/user/signup',pathMatch:"full"},
] as Routes; 
