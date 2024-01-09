import { NgModule } from '@angular/core';
import { TAddressModule } from './t-address/t-address.module';
import { TAutoCompleteModule } from './t-autocomplete/t-autocomplete.module';
import { TBankModule } from './t-bank/t-bank.module';
import { TCheckBoxModule } from './t-checkbox/t-checkbox.module';
import { TComboModule } from './t-combo/t-combo.module';
import { TDateToDatePickerModule } from './t-date-to-date-picker/t-date-to-date-picker.module';
import { TDatepickerModule } from './t-datepicker/t-datepicker.module';
import { TDatetimepickerModule } from './t-datetimepicker/t-datetimepicker.module';
import { TDropModule } from './t-drop/t-drop.module';
import { TInputModule } from './t-input/t-input.module';
import { TInstrumentModule } from './t-instrument/t-instrument.module';
import { TLoadingModule } from './t-loading/t-loading.module';
import { TMultiColumnSearchModule } from './t-multicolumn-search/t-multicolumn-search.module';
import { TMultiselectModule } from './t-multiselect/t-multiselect.module';
import { TMultitableModule } from './t-multitable/t-multitable.module';
import { TPhoneModule } from './t-phone/t-phone.module';
import { TSearchModule } from './t-search/t-search.module';
import { TTextAreaModule } from './t-textarea/t-textarea.module';
import { TTimepickerModule } from './t-timepicker/t-timepicker.module';
import { TUploadModule } from './t-upload/t-upload.module';
import { TTimeModule } from './t-time/t-time.module';
import { TDateToDateTimePickerModule } from './t-date-to-datetime-picker/t-date-to-datetime-picker.module';


@NgModule({
    imports: [
        TInputModule,
        TTextAreaModule,
        TDropModule,
        TComboModule,
        TSearchModule,
        TCheckBoxModule,
        TMultiselectModule,
        TDatepickerModule,
        TDatetimepickerModule,
        TUploadModule,
        TPhoneModule,
        TAddressModule,
        TBankModule,
        TAutoCompleteModule,
        TDateToDatePickerModule,
        TInstrumentModule,
        TMultiColumnSearchModule,
        TLoadingModule,
        TTimepickerModule,
        TMultitableModule,
        TTimeModule,
        TDateToDateTimePickerModule

    ],
    exports: [
        TInputModule,
        TTextAreaModule,
        TDropModule,
        TComboModule,
        TSearchModule,
        TCheckBoxModule,
        TMultiselectModule,
        TDatepickerModule,
        TAutoCompleteModule,
        TDatetimepickerModule,
        TUploadModule,
        TPhoneModule,
        TAddressModule,
        TBankModule,
        TDateToDatePickerModule,
        TInstrumentModule,
        TMultiColumnSearchModule,
        TLoadingModule,
        TTimepickerModule,
        TMultitableModule,
        TTimeModule,
        TDateToDateTimePickerModule
    ],
})
export class TSharedModule { }
