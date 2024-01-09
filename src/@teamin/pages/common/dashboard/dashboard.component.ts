import { Location } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute } from '@angular/router';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { TFilterComponent } from '@teamin/components/t-filter/t-filter.component';
import { APIService } from '@teamin/services/api.service';
import {
    CompactType,
    GridsterConfig,
    GridsterItem,
    GridType,
    GridsterItemComponent,
    GridsterComponent,
} from 'angular-gridster2';
import { Con, DashboardWidget } from 'app/core/common/common.types';
import { from } from 'linq-to-typescript';
import { forkJoin, Subject, Subscription, takeUntil } from 'rxjs';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
    @ViewChild('gridster') ele: GridsterComponent;
    public user: any;
    @ViewChild('matdrawer') matdrawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    widgets: any[];
    public options: GridsterConfig;
    public check: any;
    cnSubscription: Subscription;
    public _con: Con;
    public _isLoading: boolean = false;

    allWidgets: any[];
    test: any = [];
    test1: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    public isdisabled: boolean = false;
    constructor(
        public _route: ActivatedRoute,
        public _apiService: APIService,
        public _fuseMediaWatcherService: FuseMediaWatcherService,
        private location: Location,
        public _dialog: MatDialog,
        @Optional() public _dialogRef?: MatDialogRef<DashboardComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public _dialogData?: any
    ) {
        this.allWidgets = from(this._apiService.getControllers())
            .where((x: Con) =>
                [
                    'WList',
                    'WTile',
                    'WChart',
                    'WListGroup',
                    'WTileGroup',
                    'WChartGroup',
                ].some((y) => y == x.ct)
            )
            .toArray();

        this.options = {
            gridType: GridType.ScrollVertical,
            compactType: CompactType.None,
            pushItems: true,
            draggable: {
                enabled: true,
            },
            resizable: {
                enabled: true,
            },
            displayGrid: 'onDrag&Resize',
            mobileBreakpoint: 375,
        };

        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Check if the breakpoint is 'md' and up
                //this.isScreenSmall = matchingAliases.includes('md');
                if (matchingAliases.includes('xl')) {
                    this.options.minCols = 14;
                    this.options.maxCols = 14;
                } else if (matchingAliases.includes('lg')) {
                    this.options.minCols = 12;
                    this.options.maxCols = 12;
                } else if (matchingAliases.includes('md')) {
                    this.options.minCols = 8;
                    this.options.maxCols = 8;
                } else if (matchingAliases.includes('sm')) {
                    this.options.minCols = 4;
                    this.options.maxCols = 4;
                } else {
                    this.options.minCols = 4;
                    this.options.maxCols = 4;
                }
                if (this.options.api) this.options.api.optionsChanged();
            });
    }
    refresh(): void {
        this.location.go(this.location.path());
        window.location.reload();
    }
    Onfilter(data) {
        const dialogRef = this._dialog.open(TFilterComponent, {
            data: {
                data
            },
            height: "50%",
            width: "40%"

        });
        dialogRef.afterClosed().subscribe((result) => {
            // this.loadData()
        })
    }
    ngAfterViewInit(): void { }
    goToPanel(panel: string): void {
        // this.selectedPanel = panel;

        // Close the drawer on 'over' mode
        if (this.drawerMode === 'over') {
            this.matdrawer.close();
        }
    }
    ngOnInit() {
        this.cnSubscription = this._route.paramMap.subscribe((params) => {
            this._con = this._apiService.getController(params.get('cn'));
            for (var i = 0; i < this._con.p.DashboardLayout.widgets.length; i++) {
                this.test = this._con.p.DashboardLayout.widgets

                for (var j = 0; j < this.allWidgets.length; j++) {
                    if (this.test == this.allWidgets[j].cn) {
                        this.test1 = this.allWidgets[j].p.DisplayText

                        // const filteredArray1 = this.allWidgets.filter((item1) => {
                        //     const matchingItem = this.test.find((item2) => {
                        //         this.test1=  item1.cn === item2.cn 
                        //         return item1.cn === item2.cn 
                        //     });
                        //     return matchingItem;
                        // });

                    } else {
                        // this.isdisabled = true
                    }
                }
            }

            let allWidgetsCN = from(this.allWidgets)
                .select((x: Con) => {
                    return x.cn;
                })
                .toArray();

            this.widgets = from(this._con.p.DashboardLayout.widgets)
                .where((x: DashboardWidget) => allWidgetsCN.includes(x.cn))
                .select((x: DashboardWidget) => {
                    return <GridsterItem>{
                        cn: x.cn,
                        ct: this._apiService.getController(x.cn).ct,
                        x: x.p.x,
                        y: x.p.y,
                        rows: x.s.r,
                        cols: x.s.c,
                    };
                })
                .toArray();
            this._isLoading = false;
        });

        this.user = JSON.parse(localStorage.getItem('UserDetail'))

    }

    onSave() { }

    onAdd(con: Con) {
        try {
            con.p.WidgetLayout = JSON.parse(con.p.WidgetLayout.toString());
        } catch (e) { }

        this.check = con;
        this.widgets.push({
            cn: con.cn,
            ct: con.ct,
            x: 0,
            y: 0,
            cols: con.p.WidgetLayout.size.c,
            rows: con.p.WidgetLayout.size.r,
        });
    }
    isdisable(a) {
        var b: boolean

        this.test.forEach(element => {
            if (element.cn == a) {
                b = true
            }

        });
        return b
    }
    ngOnDestroy(): void {
        this.cnSubscription.unsubscribe();
        this._unsubscribeAll.unsubscribe();
    }
}
