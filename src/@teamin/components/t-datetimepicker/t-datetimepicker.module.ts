import { LOCALE_ID, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatTooltipModule } from "@angular/material/tooltip";
import {
    DateInputsModule,
    DatePickerModule,
} from "@progress/kendo-angular-dateinputs";
import { TDatetimepickerComponent } from "./t-datetimepicker.component";

@NgModule({
    declarations: [TDatetimepickerComponent],
    imports: [
        DateInputsModule,
        CommonModule,
        MatTooltipModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [TDatetimepickerComponent],
})
export class TDatetimepickerModule {}
