import { Component, Input, forwardRef, Injector, OnInit } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import * as moment from "moment";
import { ControlValueAccessorConnector } from "@teamin/helpers/control-value-accessor-connector";

@Component({
    selector: "t-datetimepicker",
    templateUrl: "./t-datetimepicker.component.html",
    styleUrls: ["./t-datetimepicker.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TDatetimepickerComponent),
            multi: true,
        },
    ],
})
export class TDatetimepickerComponent
    extends ControlValueAccessorConnector
    implements OnInit {
    @Input() dt: string;
    @Input() isDisabled: boolean = false;
    public isBackDate: boolean

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        if (this.control.value) {
            var m = moment(this.control.value).toDate();
            this.control.setValue(m);
        }

        // this.isBackDate = JSON.parse(localStorage.getItem("UserDetail")).IsBackDate
    }

    public dateDisabled = (date: Date): boolean => {
        const today: Date = new Date();
        today.setHours(0, 0, 0, 0); // Set the time component to 00:00:00

        const selectedDate: Date = new Date(date);
        selectedDate.setHours(0, 0, 0, 0); // Set the time component to 00:00:00

        return selectedDate < today;
    };
}
