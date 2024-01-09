import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FilterExpression } from '@progress/kendo-angular-filter';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';
import { KendoGridColumnDefination } from '@teamin/models/common/kendo-grid';
import { ResponseSchemaModel } from '@teamin/models/common/response-model';
import { APIService } from '@teamin/services/api.service';
@Component({
  selector: 'app-t-filter',
  templateUrl: './t-filter.component.html',
  styleUrls: ['./t-filter.component.scss']
})
export class TFilterComponent {
  constructor(
    private _apiService: APIService,
    // private router: Router,
    public _dialog: MatDialog,
    @Optional() public _dialogRef?: MatDialogRef<TFilterComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public _dialogData?: any

  ) {

  }
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  // public filters: FilterExpression[] = [  
  //   {
  //     field: this._dialogData.data[1].field,
  //     title: this._dialogData.data[1].title,
  //     editor: 'string',
  //     operators: ['contains'],
  //   },
  // ];

  // public filters: FilterExpression[]
  // public _gridColumns: KendoGridColumnDefination[] = [];
  // public onFilter(input: Event): void {
  //   const inputValue = (input.target as HTMLInputElement).value;

  //   this.filters = process(this._dialogData.data, {

  //     filter: {
  //       logic: "or",
  //       filters: [
  //         {
  //           field: 'field',
  //           operator: 'contains',
  //           value: inputValue
  //         },
  //       ]
  //     }
  //   }).data;

  //   this.dataBinding.skip = 0;
  // }

}
