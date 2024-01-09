import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DatePickerModule } from "@progress/kendo-angular-dateinputs";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { TDateToDatePickerComponent } from "./t-date-to-date-picker.component";
import {MatIconModule} from '@angular/material/icon';
@NgModule({
    declarations: [TDateToDatePickerComponent],
    imports: [
        DatePickerModule,
        CommonModule,
        ReactiveFormsModule,
        MatTooltipModule,
        FormsModule,
        DropDownsModule,
        MatIconModule
    ],
    exports: [TDateToDatePickerComponent],
})
export class TDateToDatePickerModule {}
