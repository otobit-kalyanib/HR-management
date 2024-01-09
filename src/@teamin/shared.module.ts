import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { KendoGridColumnDateFormatDirective } from '@teamin/directives/kendo-grid-column-date-format.directive';
import { TSharedModule } from './components/t-shared.module';

@NgModule({
    declarations: [KendoGridColumnDateFormatDirective],
    imports: [
        MatCardModule,
        MatTabsModule,
        MatIconModule,
        TSharedModule
        // TGridModule,
        // LayoutsModule,
        // TWidgetModule
    ],
    exports: [
        MatCardModule,
        // MatProgressButtonsModule,
        // TGridModule,
        // LayoutsModule,
        TSharedModule,
        MatTabsModule,
        MatIconModule,
    ],
})
export class TeamInSharedModule { }
