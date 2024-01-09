import { NgModule } from '@angular/core';

import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TAddressComponent } from './t-address.component';
import { MatCardModule } from '@angular/material/card';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    declarations: [TAddressComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatTooltipModule,
        ReactiveFormsModule,
        NgxIntlTelInputModule,
        MatCardModule,
        DropDownsModule,
        InputsModule,
        MatIconModule
    ],
    exports: [TAddressComponent],
})
export class TAddressModule {}
