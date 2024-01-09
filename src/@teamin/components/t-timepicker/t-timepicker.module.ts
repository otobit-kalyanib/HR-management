import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTooltipModule } from "@angular/material/tooltip";
import {
  DateInputsModule
} from "@progress/kendo-angular-dateinputs";
import { TTimepickerComponent } from "./t-timepicker.component";

@NgModule({
  declarations: [TTimepickerComponent],
  imports: [
    DateInputsModule,
    CommonModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [TTimepickerComponent],
})
export class TTimepickerModule { }
