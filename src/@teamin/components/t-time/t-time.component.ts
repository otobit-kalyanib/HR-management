import { Component, Input, forwardRef, Injector, OnInit } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import * as moment from "moment";
import { ControlValueAccessorConnector } from "@teamin/helpers/control-value-accessor-connector";

@Component({
  selector: 't-time',
  templateUrl: './t-time.component.html',
  styleUrls: ['./t-time.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TTimeComponent),
      multi: true,
    },
  ],
})
export class TTimeComponent extends ControlValueAccessorConnector
  implements OnInit {
  @Input() dt: string;
  @Input() isDisabled: boolean = false;
  @Input() format: string = 'hh:mm a'

  constructor(injector: Injector) {
    super(injector);
  }
  selectedTime: Date = new Date();
  ngOnInit() {
   
    // if (this.control.value) {
    //   var m = moment(this.control.value).toDate().toTimeString().split(' ')[0];
    //   this.control.setValue(m);
    // }
  }
  onChange(time) {
    var m = moment(time).toDate().toTimeString().split(' ')[0];
    this.control.setValue(m);
  }
}
