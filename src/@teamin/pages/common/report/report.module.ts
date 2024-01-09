import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'app/shared/shared.module';

import { ReportComponent } from './report.component';

import { TReportModule } from '@teamin/components/t-report/t-report.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [
    {
        path: ':cn',
        component: ReportComponent,
    },
];

@NgModule({
    declarations: [ReportComponent],
    imports: [
        RouterModule.forChild(routes),

        CommonModule,

        SharedModule,

        TReportModule,

        MatDialogModule,
    ],
})
export class ReportModule {}
