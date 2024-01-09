import {
    Component,
    Injectable,
    forwardRef,
    Input,
    HostBinding,
    Directive,
    OnInit,
    Injector,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { environment } from "environments/environment";
import {
    UploadEvent,
    SelectEvent,
    FileRestrictions,
    RemoveEvent,
    SuccessEvent,
    FileInfo,
    ErrorEvent,
    ChunkSettings,
} from "@progress/kendo-angular-upload";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { APIService } from "@teamin/services/api.service";
import { Router } from "@angular/router";

@Component({
    selector: "t-upload",
    templateUrl: "./t-upload.component.html",
    styleUrls: ["./t-upload.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TUploadComponent),
            multi: true,
        },
    ],
})
export class TUploadComponent implements OnInit, ControlValueAccessor {
    chunkSetting: ChunkSettings;
    uploadSaveUrl: string;
    FGUID: string;
    url: string;
    public APIUrl: string = environment.baseURL;
    uploadRemoveUrl: string;

    public displayText: string;
    public controller: string;
    public parentParentController: string;
    public myFiles: Array<FileInfo> = [];
    public fileRestriction: FileRestrictions = {
        maxFileSize: 5242880,
        allowedExtensions: [
            ".jpg",
            ".jpeg",
            ".pdf",
            ".docx",
            ".doc",
            ".docx",
            ".xls",
            ".xlsx",
            ".ppt",
            ".pptx",
            ".png",
            ".bmp",
            ".csv"
        ],
    };
    commonService: APIService;
    router: Router;
    @Input()
    set dt(x: string) {
        this.displayText = x;
    }

    @Input()
    set fr(x: FileRestrictions) {
        this.fileRestriction = x;
    }

    @Input()
    set cn(x: string) {
        this.controller = x;
    }
    @Input()
    set ppcn(x: string) {
        this.parentParentController = x;
    }

    @Input("value") _value: any;
    @Input("remove") remove: any;
    @Input() isMulti: boolean = false;
    @Input() imgae: boolean = false;
    @Input() isPreview: boolean = true;



    @Input() onRemove: any = () => { };

    onChange: any = () => { };
    onTouched: any = () => { };
    public href: string = "";


    defaultRestrictions: FileRestrictions = {
        maxFileSize: 10485760,
        allowedExtensions: [
            ".jpg",
            ".jpeg",
            ".pdf",
            ".docx",
            ".doc",
            ".docx",
            ".xls",
            ".xlsx",
            ".ppt",
            ".pptx",
            ".png",
            ".bmp",
        ],
    };
    constructor(public _commonService: APIService, _router: Router, injector: Injector) {
        // super(injector);
        this.commonService = _commonService;
        this.router = _router;
        this.href = this.router.url.split('/')[0];
    }

    // removeFromForm(val) {
    //     this.document.Documents.value.map((item: any) => {
    //         if (item.file.FGUID == val.FGUID) {
    //             item.file = null
    //         }
    //     })
    // }


    ngOnInit() {
        this.uploadSaveUrl = this.commonService.getFileUploadURL(
            this.controller,
            this.parentParentController
        );
    }

    loadPreview(data) {

        window.open(data)
        return false
    }

    checkType(index) {
        if (this.url?.slice(-4) !== "null") {

            if (index == 1) {
                if (this.url?.slice(-4) !== ".pdf") {
                    return true
                }
            }
            else {
                if (this.url?.slice(-4) == ".pdf") {
                    return true
                }
            }
        }
    }

    get value() {
        return this._value;
    }

    set value(val) {
        
        if (val.name) {
            val.name = (val.name).replace(val.FGUID + "_", "")
        }
        this._value = val;
        // if(Array.isArray(this._value[0])){
        //     this._value.splice(0,1)
        // }
        

        // for set img url in edit 
        this.url = this.APIUrl + this._value.path

        this.imgae = true

        this.myFiles = [
            {
                name: this.value.name,
                size: this.value.size,
            },
        ];
        this.uploadRemoveUrl = this.commonService.getFileRemoveURL(
            val.FGUID
        );

        if (val.size == 0) {

            // this.removeFromForm(val);

        }
        this.onChange(val);
        this.onTouched();
    }

    registerOnChange(fn) {
        this.onChange = fn;
    }

    writeValue(value) {

        if (value) {
            this.value = value;
        }
    }

    registerOnTouched(fn) {
        this.onTouched = fn;
    }

    successEventHandler(e: SuccessEvent) {

        if (e.response && e.operation == "upload") {
            this.value = e.response.body.Data;
        }

        // this.url = this._commonService.getSafeUrl(this.APIUrl + this.value.path)
        this.url = this.APIUrl + this.value.path
        this.imgae = true
        if (e.operation == "remove") {
            this.value = e.response.body.Data;
        }
    }

    errorEventHandler(e: ErrorEvent) {
        this.url = ""
    }

    uploadEventHandler(e: UploadEvent) {
        e.headers = e.headers.set(
            "Authorization",
            "Bearer " + this.commonService.getAuthorization().access_token
        );

    }
    selectEventHandler(e: SelectEvent) { }
    removeEventHandler(e: UploadEvent) {
        this.myFiles = []
        this.onRemove()
        this.url = ""
        this.imgae = false
        e.headers = e.headers.set(
            "Authorization",
            "Bearer " + this.commonService.getAuthorization().access_token
        );
    }
    myRestrictions: FileRestrictions = this.fileRestriction
        ? this.fileRestriction
        : this.defaultRestrictions;
}
