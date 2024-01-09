import {
    Component,
    OnInit,
    Input,
    OnChanges,
    SimpleChanges,
    ViewEncapsulation,
    ViewChild,
    forwardRef,
    ChangeDetectorRef,
    ElementRef,
} from '@angular/core';
import {
    GridComponent,
    DataStateChangeEvent,
    GridDataResult,
    DataBindingDirective,
} from '@progress/kendo-angular-grid';
import { APIService } from '@teamin/services/api.service';
import {
    ResponseSchemaModel,
    ResponseDataModel,
    ResponseSchemaOptionsModel,
} from '@teamin/models/common/response-model';
import {
    process,
    DataSourceRequestState,
    CompositeFilterDescriptor,
} from '@progress/kendo-data-query';
import {
    KendoGridColumnDefination,
    kendoGridOptions,
} from '@teamin/models/common/kendo-grid';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import * as _ from 'lodash';

import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { ValueComponent } from './value/value.component';
import { textboxHiddenIcon } from '@progress/kendo-svg-icons';
import { PopupModalService } from '@teamin/services/popup-modal.service';
import { from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
declare var kendo: any;

@Component({
    selector: 't-grid',
    templateUrl: './t-grid.component.html',
    styleUrls: ['./t-grid.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TGridComponent),
            multi: true,
        },
    ],
})
export class TGridComponent implements OnInit, OnChanges, ControlValueAccessor {
    @ViewChild('ele', { static: true }) ele: GridComponent;
    @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
    public APIUrl: string = environment.baseURL;

    public _gridData: GridDataResult = {
        data: [],
        total: 0,
    };
    public checkcn: string;
    public _gridOptions: kendoGridOptions = null;

    public _gridColumns: KendoGridColumnDefination[] = [];

    public _isDataLoading: boolean = true;
    public _isSchemaLoading: boolean = true;
    public isPreview: boolean = true;
    public isview: boolean = true;
    public isPrintCon: boolean = false;
    public isDownloadCon: boolean = false;

    public con: any;

    @Input() cn: string;
    @Input() pcn: string;
    @Input() gridOptions: kendoGridOptions;

    public options: ResponseSchemaOptionsModel;
    public dataKeyName: string;
    public _gridView: any;
    constructor(
        private _http: HttpClient,
        private _apiService: APIService,
        private router: Router,
        public _dialog: MatDialog,
        private cdref: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {
            if (propName == 'cn') {
                this.con = this._apiService.getController(
                    changes.cn.currentValue
                );
                let cv = changes.gridOptions.currentValue;
                this._gridOptions = _.merge(this._gridOptions, cv);
                this.loadSchema();
            } else if (propName == 'gridOptions') {
                let cv = changes.gridOptions.currentValue;
                if (cv) {
                    this._gridOptions = _.merge(this._gridOptions, cv);
                }
                this.loadData();
            }
        }
    }

    cnChanged() {
        this.loadSchema();
        this.loadData();
    }

    loadSchema() {
        this._isSchemaLoading = true;
        this._apiService
            .getSchema('list', this.con.cn, this._gridOptions.state, this.pcn)
            .subscribe(
                {
                    next: (data: ResponseSchemaModel) => {
                        this.UpdateColumns(data);
                        this.options = data.Options;
                        this.checkcn = this.options.DownloadCon

                        this.dataKeyName = data.Schema.Keys[0];
                    },
                    error: (e) => {
                        this._isSchemaLoading = false;
                    },
                    complete: () => {
                        this._isSchemaLoading = false;
                    }
                }
            );
    }

    loadData() {

        this._isDataLoading = true;
        this._apiService
            .getData('list', this.con.cn, this._gridOptions.state, this.pcn)
            .subscribe(
                {
                    next: (data: ResponseDataModel) => {
                        this._gridData.data = data.Records;
                        this._gridView = this._gridData.data;
                        this._gridData.total = data.Total;
                    },
                    error: (e) => {
                        this._isDataLoading = false;
                    },
                    complete: () => {
                        this._isDataLoading = false;
                    }
                }
            );

    }

    loadCreate() {

        var url = this._apiService
            .getController(this.options.CreateCon)
            .p.URL.toLowerCase();
        this.router.navigateByUrl('/' + url + '/' + this.options.CreateCon);
    }

