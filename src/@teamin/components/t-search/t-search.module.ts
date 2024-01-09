import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { MatTooltipModule } from "@angular/material/tooltip";
import { ComboBoxModule } from "@progress/kendo-angular-dropdowns";

import { TSearchComponent } from "./t-search.component";
import { MatIconModule } from "@angular/material/icon";
import { TCreateComponent } from "@teamin/layouts/t-create/t-create.component";

@NgModule({
    declarations: [TSearchComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatTooltipModule,
        MatIconModule,
        ComboBoxModule,
    ],
    exports: [TSearchComponent],
    providers: [TCreateComponent]
})
export class TSearchModule { }
