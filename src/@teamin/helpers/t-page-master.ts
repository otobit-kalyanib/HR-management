/* eslint-disable @typescript-eslint/semi */
/* eslint-disable curly */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @angular-eslint/no-output-on-prefix */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @angular-eslint/directive-class-suffix */
import { Location } from '@angular/common';
import { from } from 'linq-to-typescript';
import { ActivatedRoute, Router } from '@angular/router';
import {
    OnInit,
    OnDestroy,
    Directive,
    Input,
    Output,
    EventEmitter,
    Optional,
    Inject,
    HostListener,
} from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    FormControl,
    ValidationErrors,
} from '@angular/forms';
import { APIService } from '../services/api.service';

import { ResponseResult } from '../models/common/response-model';
import { MatProgressButtonOptions } from 'mat-progress-buttons';

import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';

import { TValidators } from './t-validators';
import { hasIn } from 'lodash';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Directive({ selector: '[tpageMaster]' })
export class TPageMaster implements OnInit, OnDestroy {
    _isLoading: boolean = false;

    dLoading: boolean;
    isProduction: boolean;
    _validations: any;
    _form: FormGroup;
    _Rform: FormGroup;
    _formBuilder: FormBuilder = new FormBuilder();
    _isFormReady: boolean = false;
    _model: any;
    _responseResult: ResponseResult;
    _unsubscribeAll: Subject<any>;
    _data: any;
    _sendFormRawValue: boolean = true;
    con: any;
    cn: string;
    id: any;

    isModal: boolean = false;

    p: {
        DisplayText: any;
        FontAwesome: any;
    };
    mDownloadURL: string;
    checkCn: any;

    constructor(
        @Optional() public route: ActivatedRoute,
        @Optional() public _APIService: APIService,
        @Optional() public _dialogService: FuseConfirmationService,
        @Optional() public _location: Location,
        @Optional() public _router: Router,
        @Optional() public _dialogRef?: MatDialogRef<any>,
        @Optional() @Inject(MAT_DIALOG_DATA) public _dialogData?: any

    ) {
        if (_dialogData) {
            this.isModal = true;
            this.cn = _dialogData.cn;
            this.id = _dialogData.id;
            this.initLoad();
        } else {
            this.route.paramMap.subscribe((params) => {
                this._isFormReady = false;
                this._form = this._formBuilder.group({});
                this.cn = params.get('cn');
                this.id = params.get('id');
                this.initLoad();
            });
        }
    }

    ngOnDestroy(): void {
        if (this._unsubscribeAll) {
            this._unsubscribeAll.next(true);
            this._unsubscribeAll.complete();
        }
    }

    getList() {
        setTimeout(() => {
            this.getListReady();
        }, 500);
    }

    getListReady() { }

    initLoad() {
        this.isProduction = environment.production;

        if (this.cn) {
            this.con = this._APIService.getController(this.cn);
            this.p = this.con.p;
            this.p.FontAwesome = this.con.p.FontAwesome
                ? '&#x' + this.con.p.FontAwesome + '; '
                : '';
            if (this.con.ct === 'Create') { this.getPostModel(); }
            else if (this.con.ct === 'Action') {
                this.getPutModel();
            } else if (this.con.ct === 'Edit' && this.id === null) {
                this.prepareEditModel();
            } else if (this.con.ct === 'Edit') {
                this.getPutModel();
            } else if (this.con.ct === 'View') {
                this.getView();
            } else if (this.con.ct == 'List') {
                this.getList();
            }
        }
    }

    ngOnInit(): void { }

    //Get View Model
    getView() {
        this._isFormReady = false;
        this._APIService.getViewData(this.cn, this.id).subscribe((x) => {
            this._model = x;
            this._isFormReady = true;
        });
    }

