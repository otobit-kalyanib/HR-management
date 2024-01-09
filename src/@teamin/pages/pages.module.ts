import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

const routes: Routes = [
    {
        path: 'common',
        loadChildren: () =>
            import('./common/common.module').then((m) => m.CommonModule),
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes), SharedModule],
})
export class PagesModule {}
