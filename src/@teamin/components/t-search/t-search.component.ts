import {
    Component,
    Input,
    forwardRef,
    Injector,
    AfterViewInit,
    ChangeDetectorRef,
    OnChanges,
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
import { Router } from '@angular/router';
import { TCreateComponent } from '@teamin/layouts/t-create/t-create.component';

@Component({
    selector: 't-search',
    templateUrl: './t-search.component.html',
    styleUrls: ['./t-search.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TSearchComponent),
            multi: true,
        },
    ],
})
export class TSearchComponent
    extends ControlValueAccessorConnector
    implements OnChanges, AfterViewInit {
    constructor(injector: Injector, private _router: Router, public _apiService: APIService, private cdref: ChangeDetectorRef, private tcreateComp: TCreateComponent) {
        super(injector);
    }

    public _value: KeyValuePair;
    public _isLoading: boolean;

    @Input() createCn: string = null;

    @Input() take: number = null;
    @Input() selectedId: [];



    public _dataItems: any = [];
    public _state: DataSourceRequestState = {
        skip: 0,
        take: 1000,
        filter: null,
        sort: null,
        group: null,
    };
    ngAfterContentChecked() {
        this.cdref.detectChanges();
    }

    ngOnChanges(changes: SimpleChanges): void {


    }

    ngAfterViewInit(): void {
        // this.cdref.detectChanges();
        if (this.listeners.length > 0) {
            this.listeners.forEach((element) => {
                //     let c = this.controlContainer.control.get(element.control);
                //     c.valueChanges.subscribe((e) => {
                //         this.control.setValue({ Id: null, Text: null });
                //         this._dataItems = [];

                //         let f = <CompositeFilterDescriptor>{
                //             logic: 'and',
                //             filters: [],
                //         };

                //         let hasNulls: boolean = false;
                //         this.listeners.forEach((felement) => {
                //             let dv = this.controlContainer.control.get(
                //                 felement.control
                //             );
                //             let data =
                //                 felement.field == '' || felement.field == null
                //                     ? dv.value
                //                     : dv.value[felement.field];
                //             if (data == null) {
                //                 hasNulls = true;
                //             }
                //             f.filters.push({
                //                 field: felement.filter,
                //                 operator: 'eq',
                //                 value: data,
                //             });
                //         });

                //         if (!hasNulls) this.loadData(f);
                //     });
                // });
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
            this._state.take = this.take || 1000;
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
    }

    @Input() dt: string;
    @Input() isDisabled: boolean;
    @Input() cn: string;
    @Input() cr: string;
    @Input() pcn: string;
    @Input() listeners: DropListener[] = [];
    @Input() groupByField: string;
    @Input() allowCustom: boolean = false;

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
        // if (filter) {
        //     this._state.filter = filter;
        // }
        this._isLoading = true;
        this._apiService
            .getData('search', this.cn, this._state, this.pcn)
            .pipe(delay(0))
            .subscribe({
                next: (r: ResponseDataModel) => {

                    if (this.selectedId) {
                        if (this.selectedId.length != 0) {
                            this.selectedId.forEach((selectedindex) => {
                                const index = r.Records.findIndex(item => item.Id === selectedindex);
                                if (index !== -1) {
                                    r.Records.splice(index, 1);
                                }
                            })
                        }
                    }

                    this._dataItems = r ? r.Records : [];
                    if (r.Records.length > 0) {
                        r.Records.unshift({
                            Id: null,
                            Text: null,
                        });
                    }
                    if (
                        this.groupByField != null &&
                        this.groupByField != undefined &&
                        this.groupByField != ''
                    )
                        this._dataItems = groupBy(this._dataItems, [
                            { field: this.groupByField },
                        ]);
                },
                error: (e) => { },
                complete: () => {
                    this._isLoading = false;
                },
            });
    }

    onaddbutton() {

        if (this.pcn) {
            this.tcreateComp.draft(this.pcn)
        }

        var url = this._apiService.getController(this.cr).p.URL.toLowerCase();

        this._router.navigateByUrl('/' + url + '/' + this.cr);
    }

    getFilters() {
        this._dataItems = [];

        let f = <CompositeFilterDescriptor>{
            logic: 'and',
            filters: [],
        };

        let hasNulls: boolean = false;
        this.listeners.forEach((felement) => {
            let dv = this.controlContainer.control.get(felement.control);
            const data =
                felement.field === '' || felement.field == null
                    ? dv.value
                    : felement.control === 'Department' ? dv.value.map(v => v[felement.field]).toString() : dv.value[felement.field];
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

    public handleFilter(value) {
        if (value.length >= 2) {
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
            // this._state.filter = null
            // this.loadData();
            //this.toggle(false);
        }
    }

    valueChange($event) {
        this.change.emit($event);
    }

    public valueNormalizer = (text: Observable<string>) =>
        text.pipe(
            map((content: string) => {
                if (this.allowCustom)
                    return {
                        Id: 0,
                        Text: content,
                    };
            })
        );

    public onFocus(combo) {
        if (!combo.isOpen) {
            combo.toggle(true);
        }
    }

    public oninput($event) {
    }

    // async loadComponent(vcr: ViewContainerRef) {
    //     var t = './guest-card/guest-card.component';
    //     const { GuestCardComponent } = await import(t);

    //     return vcr.createComponent(
    //         this.cfr.resolveComponentFactory(GuestCardComponent)
    //     );
    // }
}
