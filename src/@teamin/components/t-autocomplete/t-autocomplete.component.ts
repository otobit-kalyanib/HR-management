import {
    Component,
    Input,
    forwardRef,
    Injector,
    SimpleChanges,
} from '@angular/core';
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
import { from } from 'linq-to-typescript';

@Component({
    selector: 't-autocomplete',
    templateUrl: './t-autocomplete.component.html',
    styleUrls: ['./t-autocomplete.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TAutoCompleteComponent),
            multi: true,
        },
    ],
})
export class TAutoCompleteComponent extends ControlValueAccessorConnector {
    constructor(injector: Injector, public _apiService: APIService) {
        super(injector);
    }

    public _value: KeyValuePair;
    public _isLoading: boolean = false;
    public controlName: string = '';
    public isHover: boolean = false;

    @Input() createCn: string = null;

    @Input() take: number = null;

    public _dataItems: any = [];
    public _state: DataSourceRequestState = {
        skip: 0,
        take: 1000,
        filter: null,
        sort: null,
        group: null,
    };

    ngAfterViewInit(): void {

        // this._state.take = this.take || 1000;
        // this.loadData();
        if (this.listeners.length > 0) {

            this.listeners.forEach((element) => {
                const c = this.controlContainer.control.get(element.control);
                c.valueChanges.subscribe((e) => {
                    this.control.setValue({ Id: null, Text: null });

                    const r = this.getFilters();
                    if (r != null) { this.loadData(r); }

                });

                setTimeout(() => {
                    const r = this.getFilters();
                    if (r != null) { this.loadData(r); }
                }, 1000);
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
    @Input() pcn: string;
    @Input() listeners: DropListener[] = [];
    @Input() groupByField: string;
    @Input() allowCustom: boolean = false;

    ngOnInit(): void {
        this.control.valueChanges.subscribe(() => {
            if (this.control.value) {
                this.control.patchValue(this.control.value.toUpperCase(), {
                    emitEvent: false,
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

    onFilterChange(event: any) {
        event = event.toUpperCase();
    }

    loadData(filter?: CompositeFilterDescriptor, text?: string) {
        if (this.listeners.length > 0 && !filter) {
            return;
        }
        if (text) {
            if (this.listeners.length == 0) {
                this._state.filter = {
                    logic: "and",
                    filters: [
                        {
                            field: "Text",
                            operator: "contains",
                            value: text,
                        },
                    ],
                };
            } else {
                this._state.filter.filters = this._state.filter.filters.filter(
                    (ele: any) => ele.field !== "Text"
                );
                this._state.filter.filters.push({
                    field: "Text",
                    operator: "contains",
                    value: text ?? "",
                });
            }
        } else if (filter) {
            this._state.filter = filter;
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
                    this._dataItems = r
                        ? from(r.Records)
                            .select((x: any) => x.Text)
                            .toArray()
                        : [];
                },
                (e) => { },
                () => {
                    this._isLoading = false;
                }
            );
    }

    public handleFilter(value) {
        if (value.length >= 3) {
            // this._state.filter = {
            //     logic: 'and',
            //     filters: [
            //         {
            //             field: 'Text',
            //             operator: 'contains',
            //             value: value,
            //         },
            //     ],
            // };
            this.loadData(this._state.filter, value);
        } else {
            //this..toggle(false);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.isDisabled) {
            this.setDisabledState(changes.isDisabled.currentValue);
        }
    }

    onChange($event) {
        this.change.emit($event);
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


    over() {
        if (!this.isProduction) {
            this.controlName = 'Form- ' + this.getControlName(this.control) + '\n' + 'Control- ' + this.cn;
            this.isHover = true;
        }
    }

    out() {
        this.isHover = false;
    }
    inputValue: string;

    // onInputChange(value: string) {
    //     const upperCaseValue = value.toUpperCase();
    //     this.inputValue = upperCaseValue;
    //   }
}
