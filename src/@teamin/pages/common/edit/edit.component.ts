import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '@teamin/services/api.service';
import { TPageMaster } from '@teamin/helpers/t-page-master';

import { NgForm, FormControl } from '@angular/forms';
import {
    Location,
    LocationStrategy,
    PathLocationStrategy,
} from '@angular/common';
import { Subscription } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss'],
    providers: [
        Location,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
    ],
})
export class EditComponent extends TPageMaster implements OnInit, OnDestroy {
    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public _CommonService: APIService,
        public _confirmationDialogService: FuseConfirmationService,
        public _location: Location,
        public _router: Router,
        private cdref: ChangeDetectorRef
    ) {
        super(
            route,
            _CommonService,
            _confirmationDialogService,
            _location,
            _router
        );
        //this.ct = _CommonService.getController(this.con.p.EditController).ct
    }
    ngAfterContentChecked() {
        this.cdref.detectChanges();
    }
    onSubmit() {
        if (this._form.invalid) {
            this._dialogService.open({
                title: 'Required',
                message: 'Selection is required',
            });
            return;
        }
        if (this.con.ct == 'Edit' && this.id == null) {
            this.router.navigateByUrl(
                '/' +
                String(this.con.p.URL).toLowerCase() +
                '/' +
                this.con.cn +
                '/' +
                this._form.getRawValue().EditControl.Id
            );
        }
    }
    ngOnDestroy(): void { }
}
