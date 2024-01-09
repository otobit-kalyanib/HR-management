import { Component, Input, forwardRef, Injector, OnInit } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { ControlValueAccessorConnector } from "@teamin/helpers/control-value-accessor-connector";

@Component({
    selector: "t-input",
    templateUrl: "./t-input.component.html",
    styleUrls: ["./t-input.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TInputComponent),
            multi: true,
        },
    ],
})
export class TInputComponent
    extends ControlValueAccessorConnector
    implements OnInit {
    constructor(injector: Injector) {
        super(injector);
    }

    @Input() dt: string;
    @Input() placeholder: string = "";
    @Input() type: string;
    @Input() er: any;
    @Input() isDisabled: boolean = false;
    @Input() toUpper: boolean = true;
    @Input() tooltip: string = null;
    @Input() min: number;


    public istooltip: boolean = false;

    ngOnInit(): void {
        if (this.tooltip) {
            this.istooltip = true
        }
        // if (this.toUpper) {
        //     if (this.type != "number")
        //         this.control.valueChanges.subscribe(() => {
        //             if (this.control.value) {
        //                 this.control.patchValue(this.control.value.toUpperCase(), {
        //                     emitEvent: false,
        //                 });
        //             }
        //         });
        // }

    }
}
