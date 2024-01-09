import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";

import {
    GridModule,
    ExcelModule,
    PDFModule,
} from "@progress/kendo-angular-grid";

import { TGridComponent } from "@teamin/components/t-grid/t-grid.component";
import { ValueComponent } from './value/value.component';
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";

@NgModule({
    declarations: [TGridComponent, ValueComponent],
    imports: [
        CommonModule,

        GridModule,
        ExcelModule,
        PDFModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
    ],
    exports: [TGridComponent, MatButtonModule],
})
export class TGridModule { }
