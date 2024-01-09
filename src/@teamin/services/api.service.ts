/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable arrow-parens */
/* eslint-disable arrow-body-style */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import {
    DataSourceRequestState,
    toDataSourceRequestString,
} from '@progress/kendo-data-query';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { Params } from '@angular/router';
import { KendoGridColumnDefination } from '@teamin/models/common/kendo-grid';
import { Defaults } from '@teamin/models/common/subscriber/defaults';
import { Organisation } from '@teamin/models/organisation';
import { Con } from 'app/core/common/common.types';
import { from } from 'linq-to-typescript';
import {
    ResponseDataModel,
    ResponsePostModel,
    ResponsePutModel,
    ResponseResult,
    ResponseSchemaModel,
} from '../models/common/response-model';
import { Auth } from '../models/common/subscriber/auth';

const APIURL: string = environment.baseURL;

@Injectable({ providedIn: 'root' })
export class APIService {
    constructor(
        private _http: HttpClient,
        @Inject(LOCALE_ID) public localeId: string
    ) { }

    public numWords = require('num-words');

    IsRequesting: boolean = false;

    getHostName(): string {
        let hostName = window.location.hostname.replace('www.', '').toString();
        if (environment.production) {
            return hostName;
        } else {
            return 'office.demo.locobear.com';
            // return 'office.blr1.locobear.com';
        }
    }

    public getInWords(number) {
        if (number)
            return this.numWords(Math.round(number)).toUpperCase() + ' ONLY';
        return '';
    }

    public isLoggedIn(): boolean {
        if (this.getAuthorization()) {
            return true;
        } else {
            return false;
        }
    }

    public loginType(): string {
        var auth = this.getAuthorization();
        if (auth) {
            return auth.loginType.toLowerCase();
        }
    }

