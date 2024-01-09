import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TextBoxModule } from '@progress/kendo-angular-inputs'

import { TInputComponent } from './t-input.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [TInputComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    TextBoxModule,
    MatIconModule
  ],
  exports: [
    TInputComponent
  ]
})
export class TInputModule { }
