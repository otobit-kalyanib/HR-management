import { LOCALE_ID, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DatePickerModule } from "@progress/kendo-angular-dateinputs";
import { TDatepickerComponent } from "./t-datepicker.component";

@NgModule({
    declarations: [TDatepickerComponent],
    imports: [
        DatePickerModule,
        CommonModule,
        MatTooltipModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [TDatepickerComponent],
})
export class TDatepickerModule {}