    //PostModel
    getPostModel() {
        this._form = this._formBuilder.group({});
        this._Rform = this._formBuilder.group({});
        this._APIService.getPostData(this.cn).subscribe((x) => {
            this._model = x.Post;
            this._Rform = this.prepareFormGroup(x.Post, x.Validations);
            this._data = x.Data;
            this._validations = x.Validations;
            var localData = this._APIService.getLocalStorage(this.con.cn)

            if (localData) {
                var temp1 = JSON.parse(JSON.stringify(localData));
                var temp2 = JSON.parse(JSON.stringify(x.Post));

                for (const [key, value] of Object.entries(temp1)) {
                    temp1[key] = null;
                }
                for (const [key, value] of Object.entries(temp2)) {
                    temp2[key] = null;
                }

                // if (JSON.stringify(temp1) === JSON.stringify(temp2)) {

                this._form = this.prepareFormGroup(localData, this._validations);
                // } else {

                //     // if (!this.isProduction) {
                //     //     this._APIService.removeLocalStorage(this.con.cn);
                //     // }
                //     var data = JSON.parse(JSON.stringify(this._model));
                //     this._form = this.prepareFormGroup(data, this._validations);
                // }
            }
            else {
                var data = JSON.parse(JSON.stringify(this._model));
                this._form = this.prepareFormGroup(data, this._validations);
            }
            // this._Rform = this._form;
            this.onGetPostReady();
            this._isFormReady = true;
        },
            (error) => {
                if (error.status == 404) {
                    this._router.navigateByUrl('404-not-found')
                }
            },
        );
    }

    getPutModel() {
        this._form = this._formBuilder.group({});
        this._APIService
            .getPutData(
                this.id,
                this.cn,
                this.isModal ? null : this.route.snapshot.params
            )
            .subscribe((x) => {
                this._model = x.Put;
                this._data = x.Data;
                this._Rform = this.prepareFormGroup(x.Put, x.Validations);
                this._validations = x.Validations;
                var localData = this._APIService.getLocalStorage(this.con.cn)

                if (localData) {
                    var temp1 = JSON.parse(JSON.stringify(localData));
                    var temp2 = JSON.parse(JSON.stringify(x.Put));

                    for (const [key, value] of Object.entries(temp1)) {
                        temp1[key] = null;
                    }
                    for (const [key, value] of Object.entries(temp2)) {
                        temp2[key] = null;
                    }

                    // if (temp1 == temp2) {


                    this._form = this.prepareFormGroup(localData, this._validations);

                    // }
                    // else {

                    //     var data = JSON.parse(JSON.stringify(this._model));
                    //     this._form = this.prepareFormGroup(data, this._validations);
                    // }
                }
                else {
                    this._APIService.removeLocalStorage(this.con.cn);
                    var data = JSON.parse(JSON.stringify(this._model));
                    this._form = this.prepareFormGroup(data, this._validations);
                }
                this.onGetPutReady();
                this._isFormReady = true;
            },
                (error) => {
                    if (error.status == 404) {
                        this._router.navigateByUrl('404-not-found')
                    }
                });
    }

    prepareFormGroup(data: any, validations: any): any {

        if (Array.isArray(data)) {

            var fbs = [];
            data.forEach((element, i) => {
                fbs.push(this.getFormGroup(element, validations));
            });
            return this._formBuilder.array(fbs);
        } else {
            return this.getFormGroup(data, validations);
        }

    }

    getFormGroup(data: any, validations: any): FormGroup {

        var fb = new FormGroup({});
        Object.keys(data).forEach((x) => {
            var validators = [];

            if (validations && validations != null && validations[x]) {

                if (validations[x]?.Validations) {
                    if (validations[x]?.Validations.GetChildValidators !== undefined)
                        if (validations[x]?.Validations.GetChildValidators) {
                            if (Array.isArray(data[x]))
                                if (!data[x].length)
                                    data[x].push(validations[x].Model);

                            var g = this.prepareFormGroup(data[x], validations[x]?.Validations);
                            fb.setControl(x, g);
                        }
                }

                if (hasIn(data[x], "Id") && hasIn(data[x], "Text")) {
                    if (validations[x].Required !== undefined) {
                        validators.push(
                            TValidators.dropRequiredValidator(
                                validations[x].Required.Message
                            )
                        );
                    }
                } else if (
                    hasIn(data[x], "ContactNumberType") &&
                    hasIn(data[x], "CountryCode") &&
                    hasIn(data[x], "ContactNumber")
                ) {
                    if (validations[x].Required !== undefined) {
                        validators.push(
                            TValidators.mobileRequiredValidator(
                                validations[x].Required.Message
                            )
                        );
                    }
                } else if (
                    hasIn(data[x], "FromDate") &&
                    hasIn(data[x], "ToDate")
                ) {
                    if (validations[x].Required !== undefined) {
                        validators.push(
                            TValidators.dateRangeRequiredValidator(
                                validations[x].Required.Message
                            )
                        );
                    }
                    validators.push(
                        TValidators.dateRangeValidator(
                            "From date should be before to date!"
                        )
                    );
                } else if (validations[x].Required !== undefined) {
                    validators.push(
                        TValidators.requiredValidator(
                            validations[x].Required.Message
                        )
                    );
                }
                if (validations[x].Length !== undefined) {
                    validators.push(
                        TValidators.lengthValidator(
                            validations[x].Length.Min,
                            validations[x].Length.Max,
                            validations[x].Length.Message
                        )
                    );
                }
                if (validations[x].EMail !== undefined) {
                    validators.push(
                        TValidators.EmailValidator(validations[x].EMail.Message)
                    );
                }
                if (validations[x].Regex !== undefined) {
                    validators.push(
                        TValidators.RegexValidator(
                            validations[x].Regex.Pattern,
                            validations[x].Regex.Message
                        )
                    );
                }
                if (validations[x].Range !== undefined) {
                    validators.push(
                        TValidators.rangeValidator(
                            validations[x].Range.Min,
                            validations[x].Range.Max,
                            validations[x].Range.Message
                        )
                    );
                }
            }
            fb.addControl(x, new FormControl(data[x], validators));
        });

        return fb;
    }

