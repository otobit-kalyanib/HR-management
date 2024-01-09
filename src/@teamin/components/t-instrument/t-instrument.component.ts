import { Component, Input, forwardRef, Injector, OnInit } from "@angular/core";
import { FormControl, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { ControlValueAccessorConnector } from "@teamin/helpers/control-value-accessor-connector";
import { KeyValuePair } from "@teamin/models/common/key-value-pair";

@Component({
    selector: "t-instrument",
    templateUrl: "./t-instrument.component.html",
    styleUrls: ["./t-instrument.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TInstrumentComponent),
            multi: true,
        },
    ],
})
export class TInstrumentComponent
    extends ControlValueAccessorConnector
    implements OnInit {
    constructor(injector: Injector) {
        super(injector);
    }

    @Input() dt: string;
    @Input() type: string;
    @Input() er: any;

    public instrument: InstrumentModel = new InstrumentModel();

    instrumentForm = new FormGroup({
        InstrumentType: new FormControl({
            Id: null,
            Text: null,
        }),
        InstrumentNumber: new FormControl(null),
        InstrumentDated: new FormControl(null),
        Bank: new FormControl({ Id: null, Text: null }),
    });

    ngOnInit() {
        var v = this.control.value;
        if (v != null){
            this.instrument = v;
            this.instrumentForm.setValue(this.instrument)
        } 

        this.instrumentForm.valueChanges.subscribe((x) => {
            var v = this.instrumentForm.getRawValue();
            if (v) {
                this.control.setValue(v);
            }
        });
    }
}

export class InstrumentModel {
    InstrumentType: {Id: any, Text: any};
    InstrumentNumber: string;
    InstrumentDated: Date;
    Bank: {Id: any, Text: any};
}
