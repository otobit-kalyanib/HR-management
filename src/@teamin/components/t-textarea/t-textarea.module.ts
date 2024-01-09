import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TTextAreaComponent } from './t-textarea.component';

@NgModule({
  declarations: [TTextAreaComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule
  ],
  exports:[
    TTextAreaComponent
  ]
})
export class TTextAreaModule { }
