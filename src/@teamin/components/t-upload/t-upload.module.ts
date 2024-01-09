import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { UploadModule } from '@progress/kendo-angular-upload';

import { TUploadComponent } from './t-upload.component';
import { TUploadInterceptorComponent, UploadInterceptor } from './t-upload-interceptor.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';



@NgModule({
  declarations: [TUploadComponent, TUploadInterceptorComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    UploadModule,
    MatCardModule
  ],
  bootstrap: [TUploadInterceptorComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UploadInterceptor,
      multi: true
    }
  ],
  exports: [TUploadComponent]
})
export class TUploadModule { }
