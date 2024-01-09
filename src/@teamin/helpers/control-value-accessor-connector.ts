import {
    AbstractControl,
    ControlContainer,
    ControlValueAccessor,
    FormControl,
    FormControlDirective,
} from '@angular/forms';
import { Injector, Input, ViewChild, Directive, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';


@Directive({ selector: '[controlValueAccessorConnector]' })
export class ControlValueAccessorConnector implements ControlValueAccessor {
    public isProduction: boolean = false;
    public isHover: boolean = false;

    @ViewChild(FormControlDirective, { static: true })
    formControlDirective: FormControlDirective;

    @Input()
    formControl: FormControl;

    @Input()
    formControlName: string;
    @Output() change = new EventEmitter<any>();
    get control() {
        return (
            this.formControl ||
            this.controlContainer.control.get(this.formControlName)
        );
    }

    constructor(private injector: Injector) {
        this.isProduction = environment.production;
    }

    get controlContainer() {
        return this.injector.get(ControlContainer);
    }

    registerOnTouched(fn: any): void {
        this.formControlDirective.valueAccessor.registerOnTouched(fn);
    }

    registerOnChange(fn: any): void {
        this.formControlDirective.valueAccessor.registerOnChange(fn);
        this.changed = fn;
    }

    writeValue(obj: any): void {
        this.formControlDirective.valueAccessor.writeValue(obj);
    }

    setDisabledState(isDisabled: boolean): void {
        this.formControlDirective.valueAccessor.setDisabledState(isDisabled);
    }
    changed = (_: any) => { };

    getControlName(c: AbstractControl): string | null {
        const formGroup = c.parent.controls;
        return Object.keys(formGroup).find(name => c === formGroup[name]) || null;
    }

    out() {
        if (!this.isProduction) {
            this.isHover = false;
        }
    }
}