    public getToken(userName: string, password: string): Observable<any> {
        var reqHeaders = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
        });

        const http$ = this._http.post(
            APIURL + 'token',
            new HttpParams()
                .set('grant_type', 'password')
                .set('username', userName)
                .set('password', password)
                .set('scope', 'org:' + this.getOrganisation().GUID)
                .set('client_id', 'browser'),
            { headers: reqHeaders }
        );

        return http$.pipe(
            map((r) => r)
        );
    }

    public getRefreshToken(): Observable<any> {
        var reqHeaders = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
        });

        const payload = {
            grant_type: 'refresh_token',
            refresh_token: this.getAuthorization().refresh_token,
            client_id: 'browser',
            token: this.getAuthorization().access_token,
        };

        const http$ = this._http.post(
            APIURL + 'Subscriber/Authentications/Refresh',
            payload
            // { headers: reqHeaders }
        );

        return http$.pipe(
            map((r) => r)
        );
    }

    public saveAuthorization(auth: string) {
        localStorage.setItem('auth', auth);
    }

    public getAuthorization(): Auth {
        if (localStorage.getItem('auth')) {
            return JSON.parse(localStorage.getItem('auth'));
        } else {
            return null;
        }
    }

    public getRequestByURL(url: string, params?: Params): Observable<any> {
        url = url.indexOf('/') === 0 ? url.substring(1) : url;

        // var reqHeaders = new HttpHeaders({
        //     "Content-Type": "application/x-www-form-urlencoded",
        // });

        const http$ = this._http.get(APIURL + url, {
            params: params,
        });

        return http$.pipe(
            map((r) => {
                return r;
            })
        );
    }

    public postRequestByURL(
        url: string,
        post: any,
        params?: Params
    ): Observable<any> {
        return this._http.post<ResponseResult>(`${APIURL}${url}`, post, {
            params: params,
        });
    }

    public putRequestByURL(
        url: string,
        put: any,
        params?: Params
    ): Observable<any> {
        return this._http.put<ResponseResult>(`${APIURL}${url}`, put, {
            params: params,
        });
    }

    public getRequestByControllerName(cn: string, params?: Params): any { }

    public saveControllers(cons: string) {
        localStorage.setItem('cons', JSON.stringify(cons));
    }

    public getControllers(): Con[] {
        return JSON.parse(localStorage.getItem('cons'));
    }

    public getController(cn): any {
        var cons = JSON.parse(localStorage.getItem('cons'));

        if (cons != null) {
            var c = from(cons)
                .where(
                    (x: any) =>
                        x.cn.toString().toLowerCase() ==
                        cn.toString().toLowerCase()
                )
                .firstOrDefault();

            // if (c === null) {
            // }
            return c;
        } else {
            return null;
        }
    }

    public getControllerByURL(URL: string): Con {
        var c = from(this.getControllers())
            .where((x: Con) => x.p.URL === URL)
            .select((x: Con) => {
                return x;
            })
            .firstOrDefault();
        return c;
    }

    public saveDefaults(data: any) {
        localStorage.setItem('defaults', JSON.stringify(data));
    }

    public getDefaults(): Defaults {
        return JSON.parse(localStorage.getItem('defaults'));
    }

    public saveNavigation(nav: any) {
        localStorage.setItem('nav', JSON.stringify(nav));
    }

    public getNavigation() {
        return JSON.parse(localStorage.getItem('nav'));
    }

    public getTextAvatarURL(name: string, size: number) {
        return (
            'https://ui-avatars.com/api/?size=' +
            size.toString() +
            '&name=' +
            name
        );
    }

    public clearLocalStorage() {
        localStorage.clear();
    }

    public getView(
        type: string,
        cn: string,
        parentCon: string,
        queryStr: string
    ): Observable<any> {
        return this._http.get<any>(
            `${APIURL}common/${type}/general/data?con=${cn}&parentCon=${parentCon}${queryStr}`
        );
    }

    public getData(
        type: string,
        cn: string,
        state: DataSourceRequestState,
        parentCon?: string
    ): Observable<ResponseDataModel> {
        const queryStr = state ? `${toDataSourceRequestString(state)}` : '';
        if (parentCon != null && parentCon !== undefined) {
            parentCon = '&parentCon=' + parentCon;
        } else {
            parentCon = '&parentCon=';
        }
        return this._http.get<ResponseDataModel>(
            `${APIURL}common/${type}/general/data?con=${cn}${parentCon}&${queryStr}`
        );
    }

    public getSchema(
        type: string,
        cn: string,
        state: DataSourceRequestState,
        parentcn?: string
    ): Observable<ResponseSchemaModel> {
        const queryStr = state ? `${toDataSourceRequestString(state)}` : '';
        if (parentcn != null && parentcn !== undefined) {
            parentcn = '&parentCon=' + parentcn;
        } else {
            parentcn = '';
        }
        return this._http.get<ResponseSchemaModel>(
            `${APIURL}common/${type}/general/schema?con=${cn}${parentcn}&${queryStr}`
        );
    }

    public postData(cn, post: any): Observable<any> {
        var postURL: string;
        if (this.getController(cn) !== null) {
            postURL = this.getController(cn).p.URL;
        }
        return this._http.post<ResponseResult>(`${APIURL}${postURL}`, post);
    }

    public putData(cn, id, put: any, params?: Params): Observable<any> {
        var con = this.getController(cn);
        if (id === null) {
            return this._http.put<ResponseResult>(
                `${APIURL}${con.p.URL}`,
                put,
                { params: params }
            );
        } else {
            return this._http.put<ResponseResult>(
                `${APIURL}${con.p.URL}/${id}`,
                put,
                { params: params }
            );
        }
    }

    public getViewData(cn: string, id?: string): Observable<any> {
        var con = this.getController(cn);
        if (id) {
            return this._http.get<any>(
                `${APIURL}common/view/general/data?con=${cn}&id=${id}`
            );
        } else {
            return this._http.get<any>(`${APIURL}${con.p.URL}`);
        }
    }

    public getPostData(cn): Observable<ResponsePostModel> {
        var con = this.getController(cn);
        return this._http.get<ResponsePostModel>(`${APIURL}${con.p.URL}`);
    }

    public getPostDataTokenLess(url): Observable<ResponsePostModel> {
        var con = url;
        return this._http.get<ResponsePostModel>(`${APIURL}${con}`);
    }

    public getPutData(
        id: string,
        cn: string,
        params?: Params
    ): Observable<ResponsePutModel> {
        var con = this.getController(cn);
        if (id === null) {
            return this._http.get<ResponsePutModel>(`${APIURL}${con.p.URL}`, {
                params: params,
            });
        } else {
            return this._http.get<ResponsePutModel>(
                `${APIURL}${con.p.URL}/${id}`,
                { params: params }
            );
        }
    }

    public downloadFile(url: string) {
        var mURL = url;

        this._http
            .get(`${mURL}`, { responseType: 'blob', observe: 'response' })
            .subscribe((response) => {
                var contentDisposition = response.headers.get(
                    'content-disposition'
                );
                var contentType = response.headers.get('content-type');
                var filename = contentDisposition
                    .split(';')[1]
                    .split('filename')[1]
                    .split('=')[1]
                    .trim();
                let saveAs = require('file-saver');
                let file = new Blob([response.body], { type: contentType });
                saveAs(file, filename);
            });
    }

    public viewFile(url: string) {
        //this.dLoading = true;

        var mURL = url;

        return this._http.get(`${mURL}`, {
            responseType: 'blob',
            observe: 'response',
        });
    }

    private cascadeSource: Subject<any> = new Subject();
    cascadeData = this.cascadeSource.asObservable();
    public cascadeCatch(data: any) {
        this.cascadeSource.next(data);
    }

    getQueryString(obj: Object) {
        var str = '';
        for (var key in obj) {
            str += '&' + key + '=' + encodeURIComponent(obj[key]);
        }
        return str;
    }

    public getFileDowloadURL(cn: string, container: string, FGUID: string) {
        return `${APIURL}common/file/download/${cn}/${container}/${FGUID}`;
    }

    public getFileUploadURL(cn?: string, pcn?: string) {
        return `${APIURL}Common/DataStore/Files/Upload`;
    }

    public getFileRemoveURL(FGUID: string) {
        return `${APIURL}Common/DataStore/Files/Delete/${FGUID}`;
    }

    constructKendoGridColumns(
        data: ResponseSchemaModel,
        con: any
    ): KendoGridColumnDefination[] {
        let PAggregates = con.p.Aggregates ? JSON.parse(con.p.Aggregates) : [];

        var gridColumns = data.Schema.Columns.map(
            (x) =>
                <KendoGridColumnDefination>{
                    field: x.Name,
                    hidden: data.Schema.Keys.includes(x.Name) ? true : false,
                    title: x.Name.replace(/([a-z])([A-Z])/g, '$1 $2').trim(),
                    format:
                        x.Type === 'TimeSpan'
                            ? '{0:HH:mm tt}'
                            : x.Type === 'DateTime'
                                ? '{0:dd-MM-yyyy HH:mm:ss}'
                                : null,
                    type:
                        x.Type === 'Int32' ||
                            x.Type === 'Int16' ||
                            x.Type === 'Int64' ||
                            x.Type === 'Byte'
                            ? 'numeric'
                            : x.Type === 'Boolean'
                                ? 'boolean'
                                : x.Type === 'DateTime' || x.Type === 'Date'
                                    ? 'date'
                                    : null,
                    aggregates: from(PAggregates)
                        .where((a: any) => a.Name === x.Name)
                        .select((a: any) => a.Aggregates)
                        .toArray(),
                }
        );

        return gridColumns;
    }

    saveOrganisation(org: { Put: Organisation }) {
        localStorage.setItem('org', JSON.stringify(org.Put));
    }

    getOrganisation(): Organisation {
        return JSON.parse(localStorage.getItem('org'));
    }

    LogoURL(): string {
        return (
            environment.baseURL +
            'assets/images/branding/logos/' +
            this.getOrganisation().GUID +
            '.png'
        );
    }

    MainImageURL(): string {
        return (
            environment.baseURL +
            '/assets/images/branding/mainimage/' +
            this.getOrganisation().GUID +
            '.png'
        );
    }

    getTiles(cn: string): Con[] {
        var con = this.getController(cn);
        var cns: string[] = con.p.Tiles ? con.p.Tiles.split(',') : [];
        return from(cns)
            .select((x: string) => {
                return this.getController(x);
            })
            .toArray();
    }

    public getLocalStorage(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    public removeLocalStorage(key) {
        return localStorage.removeItem(key);
    }

    public setLocalStorage(key: any, data: any) {
        localStorage.setItem(key, JSON.stringify(data));
    }
}
