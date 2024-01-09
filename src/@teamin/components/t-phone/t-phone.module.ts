import { NgModule } from "@angular/core";

import { NgxIntlTelInputModule } from "ngx-intl-tel-input";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTooltipModule } from "@angular/material/tooltip";

import { TPhoneComponent } from "./t-phone.component";

@NgModule({
    declarations: [TPhoneComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatTooltipModule,
        ReactiveFormsModule,
        NgxIntlTelInputModule,
    ],
    exports: [TPhoneComponent],
})
export class TPhoneModule {}
