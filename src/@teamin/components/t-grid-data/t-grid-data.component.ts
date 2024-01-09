import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { GridComponent, SelectableSettings, SelectionEvent } from '@progress/kendo-angular-grid';

import { KendoGridSettings, KendoGridColumnDefination } from '@teamin/models/common/kendo-grid';

@Component({
  selector: 't-grid-data',
  templateUrl: './t-grid-data.component.html',
  styleUrls: ['./t-grid-data.component.scss']
})
export class TGridDataComponent implements OnInit, OnChanges {

  selectableSettings: SelectableSettings;

  @ViewChild('ele', { static: true }) ele: GridComponent;

  @Input() gridSettings: KendoGridSettings;
  @Input() isLoading: boolean = true;
  @Input() selectedValues: number[];

  showSelectAll: boolean;

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (propName == 'gridSettings') {
        let cv = changes.gridSettings.currentValue;
        this.selectableSettings = {
          checkboxOnly: false,
          enabled: true,
          mode: cv.selectableMode
        }
        this.showSelectAll = cv.selectableMode == "multiple" ? true : false;
        this.isLoading = false;
        setTimeout(() => this.ele.autoFitColumns());
      }
    }
  }

  selectedChange(data: SelectionEvent) {
  }

  constructor() { }

  ngOnInit(): void {

  }

}
