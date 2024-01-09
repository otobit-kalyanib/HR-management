import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TCheckBoxComponent } from "./t-checkbox.component";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTooltipModule } from "@angular/material/tooltip";

@NgModule({
    declarations: [TCheckBoxComponent],
    imports: [
        CommonModule,
        MatCheckboxModule,
        FormsModule,
        ReactiveFormsModule,
        MatTooltipModule,
    ],
    exports: [MatCheckboxModule, TCheckBoxComponent],
})
export class TCheckBoxModule {}
