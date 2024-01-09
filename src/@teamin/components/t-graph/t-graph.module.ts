import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TGraphComponent, TGraphDialogComponent } from './t-graph.component';
import { FuseCardModule } from '@fuse/components/card/card.module';
import { FormsModule } from '@angular/forms';
import { FuseSharedModule } from '@fuse/shared.module';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { TGridModule } from '../t-grid/t-grid.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    declarations: [TGraphComponent, TGraphDialogComponent],

    imports: [
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatTabsModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        DialogModule,
        CommonModule,
        FuseCardModule,
        FormsModule,
        FuseSharedModule,
        ChartsModule,
        MatDialogModule,
        TGridModule,
    ],

    exports: [TGraphComponent, TGraphDialogComponent],
})
export class TGraphModule {}
