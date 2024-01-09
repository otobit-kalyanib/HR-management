import { Component, Input, forwardRef, Injector, Output, EventEmitter } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { ControlValueAccessorConnector } from "@teamin/helpers/control-value-accessor-connector";
import { MatCheckboxChange } from "@angular/material/checkbox";

@Component({
    selector: "t-checkbox",
    templateUrl: "./t-checkbox.component.html",
    styleUrls: ["./t-checkbox.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TCheckBoxComponent),
            multi: true,
        },
    ],
})
export class TCheckBoxComponent extends ControlValueAccessorConnector {
    constructor(injector: Injector) {
        super(injector);
    }

    @Input() dt: string;
    @Input() type: string;
    @Input() er: any;
    @Input() labelText: string;
    @Input() isDisabled: boolean;
    @Input() isChecked: boolean;
    @Output() change: EventEmitter<MatCheckboxChange>;

    onChangeDemo($event: MatCheckboxChange) {
        this.change.emit($event);
     } 


}
