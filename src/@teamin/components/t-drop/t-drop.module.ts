import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatTooltipModule } from '@angular/material/tooltip';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns'

import { TDropComponent } from './t-drop.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [TDropComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatIconModule,
    DropDownListModule
  ],
  exports: [
    TDropComponent
  ]
})
export class TDropModule {

}
