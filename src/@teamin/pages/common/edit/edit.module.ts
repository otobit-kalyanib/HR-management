import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { SharedModule } from 'app/shared/shared.module';

import { EditComponent } from './edit.component';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { MatButtonModule } from '@angular/material/button';

import { TDropModule } from '@teamin/components/t-drop/t-drop.module';
import { TSearchModule } from '@teamin/components/t-search/t-search.module';
import { TComboModule } from '@teamin/components/t-combo/t-combo.module';
import { TMultiColumnSearchModule } from '@teamin/components/t-multicolumn-search/t-multicolumn-search.module';

const routes: Routes = [
    {
        path: ':cn',
        component: EditComponent,
    },
];

@NgModule({
    declarations: [EditComponent],
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
        MatIconModule,

        // MatProgressButtonsModule,

        MatButtonModule,
        TMultiColumnSearchModule,
        TDropModule,
        TSearchModule,
        TComboModule,
    ],
    exports: [],
    providers: [],
})
export class EditModule { }
