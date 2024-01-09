import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

const routes: Routes = [
    {
        path: 'list',
        loadChildren: () =>
            import('./list/list.module').then((m) => m.ListModule),
    },
    {
        path: 'edit',
        loadChildren: () =>
            import('./edit/edit.module').then((m) => m.EditModule),
    },
    // {
    //     path: 'report',
    //     loadChildren: () =>
    //         import('./report/report.module').then((m) => m.ReportModule),
    // },
    {
        path: 'dashboard',
        loadChildren: () =>
            import('./dashboard/dashboard.module').then(
                (m) => m.DashboardModule
            ),
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes), SharedModule],
    exports: [],
})
export class CommonModule {}
