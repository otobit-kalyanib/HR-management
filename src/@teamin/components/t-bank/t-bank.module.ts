import { NgModule } from "@angular/core";

import { NgxIntlTelInputModule } from "ngx-intl-tel-input";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTooltipModule } from "@angular/material/tooltip";

import { TBankComponent } from "./t-bank.component";
import { MatCardModule } from "@angular/material/card";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { TextBoxModule } from "@progress/kendo-angular-inputs";

@NgModule({
    declarations: [TBankComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatTooltipModule,
        ReactiveFormsModule,
        NgxIntlTelInputModule,
        MatCardModule,
        DropDownsModule,
        TextBoxModule,
    ],
    exports: [TBankComponent],
})
export class TBankModule { }
