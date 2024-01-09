import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { APIService } from '@teamin/services/api.service';
import { forkJoin, Subscription } from 'rxjs';
import { from } from 'linq-to-typescript';
import { kendoGridOptions } from '@teamin/models/common/kendo-grid';
import { take } from 'lodash';
import * as _ from 'lodash';

@Component({
  selector: 't-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  _con: any;
  _FontAwesome: any;
  _gridOptions: kendoGridOptions = {
    filterable: "menu",
    height: "fullHeight",
    pageable: {
      pageSizes: [50, 100, 500, 1000, 10000],
      info: true
    },
    sortable: true,
    state: {
      skip: 0,
      take: 50,
      filter: null,
      sort: null,
      aggregates: null,
      group: null
    },
    selectableSettings: {
      enabled: false
    },
    enableExcel: true,
    enablePDF: true
  }

  cnSubscription: Subscription;

  constructor(
    public _route: ActivatedRoute,
    private _apiService: APIService
  ) { }
  storename: any;
  ngOnInit(): void {
    this.cnSubscription = this._route.paramMap.subscribe(params => {
      this._con = this._apiService.getController(params.get('cn'));
      this._FontAwesome = this._con.p.FontAwesome ? "&#x" + this._con.p.FontAwesome + "; " : "";
      this._gridOptions = Object.assign({}, this._gridOptions);
    });

    this.storename = JSON.parse(localStorage.getItem('UserDetail'))
  }

  ngOnDestroy(): void {
    this.cnSubscription.unsubscribe()
  }

}
