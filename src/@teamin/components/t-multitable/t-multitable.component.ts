import { Component, forwardRef, Injector, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorConnector } from '@teamin/helpers/control-value-accessor-connector';
import { TPageMaster } from '@teamin/helpers/t-page-master';
import { TValidators } from '@teamin/helpers/t-validators';
import { hasIn } from 'lodash';

@Component({
  selector: 't-multitable',
  templateUrl: './t-multitable.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TMultitableComponent),
      multi: true,
    },
  ],
})
export class TMultitableComponent extends ControlValueAccessorConnector
  implements OnInit {

  public head: any = [];
  _Table: FormGroup;
  _formBuilder: FormBuilder = new FormBuilder();
  @Input() _TableData: any;
  @Input() HeadingData: any;

  constructor(injector: Injector, _formBuilder: FormBuilder) {
    super(injector);
    this._Table = this._formBuilder.group({});
  }

  get _Table2() {
    return this._TableData.Model as FormArray;
  }
  ngOnInit(): void {

    this.HeadingData.forEach(item => {
      this.head.push(item.replace(" ", ""))
    });

    this._Table = this.prepareFormGroup(this._TableData.Model, this._TableData.Validations);

  }


  getFormGroup(data: any, validations: any): FormGroup {

    var fb = new FormGroup({});
    Object.keys(data).forEach((x) => {
      var validators = [];

      if (validations && validations != null && validations[x]) {

        if (validations[x]?.Validations) {
          if (validations[x]?.Validations.GetChildValidators !== undefined)
            if (validations[x]?.Validations.GetChildValidators) {
              if (Array.isArray(data[x]))
                if (!data[x].length)
                  data[x].push(validations[x].Model);

              var g = this.prepareFormGroup(data[x], validations[x]?.Validations);
              fb.setControl(x, g);
            }
        }

        if (hasIn(data[x], "Id") && hasIn(data[x], "Text")) {
          if (validations[x].Required !== undefined) {
            validators.push(
              TValidators.dropRequiredValidator(
                validations[x].Required.Message
              )
            );
          }
        } else if (
          hasIn(data[x], "ContactNumberType") &&
          hasIn(data[x], "CountryCode") &&
          hasIn(data[x], "ContactNumber")
        ) {
          if (validations[x].Required !== undefined) {
            validators.push(
              TValidators.mobileRequiredValidator(
                validations[x].Required.Message
              )
            );
          }
        } else if (
          hasIn(data[x], "FromDate") &&
          hasIn(data[x], "ToDate")
        ) {
          if (validations[x].Required !== undefined) {
            validators.push(
              TValidators.dateRangeRequiredValidator(
                validations[x].Required.Message
              )
            );
          }
          validators.push(
            TValidators.dateRangeValidator(
              "From date should be before to date!"
            )
          );
        } else if (validations[x].Required !== undefined) {
          validators.push(
            TValidators.requiredValidator(
              validations[x].Required.Message
            )
          );
        }
        if (validations[x].Length !== undefined) {
          validators.push(
            TValidators.lengthValidator(
              validations[x].Length.Min,
              validations[x].Length.Max,
              validations[x].Length.Message
            )
          );
        }
        if (validations[x].EMail !== undefined) {
          validators.push(
            TValidators.EmailValidator(validations[x].EMail.Message)
          );
        }
        if (validations[x].Regex !== undefined) {
          validators.push(
            TValidators.RegexValidator(
              validations[x].Regex.Pattern,
              validations[x].Regex.Message
            )
          );
        }
        if (validations[x].Range !== undefined) {
          validators.push(
            TValidators.rangeValidator(
              validations[x].Range.Min,
              validations[x].Range.Max,
              validations[x].Range.Message
            )
          );
        }
      }
      fb.addControl(x, new FormControl(data[x], validators));
    });

    return fb;

  }

  prepareFormGroup(data: any, validations: any): any {

    if (Array.isArray(data)) {

      var fbs = [];
      data.forEach((element, i) => {
        fbs.push(this.getFormGroup(element, validations));
      });
      return this._formBuilder.array(fbs);
    } else {
      return this.getFormGroup(data, validations);
    }

  }

  addVendorContactDetails() {
    this._Table2
      .push(
        this.prepareFormGroup(
          this._TableData.Model,
          this._TableData.Validations
        )
      );
    return false;
  }

  removeRow(i) {
    this._Table2.removeAt(i);
  }
  static getSelector() {
    return 't-' + 'input';
  }

}