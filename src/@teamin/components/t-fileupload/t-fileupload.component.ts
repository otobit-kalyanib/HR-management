import { Component, forwardRef, Input, Directive, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { FileRestrictions, SuccessEvent, FileInfo, ErrorEvent, ChunkSettings, UploadEvent, SelectEvent } from '@progress/kendo-angular-upload';
import { APIService } from '@teamin/services/api.service';

@Component({
  selector: 't-fileupload',
  templateUrl: './t-fileupload.component.html',
  styleUrls: ['./t-fileupload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TFileUploadComponent),
      multi: true
    }
  ]
})

export class TFileUploadComponent implements OnInit, ControlValueAccessor {
  chunkSetting: ChunkSettings;
  uploadSaveUrl: string;
  uploadRemoveUrl: string;
  public displayText: string;
  public controller: string;
  public parentParentController: string;
  public myFiles: Array<FileInfo> = [];
  public fileRestriction: FileRestrictions;
  commonService: APIService;
  router: Router;
  @Input()
  set dt(x: string) {
    this.displayText = x;
  }

  @Input()
  set fr(x: FileRestrictions) {
    this.fileRestriction = x;
  }

  @Input()
  set cn(x: string) {
    this.controller = x;
  }
  @Input()
  set ppcn(x: string) {
    this.parentParentController = x;
  }

  @Input('value') _value: any;
  onChange: any = () => { };
  onTouched: any = () => { };

  defaultRestrictions: FileRestrictions =
    {
      maxFileSize: 10485760,
      allowedExtensions: ['.jpg', '.jpeg', '.pdf', '.docx', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.png', '.bmp']
    };
  constructor(_commonService: APIService,
    _router: Router
  ) {
    this.commonService = _commonService;
    this.router = _router
  }

  ngOnInit() {
    //this.uploadSaveUrl = APIServices.getFileUploadURL(this.controller,this.parentParentController);

    //this.uploadRemoveUrl = environment.baseURL + APIEndpoints.UploadRemoveURL + this.controller + '/' + this.parentParentController;
  }

  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val;
    if (this.value) {
      this.myFiles =
        [{
          name: this.value.FileName,
          size: this.value.Size
        }];
    }
    else {
      this.myFiles = null;
    }
    this.onChange(val);
    this.onTouched();
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  writeValue(value) {
    if (value) {
      this.value = value;
    }
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  successEventHandler(e: SuccessEvent) {

    if (e.response && e.operation == 'upload') {
      this.value = e.response.body.Data
    }
    else {
      this.value = null;
    }
  }

  errorEventHandler(e: ErrorEvent) {

  }

  uploadEventHandler(e: UploadEvent) {

  }
  selectEventHandler(e: SelectEvent) {

  }
  removeEventHandler(e: UploadEvent) {

  }

  myRestrictions: FileRestrictions = this.fileRestriction ? this.fileRestriction : this.defaultRestrictions;
}
