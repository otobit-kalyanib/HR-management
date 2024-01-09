import { Component, Input, forwardRef, Directive, OnInit, OnDestroy, Inject, ViewChild } from '@angular/core';
import { APIService } from '../../services/api.service';
import { ResponseDataModel } from '../../models/common/response-model';
import { DataSourceRequestState, groupBy } from '@progress/kendo-data-query';
import { fuseAnimations } from '@fuse/animations';
//import { SignalRService } from '../../services/signal-r.service';
import { Observable, Subscription } from 'rxjs';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridComponent, DataStateChangeEvent, GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
//import { SignalRMessageTypes } from '../../models/enums';
import { Router } from '@angular/router'

@Component({
  selector: 't-graph',
  templateUrl: './t-graph.component.html',
  styleUrls: ['./t-graph.component.scss'],
  animations: fuseAnimations
})
export class TGraphComponent implements OnInit, OnDestroy {
  signalRSubscription: Subscription;

  public widget: any;
  public seriesData: any;
  cn: string;
  wid: string;
  hit: string
  public _loading: boolean;
  isChecked: boolean

  public state: DataSourceRequestState = {
    skip: 0,
    take: 100,
    filter: null,
    sort: null,
    group: null
  };

  @Input('value') _value: string;
  onChange: any = () => { };
  onTouched: any = () => { };

  @Input()
  set con(x: string) {
    this.cn = x;
  }

  @Input()
  set width(x: string) {
    this.wid = x;
  }
  @Input()
  set height(x: string) {
    this.hit = x;
  }

  constructor(private _commonService: APIService,
    public dialog: MatDialog,
    private _router: Router
  ) {

  }

  ngOnInit(): void {
    this.widget = this._commonService.getController(this.cn);
    this.isChecked = Boolean(this.widget.p.WidgetGraphDefaultStackable);

    this.getData();

    if (this.signalRSubscription)
      this.signalRSubscription.unsubscribe();
    this.getSignalRData();
  }

  getSignalRData() {
    // this.signalRSubscription = this._signalrService.currentMessage.subscribe((x: any) => {
    //     console.log('Received from widget')
    //     if (x)
    //         if (x.messageType == SignalRMessageTypes.Feed)
    //             this.isChecked = x.Data.isChecked;
    // }, ((e) => {
    //     if (e.status == '401' && e.statusText == "token_expired") {
    //         this._commonService.getNewAccessToken().subscribe((token: Token) => {
    //             window.localStorage.setItem('auth', JSON.stringify(token));
    //             this.getSignalRData();
    //         })
    //     }
    //     else if (e.status == '401') {
    //         this._router.navigateByUrl('/pages/auth/login-2');
    //     }
    // })
    // );
  }

  getData() {
    this._commonService.getData("Widget", this.widget.cn, this.state).subscribe((r: ResponseDataModel) => {
      if (this.widget.p.WidgetGraphHasSubCategory == "True") {
        this.seriesData = r ? groupBy(r.Records, [{ field: "subcategory" }]) : [];
      } else {
        this.seriesData = r ? r.Records : [];
      }
    }, ((e) => {

    }), () => {
      this._loading = false;
    });
  }

  ngOnDestroy(): void {
    if (this.signalRSubscription)
      this.signalRSubscription.unsubscribe();
  }

  openDialog(e) {
    /*const dialogRef = this.dialog.open(GraphWidgetDialog, {
        height: '100%',
        width: '100%'
    });

    dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
    });*/
  }
}

@Component({
  selector: 't-graph-dialog',
  templateUrl: './t-graph-dialog.component.html',
  styleUrls: ['./t-graph.component.scss']
})
export class TGraphDialogComponent {
  public cn: any;
  public c:any;
  public _loading: boolean;
  public hiddenColumns: string[];
  public data: GridDataResult;
  public state: DataSourceRequestState = {
    skip: 0,
    take: 20,
    filter: null,
    sort: null,
    group: null
  };
  public serviceSchema: Subscription
  public serviceData: Subscription

  constructor(@Inject(MAT_DIALOG_DATA)
  public params: any,
    private commonService: APIService,
    private _router: Router
  ) {
    this.cn = params.cn;
    this.getData();
  }
  @ViewChild('grid', { static: true }) grid: GridComponent;
  private getData() {
    this.serviceData = this.commonService.getData("list", this.params.cn, this.state).subscribe((r: ResponseDataModel) => {
      this.data = {
        data: r ? r.Records : [],
        total: r ? r.Total : null
      }
      setTimeout(() => {
        this.grid.autoFitColumns();
      }, 1000)
    }, ((e) => {

    }), () => {
      this._loading = false;
    });
  }
  public onDataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.getData();
  }
}
