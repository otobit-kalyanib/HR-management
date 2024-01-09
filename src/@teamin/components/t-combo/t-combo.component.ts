import {
    Component,
    Input,
    forwardRef,
    Injector,
    ViewChild,
    SimpleChanges,
} from "@angular/core";
import { AbstractControl, NG_VALUE_ACCESSOR } from "@angular/forms";
import {
    DataSourceRequestState,
    CompositeFilterDescriptor,
    groupBy,
} from "@progress/kendo-data-query";
import { ResponseDataModel } from "@teamin/models/common/response-model";
import {
    DropListener,
    KeyValuePair,
} from "@teamin/models/common/key-value-pair";

import { APIService } from "@teamin/services/api.service";
import { delay, map, switchMap, tap } from "rxjs/operators";

import { ControlValueAccessorConnector } from "@teamin/helpers/control-value-accessor-connector";
import { ComboBoxComponent } from "@progress/kendo-angular-dropdowns";
import { from } from "rxjs";

@Component({
    selector: "t-combo",
    templateUrl: "./t-combo.component.html",
    styleUrls: ["./t-combo.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TComboComponent),
            multi: true,
        },
    ],
})
export class TComboComponent extends ControlValueAccessorConnector {
    constructor(injector: Injector, public _apiService: APIService) {
        super(injector);
    }

    @ViewChild("combobox") combo: ComboBoxComponent;

    public _dataItems: any = [];
    public controlName: string = ""
    public isHover: boolean = false;
    public _source: any = [];
    // public Total: number = 0;
    public _value: KeyValuePair;

    ngAfterViewInit(): void {
        setTimeout(() => {
            if (this.listeners.length > 0) {
                this.listeners.forEach((element) => {
                    let c = this.controlContainer.control.get(element.control);
                    c.valueChanges.subscribe((e) => {
                        this.control.setValue({ Id: null, Text: null });
                        let r = this.getFilters();
                        if (r != null) this.loadData(r);
                    });
                    setTimeout(() => {
                        let r = this.getFilters();
                        if (r != null) this.loadData(r);
                    }, 1000);
                });
            } else {
                this._state.take = this.take || 2500;
                this.loadData();
            }

            this.control.valueChanges.subscribe((e) => {
                if (e == undefined) {
                    this.control.setValue({
                        Id: null,
                        Text: null,
                    });
                }
            });

            const contains = (value) => (s) =>
                s.Text.toLowerCase().indexOf(value.toLowerCase()) !== -1;

            this.combo.filterChange
                .asObservable()
                .pipe(
                    switchMap((value) =>
                        from([this._source]).pipe(
                            tap(() => (this.combo.loading = true)),
                            map((data) => data.filter(contains(value)))
                        )
                    )
                )
                .subscribe((x) => {
                    if (
                        this.groupByField != null &&
                        this.groupByField != undefined &&
                        this.groupByField != ""
                    )
                        x = groupBy(x, [{ field: this.groupByField }]);
                    this._dataItems = x;
                    this.combo.loading = false;
                });
        });
    }

    @Input() dt: string;
    @Input() isDisabled: boolean;
    @Input() cn: string;
    @Input() pcn: string;
    @Input() listeners: DropListener[] = [];
    @Input() createCn: string = null;
    public _isLoading: boolean = false;
    @Input() take: number = null;
    @Input() groupByField: string;
    @Input() allowCustom: boolean = false;

    public _state: DataSourceRequestState = {
        skip: 0,
        take: 2500,
        filter: null,
        sort: null,
        group: null,
    };

    valueChange($event) {
        this.change.emit($event);
    }
    getFilters() {
        this._dataItems = [];

        let f = <CompositeFilterDescriptor>{
            logic: "and",
            filters: [],
        };

        let hasNulls: boolean = false;
        this.listeners.forEach((felement) => {
            let dv = this.controlContainer.control.get(felement.control);
            let data =
                felement.field == "" || felement.field == null
                    ? dv.value
                    : dv.value[felement.field];
            if (data == null) {
                hasNulls = true;
            }
            f.filters.push({
                field: felement.filter,
                operator: "eq",
                value: data,
            });
        });
        return !hasNulls ? f : null;
    }

    loadData(filter?: CompositeFilterDescriptor) {
        if (this.listeners.length > 0 && !filter) {
            return;
        }
        if (filter) {
            this._state.filter = filter;
        }

        this._isLoading = true;
        this._apiService
            .getData("drop", this.cn, this._state, this.pcn)
            .pipe(tap(() => (this.combo.loading = true)))
            .subscribe(
                {
                    next: (r: ResponseDataModel) => {
                        this._source = r ? r.Records : [];

                        if (r.Records.length > 0) {
                            r.Records.unshift({
                                Id: null,
                                Text: "",
                            });
                        }

                        if (
                            this.groupByField != null &&
                            this.groupByField != undefined &&
                            this.groupByField != ""
                        )
                            this._dataItems = groupBy(this._source, [
                                { field: this.groupByField },
                            ]);
                        else this._dataItems = this._source;

                        this._isLoading = false;
                    },
                    error: (e) => {
                        this._isLoading = false;
                    },
                    complete: () => {
                        this._isLoading = false;
                    }
                }
            );
    }

    over() {
        if (!this.isProduction) {
            this.controlName = "Form- " + this.getControlName(this.control) + "\n" + "Control- " + this.cn
            this.isHover = true
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.isDisabled) {
            this.setDisabledState(changes.isDisabled.currentValue);
        }
    }


}
