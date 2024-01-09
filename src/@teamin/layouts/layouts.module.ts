import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { TCreateComponent } from './t-create/t-create.component';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
// import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
import { AddressdataComponent } from './addressdata/addressdata.component';
import { MatCardModule } from '@angular/material/card';
import { TabledataComponent } from './tabledata/tabledata.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
    declarations: [ AddressdataComponent, TabledataComponent],
    imports: [
        CommonModule,
        SharedModule,
        MatIconModule,
        ButtonsModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatSidenavModule,
        // FuseScrollbarModule,
        MatCardModule,
        MatTooltipModule
    ],
    exports: [ AddressdataComponent, TabledataComponent],
})
export class LayoutsModule { }
