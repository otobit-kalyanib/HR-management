import {
    HttpEvent,
    HttpHandler,
    HttpHeaders,
    HttpInterceptor,
    HttpRequest
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, from } from "rxjs";

import { Router } from "@angular/router";
import { UnauthorizedResponse } from "@teamin/models/common/unauthorized-response";
import { APIService } from "./api.service";

@Injectable()
export class APIInterceptor implements HttpInterceptor {
    cachedRequest: Promise<any>;

    constructor(private _APIService: APIService, private _router: Router) { }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return from(this.addBearerToken(request, next));
    }

    private async addBearerToken(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Promise<HttpEvent<any>> {
        const _auth = await this._APIService.getAuthorization();

        const headerSettings = request.headers.keys().reduce((acc, cur) => {
            acc[cur] = request.headers.getAll(cur);
            return acc;
        }, {});

        if (_auth) {
            headerSettings["Authorization"] = `Bearer ${_auth.access_token}`;
        }

        const headers = new HttpHeaders(headerSettings),
            newRequest = request.clone({ headers });
        const result = next.handle(newRequest).toPromise();

        return result.catch(async (err) => {
            console.log("Caught error:", err);
            // if (err.status === 0) {
            //     this._router.navigateByUrl("/");
            // }
            if (err.status === 401 || err.status === 0) {
                let responseContent: UnauthorizedResponse = err.error;
                if (
                    responseContent.error == "token_expired" ||
                    responseContent.error == "Unknown Error"
                ) {
                    if (!this.cachedRequest) {
                        this.cachedRequest = this._APIService
                            .getRefreshToken()
                            .toPromise()
                            .catch((e) => {
                                if (e.status === 401) {
                                    if (
                                        e.error &&
                                        e.error.error == "invalid_grant"
                                    ) {
                                        if (e.error.error == "invalid_grant") {
                                            this._router.navigateByUrl("/");
                                        }
                                    }
                                }
                            });
                    }
                    const newAuth = await this.cachedRequest;
                    if (newAuth) {
                        localStorage.setItem("auth", JSON.stringify(newAuth));
                    } else {
                        this._APIService.clearLocalStorage();
                        this._router.navigateByUrl("/");
                    }
                    this.cachedRequest = null;
                    headerSettings[
                        "Authorization"
                    ] = `Bearer ${newAuth.access_token}`;

                    const updatedHeaders = new HttpHeaders(headerSettings),
                        updatedRequest = request.clone({
                            headers: updatedHeaders,
                        });

                    return next
                        .handle(updatedRequest)
                        .toPromise()
                        .then((data) => {
                            return data;
                        });
                } else {
                    this._router.navigateByUrl("/");
                }
            } else if (err.status === 401) {
                if (err.error) {
                    if (err.error.error == "invalid_grant") {
                        this._router.navigateByUrl("/");
                    } else {
                        return result.catch();
                    }
                } else {
                    return result.catch();
                }
            } else {
                return result.catch();
            }
        });
    }
}
