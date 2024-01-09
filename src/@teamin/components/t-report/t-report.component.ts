import {
    Component,
    OnInit,
    AfterViewInit,
    ViewChild,
    OnDestroy,
    Input,
    OnChanges,
} from '@angular/core';
import { TelerikReportViewerComponent } from '@progress/telerik-angular-report-viewer';
import { APIService } from '@teamin/services/api.service';

declare var kendo: any;

import { Subscription } from 'rxjs';
import { environment } from 'environments/environment';

@Component({
    selector: 't-report',
    templateUrl: './t-report.component.html',
    styleUrls: ['./t-report.component.scss'],
})
export class TReportComponent
    implements OnInit, AfterViewInit, OnDestroy, OnChanges {
    @ViewChild('viewer1', { static: false })
    viewer: TelerikReportViewerComponent;

    token: string;

    @Input() cn: string;
    @Input() parameters: any;
    @Input() parametersAreaVisible: boolean = true;
    @Input() isModal: boolean = false;

    constructor(private _apiService: APIService) {
        this.token = this._apiService.getAuthorization().access_token;
    }

    cnSubscription: Subscription;
    _con: any;
    _FontAwesome: any = '';
    _reportSource: any;

    public _serviceURL: string;

    ngOnInit(): void {
        this.viewerContainerStyle = {
            position: 'absolute',
            left: '5px',
            right: '5px',
            top: this.isModal ? '5px' : '40px',
            bottom: '5px',
            overflow: 'hidden',
            clear: 'both',
        };

        this._serviceURL = environment.baseURL + 'api/reports';
        this.load();
    }

    ngOnChanges() {
        this.load();
    }

    load() {
        this._con = this._apiService.getController(this.cn);
        if (this._con.p) {
            this._FontAwesome = this._con.p.FontAwesome
                ? '&#x' + this._con.p.FontAwesome + '; '
                : '';
        }
        this._reportSource = {
            report: this._con.cn,
            parameters: this.parameters,
        };
        if (kendo.jQuery(this.viewer).length != 0) {
            this.viewer.viewerObject.reportSource(this._reportSource);
        }
    }

    ngOnDestroy(): void {
        if (!this.cn) {
            this.cnSubscription.unsubscribe();
        }
    }

    ngAfterViewInit(): void {
        kendo.culture('en-IN');

        // const language = "en-IN";
        // let resources = StringResources.english;
        // if (language === "en-IN") {
        //     resources = StringResources.english;
        // }
        // this.viewer.viewerObject.stringResources = Object.assign(
        //     this.viewer.viewerObject.stringResources,
        //     resources
        // );
    }

    title = 'Report Viewer';

    viewerContainerStyle: any;

    parameterStyle = {
        editors: {
            singleSelect: 'COMBO_BOX',
            multiSelect: 'COMBO_BOX',
        },
    };

    ready() { }
    viewerToolTipOpening(e: any, args: any) {
        console.log('viewerToolTipOpening ' + args.toolTip.text);
    }
    onError(e: any, args: string) {
        //var report = $(this.viewer.nativeElement).data("telerik_ReportViewer");
        if (
            args.indexOf(
                'Provided token is expired, please request new token from refresh token!'
            ) >= 0
        ) {
            kendo.jQuery.ajax({
                type: 'POST',
                url: environment.baseURL + 'token',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: {
                    grant_type: 'refresh_token',
                    client_id: 'browser',
                    refresh_token: JSON.parse(localStorage.getItem('auth'))
                        .refresh_token,
                },
                success: function (r) {
                    localStorage.setItem('auth', JSON.stringify(r));
                    e.data.sender.authenticationToken(r.access_token);
                    e.data.sender.refreshReport();
                },
                error: function (r) {
                    console.log(r);
                },
            });
        }
        // if (args.indexOf("Provided token is expired, please request new token from refresh token!")) {
        //   this._apiService.getRefreshToken().subscribe(() => {
        //     this.token = this._apiService.getAuthorization().access_token;
        //     this.viewer.refreshReport();
        //   }, (e) => {
        //     if (e.status === 401) {
        //       if (e.error && e.error.error == "invalid_grant") {
        //         if (e.error.error == "invalid_grant") {
        //           this._router.navigateByUrl("/");
        //         }
        //       }
        //     }
        //   });
        // }
    }

    viewerClick(event) {

        if (event.srcElement.localName == 'span') {
            localStorage.setItem("Report", event.srcElement.localName)
        }

    }
}
