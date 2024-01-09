import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { SharedModule } from 'app/shared/shared.module';

import { TGridModule } from '@teamin/components/t-grid/t-grid.module';

import { DashboardComponent } from './dashboard.component';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { GridsterModule } from 'angular-gridster2';
import { TWidgetModule } from '@teamin/components/t-widget.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

const routes: Routes = [
    {
        path: ':cn',
        component: DashboardComponent,
    },
];

@NgModule({
    declarations: [DashboardComponent],
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
        MatIconModule,
        MatButtonModule,
        MatSidenavModule,
        MatProgressBarModule,
        // MatProgressButtonsModule,
        MatTooltipModule,
        TGridModule,
        GridsterModule,

        TWidgetModule,

        // FuseNavigationModule,
    ],
    exports: [MatButtonModule],
    providers: [],
})
export class DashboardModule {}
