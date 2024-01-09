/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, Input, forwardRef, Injector, Output, Optional } from '@angular/core';
import { FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorConnector } from '../../helpers/control-value-accessor-connector';
import { environment } from '../../../environments/environment';
// import { EventEmitter } from 'stream';
import { APIService } from '@teamin/services/api.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
// import { ChallanEntryPreview } from 'app/modules/office/purchase/challan-entries/challan-entrypreview/challan-entrypreview.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 't-create',
    standalone: true,
    templateUrl: './t-create.component.html',
    styleUrls: ['./t-create.component.scss'],
    styles: [],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TCreateComponent),
            multi: true,
        },
    ],
    imports: [CommonModule, MatIconModule, ButtonsModule, MatButtonModule, MatCardModule, MatTooltipModule, MatProgressSpinnerModule, MatSidenavModule,]
})
export class TCreateComponent extends ControlValueAccessorConnector {
    isProduction: boolean;
    isCreate: boolean = false;
    isData: boolean = false;
    key: string = '';
    storename: any;

    constructor(injector: Injector, private _apiService: APIService, private router: Router, public _dialog: MatDialog, @Optional() public _dialogRef?: MatDialogRef<TCreateComponent>) {
        super(injector);
        this.isProduction = environment.production;
    }

    @Input() Checking: boolean = false;
    @Input() isLoading: boolean;
    @Input() con: any;
    @Input() form: FormGroup;
    @Input() noSubmit: boolean;
    @Input() noCode: boolean;
    @Input() noDraft: boolean;
    @Input() close: boolean
    @Input() store: boolean
    @Input() list: boolean
    @Input() Redirected: boolean = false;
    @Input() previousId: number;
    @Input() nextId: number;

    @Input() view: any;
    ngOnInit(): void {

        if (this.close === true) {
            this.noCode = false;
            this.noDraft = false;
        }
        forkJoin(
            this._apiService.getRequestByURL('/common/context/defaults'),

        ).subscribe(
            (s) => {
                // this.storename = s[0];

            }
        );
        // this.storename = this._apiService.getControllers()


        this.key = this.con.cn;
        if (this.con.ct === 'Create') { this.isCreate = true }

        if (this._apiService.getLocalStorage(this.con.cn)) {
            this.isData = true
        }
        else {
            this.isData = false
        }

        if (this.con.ct === 'Edit' || this.con.ct == "Action") {
            this.isCreate = true
        }


    }

    View() {
        // var object: any
        // const dialogRef = this._dialog.open(ChallanEntryPreview, {
        //     data: object = {
        //         form: this.form.getRawValue(),
        //         con: this.con
        //     },
        //     width: '80%',
        //     panelClass: 'max-h-180'

        // });

        // dialogRef.afterClosed().subscribe(() => { });
    }

    draft(controller) {

        const data = this.form.value
        this._apiService.setLocalStorage(controller, data)
        this.isData = true
    }

    removeDraft() {
        this._apiService.removeLocalStorage(this.key)
        this.isData = false
    }

    Reload() {

    }

    onClose() {
        this._dialogRef.close()
    }

    onback() {
        var url = this._apiService
            .getController(this.con.cn)
            .p.URL.toLowerCase();


        if (this.previousId != undefined) {

            this.router.navigateByUrl(
                '/' + url + '/' + this.con.cn + '/' + this.previousId
            );
        }
        // this.router.navigateByUrl(
        //     this.APIURL + this.con.cn + '/600'
        // );

    }

    onforward() {

        var url = this._apiService
            .getController(this.con.cn)
            .p.URL.toLowerCase();

        if (this.nextId != undefined) {
            this.router.navigateByUrl(
                '/' + url + '/' + this.con.cn + '/' + this.nextId
            );
        }
    }
}