    loadEdit(id) {

        var statusCon: string = this.con.cn.split('-')[1]

        //Below condition for set Listcon only in approval list
        if (statusCon == 'Status') {
            this._apiService.setLocalStorage("ListCon", this.con.cn)
        }

        var url = this._apiService
            .getController(this.options.EditCon)
            .p.URL.toLowerCase();

        this.router.navigateByUrl(
            '/' + url + '/' + this.options.EditCon + '/' + id
        );
    }

    public b64toBlob(b64Data, contentType) {
        contentType = contentType || '';
        let sliceSize = 512;
        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }

    loadReport(id, localRef) {
        var tempVar = this.options.DownloadCon.split(",")
        // this.checkcn = this.options.DownloadCon.split(",")



        this._http
            .get(environment.baseURL + 'common/download/report', {
                params: {
                    con: tempVar.length > 1 ? (localRef == 'local_printshop' ? tempVar[0] : tempVar[1]) : tempVar[0],
                    pcn: null,
                    Id: id
                },
                responseType: 'blob',
            })
            .subscribe({
                next: (response: Blob) => {

                    var reader = new FileReader();
                    reader.readAsDataURL(response);
                    reader.onload = (e) => {

                        var blob = this.b64toBlob(e.target.result
                            .toString()
                            .split(',')[1], "application/pdf");

                        let a = document.createElement("a");
                        document.body.appendChild(a);
                        var url = window.URL.createObjectURL(blob);

                        window.open(url)
                        // if( localRef._svgName == "document-download"){
                        //     a.href = url;
                        //     a.download = String(tempVar[tempVar.length - 2] + ".pdf");
                        //     a.click();
                        //     a.remove();
                        // }
                        // else{
                        //     window.open(url)
                        // }
                    };
                },
                error: (err) => { },
                complete: () => { },
            });
    }

    permissionExists(cn) {
        this.isPreview = this.CheckPreviewStatus();
        this.isview = this.CheckviewStatus();
        // this.checkcn = this.options.DownloadCon.split(",")
        var c = this._apiService.getController(cn);
        if (c != null) {
            return true;
        } else {
            return false;
        }
    }

    CheckPreviewStatus() {
        var status: Boolean = false;
        this._gridColumns.forEach((element) => {
            if (element.field == 'Preview') {
                element.hidden = true;
                status = true;
            }
        });
        if (status) {
            return true;
        } else {
            return false;
        }
    }

    loadPreview(data) {
        window.open(this.APIUrl + data.Preview);
    }

    UpdateColumns(data: ResponseSchemaModel) {
        let keyId = data.Schema.Keys[0];
        this._gridColumns = this._apiService.constructKendoGridColumns(
            data,
            this.con
        );

        this._gridColumns.forEach((element, i) => {
            if (this._gridColumns[i].hidden == true) {
                this._gridColumns.splice(i, 1)
            }
        });
    }

    dataStateChange(state: DataStateChangeEvent) {
        this._gridOptions.state = state;
        this.loadData();
    }

    getExcelFileName() {
        return this.con.p.DisplayText + '.xlsx';
    }

    getPDFFileName() {
        return this.con.p.DisplayText + '.pdf';
    }

    onChange: any = () => { };
    onTouched: any = () => { };

    @Input('value') _value: number[];
    get value() {
        return this._value;
    }

    set value(val) {
        this._value = val;
        this.onChange(val);
        this.onTouched();
    }

    registerOnChange(fn) {
        this.onChange = fn;
    }

    writeValue(value) {
        if (value) {
            this.value = value;
        } else {
            this.value = [];
        }
    }

    registerOnTouched(fn) {
        this.onTouched = fn;
    }

    permissionViewExists(cn) { }

    CheckviewStatus() {
        var Vstatus: Boolean = false;
        this._gridColumns.forEach((element) => {
            if (element.field == 'View') {
                Vstatus = true;
            }
        });
        if (Vstatus) {
            return true;
        } else {
            return false;
        }
    }

    loadview(dataItem) {
        const json = JSON.parse(dataItem.View);
        const dialogRef = this._dialog.open(ValueComponent, {
            data: json,
            height: '100%',
            width: '50%',
        });
        dialogRef.afterClosed().subscribe(() => { });
    }
    public onFilter(input: Event): void {
        const inputValue = (input.target as HTMLInputElement).value;


        this._gridView = process(this._gridData.data, {

            filter: {
                logic: "or",
                filters: [
                    {
                        field: 'field',
                        operator: 'contains',
                        value: inputValue
                    },
                ]
            }
        }).data;

        this.dataBinding.skip = 0;
    }
}