    prepareEditModel() {
        this._isFormReady = false;
        setTimeout(() => {
            this._model = {
                EditControl: {
                    Id: 0,
                    Text: null,
                },
            };
            var validators = [];
            validators.push(TValidators.dropRequiredValidator);
            this._form.addControl(
                'EditControl',
                new FormControl(this._model.EditControl, validators)
            );
            this._isFormReady = true;
        }, 500);
    }

    onSubmit() {
        this.onBeforeSubmit();
        // if (!this.isProduction) {
        // }
        if (this._form.invalid) {
            this.getFormValidationErrors();
            this._dialogService.open({
                title: 'Error !',
                message: 'You need to fill all required fields',
                icon: {
                    show: true,
                    name: 'heroicons_outline:exclamation',
                    color: 'warn',
                },
                actions: {
                    ok: {
                        show: true,
                        label: 'Ok',
                    },
                },
                dismissible: true,
            });
            return;
        } else {

            if (this.con.ct === 'Create') {
                this.doPost();
            } else if (this.con.ct === 'Edit') {
                this.checkCn = this.con.cn.split('-')
                this.checkCn = this.checkCn[1]
                this.doPut();
            } else if (this.con.ct === 'Action') {
                this.doPutAction();
            }
        }
    }

    doPost() {
        const dialogRef = this._dialogService.open({
            title: 'Please confirm',
            message: 'Do you really want to Submit?',
            actions: {
                confirm: {
                    show: true,
                    label: 'Confirm',
                    color: 'warn',
                },
                cancel: {
                    show: true,
                    label: 'Cancel',
                }
            },
            dismissible: true,
        });

        dialogRef.afterClosed().subscribe((result) => {

            if (result === 'confirmed') {
                // localStorage.setItem('dataSource', JSON.stringify(this._form.value))
                this._isLoading = true;
                this._APIService
                    .postData(this.cn, this._form.getRawValue())
                    .subscribe({
                        next: (x) => {
                            this._responseResult = x;
                            const dialogRef1 = this._dialogService.open({
                                title: this._responseResult.Result,
                                message: this._responseResult.Message,
                                icon: {
                                    show: true,
                                    name: 'heroicons_outline:check',
                                    color: 'primary',
                                },
                                actions: {
                                    back: {
                                        show: true,
                                        label: 'Ok & Back',
                                    },
                                    ok: {
                                        show: true,
                                        label: 'Ok',
                                    }
                                    ,
                                    cancel: {
                                        show: true,
                                        label: 'Ok & Clear'
                                    }
                                },
                            });
                            dialogRef1.afterClosed().subscribe((result) => {
                                if (result === 'clear') {
                                    this._form = this._Rform
                                    window.location.reload();
                                }
                                else if (result === 'back') {
                                    this._location.back();
                                }

                            })
                            this.onGetPostReady();
                            this.afterSubmitSuccess('post');
                            this._isFormReady = true;
                            this._isLoading = false;

                            // this._Rform = this._form;
                        },
                        error: (e) => {
                            if (e.status !== 401) {
                                this._responseResult = e.error;
                                if (this._responseResult.Result === 'info') {
                                    this._dialogService.open({
                                        title: this._responseResult.Result,
                                        message: this._responseResult.Data[0],
                                        icon: {
                                            show: true,
                                            name: 'heroicons_outline:information-circle',
                                            color: 'info',
                                        },
                                        actions: {
                                            ok: {
                                                show: true,
                                                label: 'Ok',
                                            },
                                        },
                                        dismissible: true,
                                    });
                                } else {
                                    this._dialogService.open({
                                        title: this._responseResult.Result,
                                        message: this._responseResult.Message,
                                        icon: {
                                            show: true,
                                            name: 'heroicons_outline:x-circle',
                                            color: 'error',
                                        },
                                        actions: {
                                            ok: {
                                                show: true,
                                                label: 'Ok',
                                            },
                                        },
                                        dismissible: true,
                                    });
                                }
                            }
                            this._isLoading = false;
                        },
                        complete: () => {
                            this._isLoading = false;
                        },
                    });
            }
        });
    }

