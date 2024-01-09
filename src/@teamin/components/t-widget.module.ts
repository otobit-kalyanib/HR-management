import { NgModule } from '@angular/core';
// import { TWidgetChartModule } from './t-widget-chart/t-widget-chart.module';
// import { TWidgetListModule } from './t-widget-list/t-widget-list.module';
// import { TWidgetSparklineModule } from './t-widget-sparkline/t-widget-sparkline.module';
// import { TWidgetTileModule } from './t-widget-tile/t-widget-tile.module';
import { TFilterModule } from './t-filter/t-filter.module';
@NgModule({
    imports: [
        // TWidgetListModule,
        // TWidgetSparklineModule,
        // TWidgetChartModule,
        // TWidgetTileModule,
        TFilterModule
    ],
    exports: [
        // TWidgetListModule,
        // TWidgetSparklineModule,
        // TWidgetChartModule,
        // TWidgetTileModule,
        TFilterModule
    ],
})
export class TWidgetModule {}
