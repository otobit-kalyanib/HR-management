import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TMultiselectComponent } from './t-multiselect.component';

import { MultiSelectModule } from '@progress/kendo-angular-dropdowns';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TCreateComponent } from '@teamin/layouts/t-create/t-create.component';

@NgModule({
    declarations: [TMultiselectComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatTooltipModule,
        MultiSelectModule,
        MatIconModule,
        MatButtonModule
    ],
    exports: [TMultiselectComponent],
    providers:[TCreateComponent]
})
export class TMultiselectModule { }
