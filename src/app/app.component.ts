import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmpManagementComponent } from './emp-management/emp-management.component';
import { CommonModule } from '@angular/common';

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss'],
    standalone : true,

    imports    : [RouterOutlet,EmpManagementComponent, CommonModule],
})
export class AppComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
