import { SelectableMode, FilterableSettings, SelectableSettings, PagerSettings } from '@progress/kendo-angular-grid';
import { DataSourceRequestState } from '@progress/kendo-data-query';

export interface KendoGridSettings {
    dt: string;
    columns: KendoGridColumnDefination[];
    data: any;
    keyField: string;
    height: number;
    selectableMode: SelectableMode;
}
export interface KendoGridColumnDefination {
    field?: string;
    hidden?: boolean;
    title?: string;
    format?: string;
    type?: string;
    aggregates?: any;
    footerTemplate?: any;
    groupFooterTemplate?: any;
}
export interface kendoGridOptions {
    dt?: string;
    state?: DataSourceRequestState;
    height?: "fullHeight" | boolean;
    filterable?: FilterableSettings;
    pageable?: boolean | PagerSettings;
    sortable?: boolean;
    selectableSettings: SelectableSettings;
    keyField?: string;
    enableExcel?: boolean;
    enablePDF?: boolean;
}