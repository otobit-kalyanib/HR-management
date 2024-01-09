import { Component, Input, forwardRef, Injector } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms'
import { ControlValueAccessorConnector } from '@teamin/helpers/control-value-accessor-connector';

@Component({
  selector: 't-textarea',
  templateUrl: './t-textarea.component.html',
  styleUrls: ['./t-textarea.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TTextAreaComponent),
      multi: true
    }
  ]
})
export class TTextAreaComponent extends ControlValueAccessorConnector {

  constructor(injector: Injector) {
    super(injector);
  }

  @Input() dt: string;
  @Input() rows: number;
  @Input() er: any;

  // ngOnInit(): void {

  //   this.control.valueChanges.subscribe(() => {
  //     if (this.control.value) {
  //       this.control.patchValue(this.control.value.toUpperCase(), {
  //         emitEvent: false,
  //       });
  //     }
  //   });


  // }

}
