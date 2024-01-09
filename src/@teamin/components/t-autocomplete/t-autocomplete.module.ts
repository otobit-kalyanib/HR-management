import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AutoCompleteModule } from '@progress/kendo-angular-dropdowns';

import { TextBoxModule } from '@progress/kendo-angular-inputs'

import { TAutoCompleteComponent } from './t-autocomplete.component';

@NgModule({
    declarations: [TAutoCompleteComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatTooltipModule,
        TextBoxModule,
        AutoCompleteModule
    ],
    exports: [
        TAutoCompleteComponent
    ]
})
export class TAutoCompleteModule { }