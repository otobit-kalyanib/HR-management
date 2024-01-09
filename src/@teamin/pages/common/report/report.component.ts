import {
    Component,
    OnInit,
    AfterViewInit,
    OnDestroy,
    Inject,
    Optional,
} from "@angular/core";
import { APIService } from "@teamin/services/api.service";
import { ActivatedRoute } from "@angular/router";

import { Subscription } from "rxjs";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: "page-report",
    templateUrl: "./report.component.html",
})
export class ReportComponent implements OnInit, OnDestroy {
    constructor(
        private _apiService: APIService,
        public _route: ActivatedRoute,
        @Optional() public _dialogRef?: MatDialogRef<any>,
        @Optional() @Inject(MAT_DIALOG_DATA) public _dialogData?: any
    ) {
        if (_dialogData) {
            this.isModal = true;
            this.cn = _dialogData.cn;
            this.parameters = _dialogData.parameters;
            this.initLoad();
        } else {
            this.cnSubscription = this._route.paramMap.subscribe((params) => {
                this.cn = params.get("cn");
                this.initLoad();
            });
        }
    }

    initLoad() {
        this._con = this._apiService.getController(this.cn);
        if (this._con.p) {
            this._FontAwesome = this._con.p.FontAwesome
                ? "&#x" + this._con.p.FontAwesome + "; "
                : "";
        }
    }

    cnSubscription: Subscription;
    _con: any;
    _FontAwesome: any = "";
    _reportSource: any;
    isModal: boolean = false;

    public cn: string;
    public parameters: any = {};

    ngOnInit(): void {}

    ngOnDestroy(): void {
        if (this.cnSubscription) this.cnSubscription.unsubscribe();
    }
}
