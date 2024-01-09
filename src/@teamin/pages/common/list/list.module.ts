import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { SharedModule } from 'app/shared/shared.module';

import { TGridModule } from '@teamin/components/t-grid/t-grid.module';

import { ListComponent } from './list.component';
import { MatProgressButtonsModule } from 'mat-progress-buttons';

const routes: Routes = [
    {
        path: ':cn',
        component: ListComponent,
    },
];

@NgModule({
    declarations: [ListComponent],
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
        MatIconModule,
        MatButtonModule,

        // MatProgressButtonsModule,

        TGridModule,
    ],
    exports: [MatButtonModule],
    providers: [],
})
export class ListModule {}
