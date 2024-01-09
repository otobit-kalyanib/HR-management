import { NgModule } from '@angular/core';
import { UploadModule } from '@progress/kendo-angular-upload';
import { TFileUploadInterceptor, TFileUploadInterceptorComponent } from './t-fileuploadinterceptor.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TFileUploadComponent } from './t-fileupload.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TFileUploadInterceptorComponent, 
    TFileUploadComponent
  ],

  imports: [
    UploadModule, 
    CommonModule,
    FormsModule
  ],
  
  bootstrap: [TFileUploadInterceptorComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TFileUploadInterceptor,
      multi: true
    }
  ],
  exports: [TFileUploadComponent],
})
export class TFileUploadModule { }
