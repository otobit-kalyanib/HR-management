import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TFilterComponent } from './t-filter.component';
import { FilterModule } from '@progress/kendo-angular-filter';


@NgModule({
  declarations: [
    TFilterComponent
  ],
  imports: [
    CommonModule,
    FilterModule,
  ]
})
export class TFilterModule { }
