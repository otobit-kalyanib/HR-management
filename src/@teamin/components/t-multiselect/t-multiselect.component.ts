/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, Input, forwardRef, Injector } from '@angular/core';
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
import { Router } from '@angular/router';
import { TCreateComponent } from '@teamin/layouts/t-create/t-create.component';

@Component({
    selector: 't-multiselect',
    templateUrl: './t-multiselect.component.html',
    styleUrls: ['./t-multiselect.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TMultiselectComponent),
            multi: true,
        },
    ],
})
export class TMultiselectComponent extends ControlValueAccessorConnector {
    constructor(injector: Injector, public _apiService: APIService, public _router: Router, private _tcreate: TCreateComponent) {
        super(injector);
    }

    public _value: KeyValuePair;
    public _isLoading: boolean = false;

    @Input() createCn: string = null;

    @Input() take: number = null;

    public _dataItems: any = [];
    public _state: DataSourceRequestState = {
        skip: 0,
        take: 50,
        filter: null,
        sort: null,
        group: null,
    };

    ngAfterViewInit(): void {

        if (this.listeners.length > 0) {
            this.listeners.forEach((element) => {
                const c = this.controlContainer.control.get(element.control);

                c.valueChanges.subscribe((e) => {

                    this.control.setValue([]);

                    this._dataItems = [];

                    const r = this.getFilters();
                    if (r != null) {
                        this.loadData(r);
                    }

                    const f = <CompositeFilterDescriptor>{
                        logic: 'and',
                        filters: [],
                    };

                    let hasNulls: boolean = false;
                    this.listeners.forEach((felement) => {
                        const dv = this.controlContainer.control.get(
                            felement.control
                        );
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

                    if (!hasNulls) { this.loadData(f); }
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
            this._state.take = this.take || 50;
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
                    : felement.control === 'Departments' ? dv.value.map(v => v[felement.field]).toString() : dv.value[felement.field];

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

    @Input() dt: string;
    @Input() isDisabled: boolean;
    @Input() cn: string;
    @Input() cr: string;
    @Input() pcn: string;
    @Input() listeners: DropListener[] = [];
    @Input() groupByField: string;
    @Input() allowCustom: boolean = false;

    loadData(filter?: CompositeFilterDescriptor) {

        if (this.listeners.length > 0 && !filter) {
            return;
        }
        if (filter) {
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
        if (value.length >= 3) {
            this._state.filter = {
                logic: 'and',
                filters: [
                    {
                        field: 'Text',
                        operator: 'contains',
                        value: value,
                    },
                ],
            };
            this.loadData();
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

    onaddbutton() {
        if (this.pcn) {
            this._tcreate.draft(this.pcn)
        }
        var url = this._apiService.getController(this.cr).p.URL.toLowerCase();

        this._router.navigateByUrl('/' + url + '/' + this.cr);
    }
}
