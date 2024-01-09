import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import * as moment from "moment";

export class TValidators {
    //Required Validator
    public static requiredValidator(errorMessage: string) {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.value == null || control.value == "") {
                return {
                    message: errorMessage,
                };
            }
            return null;
        };
    }

    //Min Length Validator
    public static minLengthValidator(min: number, errorMessage: string) {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.value < min) {
                return {
                    message: errorMessage,
                };
            }
            return null;
        };
    }

    //Max Length Validator
    public static maxLengthValidator(max: number, errorMessage: string) {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.value > max) {
                return {
                    message: errorMessage,
                };
            }
            return null;
        };
    }

    //Drop Validator
    public static dropRequiredValidator(errorMessage: string) {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.value) {
                if (control.value.Id == 0 || control.value.Id == null) {
                    return {
                        message: errorMessage,
                    };
                }
                return null;
            } else {
                return {
                    message: errorMessage,
                };
            }
        };
    }

    //Drop Validator Message-less
    public static dropRequiredValidatorMessageLess(
        control: AbstractControl
    ): ValidationErrors | null {
        if (control.value.Id == 0 || control.value.Id == null) {
            return {
                message: "Field is Required",
            };
        }
        return null;
    }

    //Mobile Validator
    public static mobileRequiredValidator(errorMessage: string) {
        return (control: AbstractControl): ValidationErrors | null => {
            if (
                control.value == null ||
                control.value.ContactNumber == null ||
                control.value.CountryCode == null ||
                control.value.ContactNumberType.Id == null ||
                control.value.ContactNumberType.Text == null
            ) {
                return {
                    message: errorMessage,
                };
            }
            return null;
        };
    }

    //Date Range Validator
    public static dateRangeRequiredValidator(errorMessage: string) {
        return (control: AbstractControl): ValidationErrors | null => {
            if (
                control.value.FromDate == null ||
                control.value.ToDate == null
            ) {
                return {
                    message: errorMessage,
                };
            }
            return null;
        };
    }

    public static dateRangeValidator(errorMessage: string) {
        return (control: AbstractControl): ValidationErrors | null => {
            if (
                control.value.FromDate != null ||
                control.value.ToDate != null
            ) {
                var fromDate: moment.MomentInput = moment(
                    control.value.FromDate
                );
                var toDate: moment.MomentInput = moment(control.value.ToDate);
                if (fromDate.isAfter(toDate)) {
                    return {
                        message: errorMessage,
                    };
                }
            }
            return null;
        };
    }

    //Length Validator with min and max values
    public static lengthValidator(
        min: number,
        max: number,
        errorMessage: string
    ): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.value == null) {
                return null;
            }
            if (control.value.length < min || control.value.length > max) {
                return {
                    message: errorMessage,
                };
            }

            return null;
        };
    }

    //Range Validator with min and max values
    public static rangeValidator(
        min: number,
        max: number,
        errorMessage: string
    ): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.value == null) {
                return null;
            }
            if (control.value < min || control.value > max) {
                return {
                    message: errorMessage,
                };
            }

            return null;
        };
    }

    //Email Validator
    public static EmailValidator(errorMessage: string): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            let EMAIL_REGEXP = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/gim;
            if (control.value == null) {
                return null;
            }
            if (
                control.value &&
                (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))
            ) {
                return {
                    message: errorMessage,
                };
            }

            return null;
        };
    }

    //Regex Validator
    public static RegexValidator(
        regex: any,
        errorMessage: string
    ): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            let pattern = new RegExp(regex);
            if (control.value == null) {
                return null;
            }
            if (control.value && !pattern.test(control.value)) {
                return {
                    message: errorMessage,
                };
            }
            return null;
        };
    }

    //Match Validator
    public static ConfirmedValidator(group: FormGroup) {
        let pass = group.controls.NewPassword.value;
        let confirmPass = group.controls.ConfirmPassword.value;
        if (pass !== null && pass !== "") {
            if (pass === confirmPass) {
                return null;
            } else {
                group.controls.ConfirmPassword.setErrors({
                    message: "Confirm Password is not matching New Password",
                });
                return {
                    message: "Confirm Password is not matching New Password",
                };
            }
        }
    }
}
