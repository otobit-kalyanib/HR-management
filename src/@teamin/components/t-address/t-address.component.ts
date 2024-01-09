import { Component, Input, forwardRef, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
    CompositeFilterDescriptor,
    DataSourceRequestState,
} from '@progress/kendo-data-query';
import { ControlValueAccessorConnector } from '@teamin/helpers/control-value-accessor-connector';
import { KeyValuePair } from '@teamin/models/common/key-value-pair';
import { ResponseDataModel } from '@teamin/models/common/response-model';
import { ContactAddressModel } from '@teamin/models/Contact/contact-address-model';
import { APIService } from '@teamin/services/api.service';

import * as $ from 'jquery';
import { from } from 'linq-to-typescript';
import { delay } from 'rxjs/operators';

@Component({
    selector: 't-address',
    templateUrl: './t-address.component.html',
    styleUrls: ['./t-address.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TAddressComponent),
            multi: true,
        },
    ],
})
export class TAddressComponent
    extends ControlValueAccessorConnector
    implements OnInit
{
    constructor(injector: Injector, public _apiService: APIService) {
        super(injector);
    }

    @Input() dt: string;
    @Input() type: string;
    @Input() er: any;
    @Input() copybtn: boolean;
    @Input() IsDummy: boolean;
    @Input() copyController: string;

    public contactAddress: ContactAddressModel = new ContactAddressModel();

    ngOnInit() {
        var v = this.control.value;
        if (v != null) this.contactAddress = v;
        this.control.valueChanges.subscribe((e) => {
            this.contactAddress = e;
        });
        if (this.IsDummy) {
            this.contactAddress.Area = 'Vesu';
            this.contactAddress.Landmark = 'SD Jain';
            this.contactAddress.City = 'Surat';
            this.contactAddress.District = 'Magdallla';
            this.contactAddress.Pincode = '395010';
            this.contactAddress.State = { Id: 249, Text: 'Gujarat' };
            this.contactAddress.Street =
                '412 Shubh Universal Near S.D Jain School';
        }
    }

    public onChange() {
        var v = this.contactAddress;
        if (v) {
            this.control.setValue(v);
        }
    }

    Copy() {
        if (this.copyController) {
            this.control.setValue(
                this.controlContainer.control.get(this.copyController).value
            );
            var value = this.controlContainer.control.get(
                this.copyController
            ).value;
            this.contactAddress.Area = value.Area;
            this.contactAddress.Landmark = value.Landmark;
            this.contactAddress.City = value.City;
            this.contactAddress.District = value.District;
            this.contactAddress.Pincode = value.Pincode;
            this.contactAddress.State = value.State;
            this.contactAddress.Street = value.Street;
        } else {
            console.log('copyController should not be null');
        }
    }

    public onPincodeChange() {
        if (
            this.contactAddress.Pincode &&
            this.contactAddress.Pincode.length == 6 &&
            this.contactAddress.Pincode.match(/^[0-9]{6}$/)
        ) {
            var $this = this;
            $.getJSON(
                'https://api.postalpincode.in/pincode/' +
                    $this.contactAddress.Pincode
            )
                .done(function (r) {
                    r = r[0];
                    if (r.Status == 'Success') {
                        $this.contactAddress.District =
                            r.PostOffice[0].District;
                        $this.contactAddress.State = from($this.states)
                            .where(
                                (x: KeyValuePair) =>
                                    x.Text == r.PostOffice[0].State
                            )
                            .select((x: KeyValuePair) => {
                                return x;
                            })
                            .firstOrDefault();
                    } else {
                        $this.contactAddress.District = '';
                        $this.contactAddress.State = { Id: null, Text: null };
                    }
                })
                .fail(function (r) {
                    $this.contactAddress.District = '';
                    $this.contactAddress.State = { Id: null, Text: null };
                    // $this.contactBank.IFSCDetail = new IFSCModel();
                    // this._isIFSCodeValid = false;
                    // $this.updateControl();
                });
        } else {
            this.contactAddress.District = '';
            this.contactAddress.State = { Id: null, Text: null };
            // this.contactBank.IFSCDetail = new IFSCModel();
            // this._isIFSCodeValid = false;
            // this.updateControl();
        }
    }

    public _state: DataSourceRequestState = {
        skip: 0,
        take: 50,
        filter: null,
        sort: null,
        group: null,
    };

    public _cityData: any = [];
    public _isLoading: boolean = false;

    loadCityData($event) {
        this._state.filter = {
            logic: 'and',
            filters: [
                {
                    field: 'Text',
                    operator: 'contains',
                    value: $event,
                },
            ],
        };
        //this._isLoading = true;
        this._apiService
            .getData('search', 'Open-Common-City-Search', this._state, null)
            .pipe(delay(0))
            .subscribe(
                (r: ResponseDataModel) => {
                    this._cityData = r
                        ? from(r.Records)
                              .select((x: any) => {
                                  return x.Text;
                              })
                              .toArray()
                        : [];
                },
                (e) => {},
                () => {
                    this._isLoading = false;
                }
            );
    }

    public states: any = [
        { Id: 238, Text: 'Andaman & Nicobar Islands' },
        { Id: 239, Text: 'Andhra Pradesh' },
        { Id: 240, Text: 'Arunachal Pradesh' },
        { Id: 241, Text: 'Assam' },
        { Id: 242, Text: 'Bihar' },
        { Id: 243, Text: 'Chandigarh' },
        { Id: 244, Text: 'Chattisgarh' },
        { Id: 245, Text: 'Dadra & Nagar Haveli' },
        { Id: 246, Text: 'Daman & Diu' },
        { Id: 247, Text: 'Delhi' },
        { Id: 248, Text: 'Goa' },
        { Id: 249, Text: 'Gujarat' },
        { Id: 250, Text: 'Haryana' },
        { Id: 251, Text: 'Himachal Pradesh' },
        { Id: 252, Text: 'Jammu & Kashmir' },
        { Id: 253, Text: 'Jharkhand' },
        { Id: 254, Text: 'Karnataka' },
        { Id: 255, Text: 'Kerala' },
        { Id: 256, Text: 'Lakshadweep' },
        { Id: 257, Text: 'Madhya Pradesh' },
        { Id: 258, Text: 'Maharashtra' },
        { Id: 259, Text: 'Manipur' },
        { Id: 260, Text: 'Meghalaya' },
        { Id: 261, Text: 'Mizoram' },
        { Id: 262, Text: 'Nagaland' },
        { Id: 263, Text: 'Odisha' },
        { Id: 264, Text: 'Pondicherry' },
        { Id: 265, Text: 'Punjab' },
        { Id: 266, Text: 'Rajasthan' },
        { Id: 267, Text: 'Sikkim' },
        { Id: 268, Text: 'Tamil Nadu' },
        { Id: 269, Text: 'Telangana' },
        { Id: 270, Text: 'Tripura' },
        { Id: 271, Text: 'Uttar Pradesh' },
        { Id: 272, Text: 'Uttarakhand' },
        { Id: 273, Text: 'West Bengal' },
    ];
}
