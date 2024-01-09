import { Component, Input, forwardRef, Injector, OnInit } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import * as moment from "moment";
import { ControlValueAccessorConnector } from "@teamin/helpers/control-value-accessor-connector";

@Component({
    selector: "t-datepicker",
    templateUrl: "./t-datepicker.component.html",
    styleUrls: ["./t-datepicker.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TDatepickerComponent),
            multi: true,
        },
    ],
})
export class TDatepickerComponent
    extends ControlValueAccessorConnector
    implements OnInit {
    @Input() dt: string;
    @Input() isDisabled: boolean = false;

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        if (this.control.value) {
            var m = moment(this.control.value).toDate();
            this.control.setValue(m);
        }
    }
    onChange(value: Date): void {
        this.change.emit(value)
    }
}
