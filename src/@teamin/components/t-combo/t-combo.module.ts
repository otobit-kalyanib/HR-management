import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatTooltipModule } from '@angular/material/tooltip';
import { ComboBoxModule } from '@progress/kendo-angular-dropdowns'

import { TComboComponent } from './t-combo.component';
import { MatIconModule } from '@angular/material/icon';
import { TCreateComponent } from '@teamin/layouts/t-create/t-create.component';

@NgModule({
  declarations: [TComboComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatIconModule,
    ComboBoxModule
  ],
  exports: [
    TComboComponent
  ],
  providers: [TCreateComponent]
})
export class TComboModule {

}
