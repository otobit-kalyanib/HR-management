import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridModule } from '@progress/kendo-angular-grid'

import { TGridDataComponent } from './t-grid-data.component'

@NgModule({
  declarations: [TGridDataComponent],
  imports: [
    CommonModule,
    GridModule
  ],
  exports:[
    TGridDataComponent
  ]
})
export class TGridDataModule { }
