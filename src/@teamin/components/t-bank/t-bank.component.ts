import { Component, Input, forwardRef, Injector, OnInit } from "@angular/core";
import {
    FormBuilder,
    FormControl,
    FormGroup,
    NG_VALUE_ACCESSOR,
    Validators,
} from "@angular/forms";
import { ControlValueAccessorConnector } from "@teamin/helpers/control-value-accessor-connector";
import {
    ContactBankModel,
    IFSCModel,
} from "@teamin/models/Contact/contact-bank-model";

import * as $ from "jquery";

@Component({
    selector: 't-bank',
    templateUrl: './t-bank.component.html',
    styleUrls: ['./t-bank.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TBankComponent),
            multi: true,
        },
    ],
})
export class TBankComponent
    extends ControlValueAccessorConnector
    implements OnInit {
    _isIFSCodeValid: boolean = false;

    constructor(injector: Injector, _formBuilder: FormBuilder) {
        super(injector);
    }

    @Input() dt: string;
    @Input() type: string;
    @Input() er: any;
    @Input() newItemEvent;
    @Input() toUpper: boolean = false;

    public contactBank: ContactBankModel = new ContactBankModel();

    ngOnInit() {
        var v = this.control.value;
        if (v != null) this.contactBank = v;
        this.onChange();
    }

    public onChange() {
        if (
            this.contactBank.IFSCode &&
            this.contactBank.IFSCode.length > 0 &&
            this.contactBank.IFSCode.match(/^[A-Z]{4}0[A-Z0-9]{6}$/)
        ) {
            var $this = this;
            $.getJSON("https://ifsc.razorpay.com/" + $this.contactBank.IFSCode)
                .done(function (r) {
                    $this.contactBank.IFSCDetail = r;
                    $this.updateControl();
                    $this._isIFSCodeValid = true;
                })
                .fail(function (r) {
                    $this.contactBank.IFSCDetail = new IFSCModel();
                    this._isIFSCodeValid = false;
                    $this.updateControl();
                });
        } else {
            this.contactBank.IFSCDetail = new IFSCModel();
            this._isIFSCodeValid = false;
            this.updateControl();
        }
    }

    updateControl() {
        var v = this.contactBank;
        if (v) {
            this.control.setValue(v);
        }
        // if (!this._isIFSCodeValid) {
        //     this.control.setErrors({
        //         bankRequiredValidator: "Invalid IFS Code!",
        //     });
        // }
    }
}