    doPut() {
        const dialogRef = this._dialogService.open({
            title: 'Please confirm',
            message: 'Do you really want to Submit?',
            actions: {
                confirm: {
                    show: true,
                    label: 'Submit',
                    color: 'warn',
                },
                cancel: {
                    show: true,
                    label: 'Cancel',
                },
                // stay: {
                //     show: true,
                //     label: 'Reload Data',
                // },
            },
            dismissible: true,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (this.checkCn == 'Status') {
                if (result === 'confirmed') {
                    this._isLoading = true;
                    this._APIService
                        .putData(
                            this.cn,
                            this.id,
                            this._sendFormRawValue
                                ? this._form.getRawValue()
                                : this._model,
                            this.isModal ? null : this.route.snapshot.params
                        )
                        .subscribe({
                            next: (x) => {
                                this._responseResult = x;
                                var pre = this._APIService.getLocalStorage('previousId')
                                var next = this._APIService.getLocalStorage('nextId')

                                var disabledNext: boolean = false
                                var disabledPre: boolean = false

                                if (pre == "undefined" && next == "undefined") {
                                    disabledPre = true
                                    disabledNext = true
                                }
                                else if (pre == "undefined") {
                                    disabledPre = true
                                }
                                else if (next == "undefined") {
                                    disabledNext = true
                                }
                                const dialogRef = this._dialogService.open({
                                    title: this._responseResult.Result,
                                    message: this._responseResult.Message,
                                    icon: {
                                        show: true,
                                        name: 'heroicons_outline:check',
                                        color: 'primary',
                                    },
                                    actions: {
                                        ok: {
                                            show: true,
                                            label: 'OK & Back',
                                            color: 'primary',
                                        },
                                        next: {
                                            show: true,
                                            label: 'Next',
                                            color: 'primary',
                                            disable: disabledNext,
                                        },
                                        back: {
                                            show: true,
                                            label: 'Previous',
                                            color: 'primary',
                                            disable: disabledPre,
                                        },

                                    },
                                    dismissible: true,
                                });
                                this.afterSubmitSuccess('put');

                                dialogRef.afterClosed().subscribe((r) => {

                                    var controller = this.con.cn;

                                    var URL = this._APIService.getController(controller).p.URL;
                                    if (r === 'back') {

                                        if (!this.isModal) {
                                            if (this._APIService.getLocalStorage('previousId') != "undefined") {

                                                this._APIService.removeLocalStorage('previousId')
                                                // this._location.go('/Office-Status-AllPendingApproval-RequisitionApprovals-Edit/' + pre);
                                                this._router.navigateByUrl(
                                                    String(URL).toLowerCase() + '/' + controller + '/' + pre
                                                );
                                                // this._location.back()
                                            }
                                        }
                                    }
                                    else if (r == 'ok') {
                                        var Listcon: string = this._APIService.getLocalStorage("ListCon")

                                        this._APIService.removeLocalStorage("ListCon")

                                        var URL = this._APIService.getController(Listcon).p.URL;
                                        this._router.navigateByUrl(
                                            '/pages/common/list/' + Listcon
                                        );

                                        if (this._APIService.getLocalStorage('nextId')) {
                                            this._APIService.removeLocalStorage('nextId')
                                            this._APIService.removeLocalStorage('previousId')
                                        }
                                        else if (this._APIService.getLocalStorage('previousId')) {
                                            this._APIService.removeLocalStorage('nextId')
                                            this._APIService.removeLocalStorage('previousId')
                                        }

                                        // this._location.back()

                                        // this._location.go('/pages/common/list/Office-Status-AllPendingApproval-RequisitionApprovals-List')
                                    }
                                    else if (r == 'next') {

                                        if (this._APIService.getLocalStorage('nextId') != "undefined") {

                                            this._APIService.removeLocalStorage('nextId')
                                            // this._location.go('/Office-Status-AllPendingApproval-RequisitionApprovals-Edit/' + pre);
                                            this._router.navigateByUrl(
                                                String(URL).toLowerCase() + '/' + controller + '/' + next
                                            );
                                            // this._location.back()
                                        }

                                        // if (!this.isModal) { this._location.forward(); }
                                    }
                                });
                                this._isLoading = false;
                            },
                            error: (e) => {
                                if (e.status !== 401) {
                                    this._responseResult = e.error;
                                    if (this._responseResult.Result === 'info') {
                                        this._dialogService.open({
                                            title: this._responseResult.Result,
                                            message: this._responseResult.Data[0],
                                            icon: {
                                                show: true,
                                                name: 'heroicons_outline:information-circle',
                                                color: 'info',
                                            },
                                            actions: {
                                                ok: {
                                                    show: true,
                                                    label: 'Ok',
                                                },
                                            },
                                            dismissible: true,
                                        });
                                    } else {
                                        this._dialogService.open({
                                            title: this._responseResult.Result,
                                            message: this._responseResult.Message,
                                            icon: {
                                                show: true,
                                                name: 'heroicons_outline:x-circle',
                                                color: 'error',
                                            },
                                            actions: {
                                                ok: {
                                                    show: true,
                                                    label: 'Ok',
                                                },
                                            },
                                            dismissible: true,
                                        });
                                    }
                                }
                                this._isLoading = false;
                            },
                            complete: () => {
                                this._isLoading = false;
                            },
                        });
                }
            }
            else {
                if (result === 'confirmed') {
                    this._isLoading = true;
                    this._APIService
                        .putData(
                            this.cn,
                            this.id,
                            this._sendFormRawValue
                                ? this._form.getRawValue()
                                : this._model,
                            this.isModal ? null : this.route.snapshot.params
                        )
                        .subscribe({
                            next: (x) => {
                                this._responseResult = x;

                                const dialogRef = this._dialogService.open({
                                    title: this._responseResult.Result,
                                    message: this._responseResult.Message,
                                    icon: {
                                        show: true,
                                        name: 'heroicons_outline:check',
                                        color: 'primary',
                                    },
                                    actions: {
                                        ok: {
                                            show: true,
                                            label: 'OK & Back',
                                            color: 'primary',
                                        }

                                    },
                                    dismissible: true,
                                });
                                this.afterSubmitSuccess('put');

                                dialogRef.afterClosed().subscribe((r) => {
                                    if (r === 'ok') {
                                        if (this.con.cn == 'Office-Subscriber-Users-User-Edit') {
                                            this._location.go('/')
                                            window.location.reload();
                                        }
                                        else {
                                            this._location.back()
                                        }
                                    }
                                });
                                this._isLoading = false;
                            },
                            error: (e) => {
                                if (e.status !== 401) {
                                    this._responseResult = e.error;
                                    if (this._responseResult.Result === 'info') {
                                        this._dialogService.open({
                                            title: this._responseResult.Result,
                                            message: this._responseResult.Data[0],
                                            icon: {
                                                show: true,
                                                name: 'heroicons_outline:information-circle',
                                                color: 'info',
                                            },
                                            actions: {
                                                ok: {
                                                    show: true,
                                                    label: 'Ok',
                                                },
                                            },
                                            dismissible: true,
                                        });
                                    } else {
                                        this._dialogService.open({
                                            title: this._responseResult.Result,
                                            message: this._responseResult.Message,
                                            icon: {
                                                show: true,
                                                name: 'heroicons_outline:x-circle',
                                                color: 'error',
                                            },
                                            actions: {
                                                ok: {
                                                    show: true,
                                                    label: 'Ok',
                                                },
                                            },
                                            dismissible: true,
                                        });
                                    }
                                }
                                this._isLoading = false;
                            },
                            complete: () => {
                                this._isLoading = false;
                            },
                        });
                }
            }

        });
    }

