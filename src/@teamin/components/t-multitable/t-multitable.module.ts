import { NgModule } from "@angular/core";

import { NgxIntlTelInputModule } from "ngx-intl-tel-input";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTooltipModule } from "@angular/material/tooltip";

import { MatCardModule } from "@angular/material/card";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { TextBoxModule } from "@progress/kendo-angular-inputs";

import { TMultitableComponent } from './t-multitable.component';
import { MatIconModule } from "@angular/material/icon";

@NgModule({
  declarations: [
    TMultitableComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatTooltipModule,
    MatCardModule,
    DropDownsModule,
    ReactiveFormsModule,
    TextBoxModule,
    NgxIntlTelInputModule,
    MatIconModule
  ],
  exports: [
    TMultitableComponent
  ]
})
export class TMultitableModule { }
