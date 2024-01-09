import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DateInputsModule, DatePickerModule } from "@progress/kendo-angular-dateinputs";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { TDateToDateTimePickerComponent } from "./t-date-to-datetime-picker.component";
import {MatIconModule} from '@angular/material/icon';
@NgModule({
    declarations: [TDateToDateTimePickerComponent],
    imports: [
        DatePickerModule,
        CommonModule,
        DateInputsModule,
        ReactiveFormsModule,
        MatTooltipModule,
        FormsModule,
        DropDownsModule,
        MatIconModule
    ],
    exports: [TDateToDateTimePickerComponent],
})
export class TDateToDateTimePickerModule {}