    doPutAction() {
        const dialogRef = this._dialogService.open({
            title: 'Please confirm',
            message: 'Do you really want to Submit?',
            actions: {
                confirm: {
                    show: true,
                    label: 'Submit',
                    color: 'warn',
                },
                cancel: {
                    show: true,
                    label: 'Cancel',
                },
            },
            dismissible: true,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this._isLoading = true;
                this._APIService
                    .putData(
                        this.cn,
                        this.id,
                        this._sendFormRawValue
                            ? this._form.getRawValue()
                            : this._model,
                        this.isModal ? null : this.route.snapshot.params
                    )
                    .subscribe({
                        next: (x) => {
                            this._responseResult = x;
                            const dialogRef = this._dialogService.open({
                                title: this._responseResult.Result,
                                message: this._responseResult.Message,
                                icon: {
                                    show: true,
                                    name: 'heroicons_outline:check',
                                    color: 'primary',
                                },
                                actions: {
                                    ok: {
                                        show: true,
                                        label: 'Ok',
                                        color: 'primary',
                                    },
                                    cancel: {
                                        show: true,
                                        label: 'Ok & Clear'
                                    }
                                    // stay: {
                                    //     show: true,
                                    //     label: 'Continue editing',
                                    // },
                                },
                            });
                            this.afterSubmitSuccess('put');

                            dialogRef.afterClosed().subscribe((r) => {
                                if (r === 'ok') {
                                    // if (!this.isModal) { this._location.back(); }
                                    if (this.cn == 'Common-Settings-ChangePassword-Action') {
                                        window.location.reload()
                                    }
                                }

                                if (r === 'clear') {
                                    this._form = this._Rform
                                    window.location.reload();
                                }
                            });
                            this._isLoading = false;
                        },
                        error: (e) => {
                            if (e.status === 404) {
                                this._dialogService.open({
                                    title: 'ERROR-404',
                                    message:
                                        'Requested operation couldn\'t be processed.',
                                    icon: {
                                        show: true,
                                        name: 'heroicons_outline:x-circle',
                                        color: 'error',
                                    },
                                    actions: {
                                        ok: {
                                            show: true,
                                            label: 'Ok',
                                        },
                                    },
                                    dismissible: true,
                                });
                            } else if (e.status !== 401) {
                                this._responseResult = e.error;
                                if (this._responseResult.Result === 'info') {
                                    this._dialogService.open({
                                        title: this._responseResult.Result,
                                        message: this._responseResult.Data[0],
                                        icon: {
                                            show: true,
                                            name: 'heroicons_outline:information-circle',
                                            color: 'info',
                                        },
                                        actions: {
                                            ok: {
                                                show: true,
                                                label: 'Ok',
                                            },
                                        },
                                        dismissible: true,
                                    });
                                } else {
                                    this._dialogService.open({
                                        title: this._responseResult.Result,
                                        message: this._responseResult.Message,
                                        icon: {
                                            show: true,
                                            name: 'heroicons_outline:x-circle',
                                            color: 'error',
                                        },
                                        actions: {
                                            ok: {
                                                show: true,
                                                label: 'Ok',
                                            },
                                        },
                                        dismissible: true,
                                    });
                                }
                            }
                            this._isLoading = false;
                        },
                        complete: () => {
                            this._isLoading = false;
                        },
                    });
            }
        });
    }

    //Form controls
    get f() {
        return this._form.controls;
    }

    getModel(): string {
        return JSON.stringify(this._model);
    }

    onGetPostReady() { }
    onGetPutReady() { }
    afterSubmitSuccess(type: string) { }

    @Output() onModalClosed = new EventEmitter();

    locationBack() { }

    downloadViewFile(downloadURL: string) {
        this.mDownloadURL = downloadURL;
        this.dLoading = true;
        this._APIService.viewFile(downloadURL).subscribe((response) => {
            var contentDisposition = response.headers.get(
                'content-disposition'
            );
            var contentType = response.headers.get('content-type');
            let file = new Blob([response.body], { type: contentType });
            var fileURL = window.URL.createObjectURL(file);
            window.open(fileURL, '_blank');
            this.dLoading = false;
        });
    }

    closeModal() {
        this._dialogRef.close();
    }

    onBeforeSubmit() {
    }

    getFormValidationErrors() {
        let totalErrors = 0;

        Object.keys(this._form.controls).forEach((key) => {
            const controlErrors: ValidationErrors = this._form.get(key).errors;
            if (controlErrors != null) {
                totalErrors++;
                // Object.keys(controlErrors).forEach((keyError) => {
                //     console.log(
                //         'Key control: ' +
                //         key +
                //         ', keyError: ' +
                //         keyError +
                //         ', err value: ',
                //         controlErrors[keyError]
                //     );
                // });
            }
        });
    }

    @HostListener('window:keydown.control.shift.s', ['$event'])
    onSubmitkey(event: KeyboardEvent) {
        event.preventDefault();
        this.onSubmit()
    }
}

