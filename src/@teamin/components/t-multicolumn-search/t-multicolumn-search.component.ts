/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, Input, forwardRef, Injector, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import {
    DataSourceRequestState,
    CompositeFilterDescriptor,
    groupBy,
} from '@progress/kendo-data-query';
import { ResponseDataModel } from '@teamin/models/common/response-model';
import {
    DropListener,
    KeyValuePair,
} from '@teamin/models/common/key-value-pair';

import { APIService } from '@teamin/services/api.service';
import { delay, map } from 'rxjs/operators';

import { ControlValueAccessorConnector } from '@teamin/helpers/control-value-accessor-connector';
import { Observable } from 'rxjs';
import { MultiColumnSearchColumn } from '@teamin/models/common/MultiColumnSearchColumn';
import { from } from 'linq-to-typescript';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TCreateComponent } from '@teamin/layouts/t-create/t-create.component';

@Component({
    selector: 't-multicolumn-search',
    templateUrl: './t-multicolumn-search.component.html',
    styleUrls: ['./t-multicolumn-search.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TMultiColumnSearchComponent),
            multi: true,
        },
    ],
})
export class TMultiColumnSearchComponent
    extends ControlValueAccessorConnector
    implements OnInit {
    constructor(
        injector: Injector,
        public _dialog: MatDialog,
        private _router: Router,
        public _apiService: APIService,
        public tcreateComp: TCreateComponent
    ) {
        super(injector);
    }

    public _value: KeyValuePair;
    public _isLoading: boolean = false;
    public istooltip: boolean = false;
    public isvisible: boolean = false;

    @Input() createCn: string = null;
    @Input() tooltip: string = null;

    @Input() take: number = null;

    public _dataItems: any = [];
    public _state: DataSourceRequestState = {
        skip: 0,
        take: 1000,
        filter: null,
        sort: null,
        group: null,
    };

    ngOnInit(): void {
        if (this.isdetalis != null) {
            this.isvisible = true
        }

        if (this.tooltip) {
            this.istooltip = true
        }

        this.columns = this.getColumns();

    }

    ngAfterViewInit(): void {
        // if (!this.columns) {
        //     //this.columns.push
        //     this.columns = this.getColumns();
        // }

        if (this.listeners.length > 0) {
            this.listeners.forEach((element) => {
                const c = this.controlContainer.control.get(element.control);
                c.valueChanges.subscribe((e) => {
                    this.control.setValue({ Id: null, Text: null });

                    const r = this.getFilters();
                    if (r != null) {
                        this.loadData(r);
                    }
                });

                setTimeout(() => {
                    const r = this.getFilters();
                    if (r != null) {
                        this.loadData(r);
                    }
                }, 1000);

                // this._dataItems = [];

                // let f = <CompositeFilterDescriptor>{
                //     logic: "and",
                //     filters: [],
                // };

                // let dv = this.controlContainer.control.get(element.listenTo);

                // this.listeners.forEach((felement) => {
                //     f.filters.push({
                //         field: felement.listenToField,
                //         operator: "eq",
                //         value: dv.value
                //             ? dv.value.Id
                //                 ? dv.value.Id
                //                 : dv.value
                //             : null,
                //     });
                // });

                // this.loadData(f);
            });
        } else {
            this._state.take = this.take || 1000;
            this.loadData();
        }

        this.control.valueChanges.subscribe((e) => {
            if (e === undefined) {
                this.control.setValue({
                    Id: null,
                    Text: null,
                });
            }
        });
    }

    @Input() dt: string;
    @Input() isDisabled: boolean;
    @Input() cn: string;
    @Input() cr: string;
    @Input() cop: string;
    @Input() pcn: string;
    @Input() listeners: DropListener[] = [];
    @Input() groupByField: string;
    @Input() allowCustom: boolean = false;
    @Input() isdetalis: string;
    @Input() columns: MultiColumnSearchColumn[] = [
        {
            datatype: 'Int32',
            field: 'Id',
            title: 'Id',
            width: 200,
        },
        {
            datatype: 'Int32',
            field: 'Text',
            title: 'Text',
            width: 200,
        },
    ];


    getFilters() {
        this._dataItems = [];
        const f = <CompositeFilterDescriptor>{
            logic: 'and',
            filters: [],
        };

        let hasNulls: boolean = false;
        this.listeners.forEach((felement) => {
            const dv = this.controlContainer.control.get(felement.control);
            const data =
                felement.field === '' || felement.field == null
                    ? dv.value
                    : dv.value[felement.field];
            if (data == null) {
                hasNulls = true;
            }
            f.filters.push({
                field: felement.filter,
                operator: 'eq',
                value: data,
            });
        });

        return !hasNulls ? f : null;
    }

    onaddbutton() {
        if (this.pcn) {
            this.tcreateComp.draft(this.pcn)
        }
        var url = this._apiService.getController(this.cr).p.URL.toLowerCase();

        this._router.navigateByUrl('/' + url + '/' + this.cr);
    }

    loadData(filter?: CompositeFilterDescriptor, text?: string) {
        if (this.listeners.length > 0 && !filter) {
            return;
        }
        if (text) {
            if (this.listeners.length === 0) {
                this._state.filter = {
                    logic: 'or',
                    filters: [
                        {
                            field: 'Text',
                            operator: 'contains',
                            value: text || this.control.value.Text,
                        },
                    ],
                };
                if (!text)
                    this._state.filter.filters.push({
                        field: 'Text',
                        operator: 'contains',
                        value: String(this.control.value.Text).substring(0, 1),
                    });
            } else {
                this._state.filter.filters = this._state.filter.filters.filter(
                    (ele: any) => ele.field !== 'Text'
                );
                this._state.filter.filters.push({
                    field: 'Text',
                    operator: 'contains',
                    value: text ?? '',
                });
            }
        } else if (filter) {
            this._state.filter = filter;
        }

        //this._isLoading = true;
        this._apiService
            .getData('search', this.cn, this._state, this.pcn)
            .pipe(delay(0))
            .subscribe(
                (r: ResponseDataModel) => {
                    this._dataItems = r ? r.Records : [];
                    if (
                        this.groupByField != null &&
                        this.groupByField !== undefined &&
                        this.groupByField !== ''
                    ) {
                        this._dataItems = groupBy(this._dataItems, [
                            { field: this.groupByField },
                        ]);
                    }
                },
                (e) => { },
                () => {
                    this._isLoading = false;
                }
            );
    }

    public handleFilter(value) {
        if (value.length >= 2) {
            //console.log(value);
            // this._state.filter = {
            //     logic: "and",
            //     filters: [
            //         {
            //             field: "Text",
            //             operator: "contains",
            //             value: value,
            //         },
            //     ],
            // };
            this.loadData(this._state.filter, value);
        } else if (value.length == 0) {
            this._state.filter = null
            this.loadData(this._state.filter);
            //this..toggle(false);
        }
    }

    public valueNormalizer = (text: Observable<string>) =>
        text.pipe(
            map((content: string) => {
                if (this.allowCustom) {
                    return {
                        Id: 0,
                        Text: content,
                    };
                }
            })
        );

    public getColumns(): MultiColumnSearchColumn[] {
        const c = this._apiService.getController(this.cn).p.Settings;
        return from(c['columns'])
            .select((x: any) => ({
                title: x.title,
                field: x.field,
                datatype: x.datatype,
                width: x.width,
            }))
            .toArray();
    }

    onServiceChanged($event) {
        this.change.emit($event);
    }
}
