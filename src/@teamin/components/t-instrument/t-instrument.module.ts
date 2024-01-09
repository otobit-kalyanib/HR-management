import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TDatepickerModule } from "../t-datepicker/t-datepicker.module";
import { TDropModule } from "../t-drop/t-drop.module";
import { TInputModule } from "../t-input/t-input.module";
import { TInstrumentComponent } from "./t-instrument.component";
import { TSearchModule } from "../t-search/t-search.module";

@NgModule({
    declarations: [TInstrumentComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatTooltipModule,
        ReactiveFormsModule,
        MatCardModule,
        TDropModule,
        TInputModule,
        TSearchModule,
        TDatepickerModule,
    ],
    exports: [TInstrumentComponent],
})
export class TInstrumentModule {}
