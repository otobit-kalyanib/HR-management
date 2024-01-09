import {
    Component,
    Input,
    forwardRef,
    Injector,
    OnChanges,
    AfterViewInit,
    SimpleChanges,
    ChangeDetectorRef,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import {
    DataSourceRequestState,
    CompositeFilterDescriptor,
    groupBy,
} from "@progress/kendo-data-query";
import { ResponseDataModel } from "@teamin/models/common/response-model";
import {
    KeyValuePair,
    DropListener,
} from "@teamin/models/common/key-value-pair";

import { APIService } from "@teamin/services/api.service";
import { delay } from "rxjs/operators";

import { ControlValueAccessorConnector } from "@teamin/helpers/control-value-accessor-connector";
import { hasIn } from "lodash";
import { Router } from "@angular/router";

@Component({
    selector: "t-drop",
    templateUrl: "./t-drop.component.html",
    styleUrls: ["./t-drop.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TDropComponent),
            multi: true,
        },
    ],
})
export class TDropComponent
    extends ControlValueAccessorConnector
    implements AfterViewInit, OnChanges {
    constructor(injector: Injector, private _router: Router, private _apiService: APIService, private cdref: ChangeDetectorRef) {
        super(injector);
    }

    public _value: KeyValuePair;
    public createCon: string = null;
    public _isLoading: boolean = false;
    public _dataItems: any = [];
    public _state: DataSourceRequestState = {
        skip: 0,
        take: 100,
        filter: null,
        sort: null,
        group: null,
    };


    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        // if(this.){

        // }
        if (this.control.value.Text == 'Pending') {
            this.classBgColor = "border-blue-800 bg-blue-100 text-blue-700"
        }
    }

    ngAfterViewInit(): void {
        if (this.listeners.length > 0) {
            this.listeners.forEach((element) => {
                let c = this.controlContainer.control.get(element.control);
                c.valueChanges.subscribe((e) => {
                    this.control.setValue({ Id: null, Text: null });
                    this._dataItems = [];

                    let f = <CompositeFilterDescriptor>{
                        logic: "and",
                        filters: [],
                    };

                    let hasNulls: boolean = false;
                    this.listeners.forEach((felement) => {
                        let dv = this.controlContainer.control.get(
                            felement.control
                        );
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

                    if (!hasNulls) this.loadData(f);
                });

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
            this.loadData();
        }
    }

    ngAfterViewChecked(): void {
        //Called after every check of the component's view. Applies to components only.
        //Add 'implements AfterViewChecked' to the class.

        if (this.control.value.Text == 'Pending') {
            this.classBgColor = "border-blue-800 bg-blue-100 text-blue-700"
        }
        else if (this.control.value.Text == 'Rejected') {
            this.classBgColor = "border-red-800 bg-red-100 text-red-700"
        }
        else if (this.control.value.Text == 'Approved') {
            this.classBgColor = "border-green-800 bg-green-100 text-lime-700"
        }

        this.cdref.detectChanges();
    }

    @Input() dt: string;
    @Input("isDisabled") isDisabled: boolean;
    @Input() cn: string;
    @Input() cr: string;
    @Input() pcn: string;
    @Input() listeners: DropListener[] = [];

    @Input() groupByField: string;

    loadData(filter?: CompositeFilterDescriptor) {
        if (this.listeners.length > 0 && !filter) {
            return;
        }
        if (filter) {
            this._state.filter = filter;
        }
        //this._isLoading = true;
        this._apiService
            .getData("drop", this.cn, this._state, this.pcn)
            .pipe(delay(0))
            .subscribe(
                (r: ResponseDataModel) => {
                    this._dataItems = r ? r.Records : [];
                    if (r.Records.length > 0) {
                        r.Records.unshift({
                            Id: null,
                            Text: null,
                        });
                        if (
                            this.groupByField != null &&
                            this.groupByField != undefined &&
                            this.groupByField != ""
                        )
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

    ngOnChanges(changes: SimpleChanges) {
        if (changes.isDisabled) {
            this.setDisabledState(changes.isDisabled.currentValue);
        }
    }

    onaddbutton() {
        var url = this._apiService
            .getController(this.cr)
            .p.URL.toLowerCase();


        this._router.navigateByUrl(
            "/" + url + "/" + this.cr
        );
    }
    public selectedValue: any;
    public classBgColor: any;

    // public isSelected(dataItem: any): boolean {

    //     return this.selectedValue && this.selectedValue.value === dataItem.value;
    // }

    valueChange($event) {

        if ($event?.Text == 'Pending') {
            this.classBgColor = "border-blue-800 bg-blue-100 text-blue-700"
        }
        else if ($event?.Text == 'Rejected') {
            this.classBgColor = "border-red-800 bg-red-100 text-red-700"
        }
        else if ($event?.Text == 'Approved') {
            this.classBgColor = "border-green-800 bg-green-100 text-lime-700"
        }
        else {
            this.classBgColor = ""
        }
        this.change.emit($event);
    }
}
