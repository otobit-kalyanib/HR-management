import { Component, Input, forwardRef, Injector, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorConnector } from '@teamin/helpers/control-value-accessor-connector';
import { ContactNumberModel } from '@teamin/models/Contact/contact-number-model';
import { random, replace } from 'lodash';

import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';

@Component({
    selector: 't-phone',
    templateUrl: './t-phone.component.html',
    styleUrls: ['./t-phone.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TPhoneComponent),
            multi: true,
        },
    ],
})
export class TPhoneComponent
    extends ControlValueAccessorConnector
    implements OnInit {
    constructor(injector: Injector) {
        super(injector);
    }

    separateDialCode = false;
    SearchCountryField = SearchCountryField;
    //TooltipLabel = TooltipLabel;
    CountryISO = CountryISO;

    preferredCountries: CountryISO[] = [CountryISO.India];

    @Input() isWhatsapp: boolean;
    @Input() dt: string;
    @Input() isDisabled: boolean = false;

    phoneNumber: any;
    phoneId: string;

    ngOnInit() {
        this.phoneId = 'Phone_' + random(1, 1000).toString();

        const v = this.control.value;
        if (v != null) {
            this.phoneNumber = v.ContactNumber;
        }

        this.control.valueChanges.subscribe((x) => {
            if (x) { this.phoneNumber = x.ContactNumber; }
        });
    }

    public onChange() {
        const v = this.phoneNumber;
        if (v) {
            this.control.setValue({
                ContactNumberType: {
                    Id: 2002,
                    Text: 'Mobile',
                },
                CountryCode: replace(v.dialCode, '+', ''),
                ContactNumber: v.number,
            });
        } else {
            this.control.setValue({
                ContactNumberType: {
                    Id: 2002,
                    Text: 'Mobile',
                },
                CountryCode: '91',
                ContactNumber: null,
            });
        }
    }
}
