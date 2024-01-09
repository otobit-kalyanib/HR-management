import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TelerikReportingModule } from '@progress/telerik-angular-report-viewer';

import { TReportComponent } from './t-report.component';

@NgModule({
    declarations: [TReportComponent],
    imports: [CommonModule, TelerikReportingModule],
    exports: [TReportComponent],
})
export class TReportModule {}
