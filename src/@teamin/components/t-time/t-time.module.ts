import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTooltipModule } from "@angular/material/tooltip";
import {
  DateInputsModule
} from "@progress/kendo-angular-dateinputs";
import { TTimeComponent } from './t-time.component';



@NgModule({
  declarations: [
    TTimeComponent
  ],
  imports: [
    DateInputsModule,
    CommonModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports:[
    TTimeComponent
  ]
})
export class TTimeModule { }
