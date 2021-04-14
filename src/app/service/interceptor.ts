import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { delay, finalize, tap, timeout } from 'rxjs/operators';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  kinveyAppKey = 'kid_rJvDFm84u';
  kinveyAppSecret = 'a3c84d5e164d416ba042ee073fa826e6';
  keyMaster =
    'Basic a2lkX3JKdkRGbTg0dTozOTUyOGRkNDVkNGQ0OTFlYjdiZDFmOTVlYjJlZWI1Ng==';

  keyRegister = 'Basic ' + btoa(this.kinveyAppKey + ':' + this.kinveyAppSecret);
  constructor() {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url.includes('/user') && request.method !== 'GET') {
      request = request.clone({
        headers: request.headers.set('Authorization', this.keyMaster),
      });
    } else {
      request = request.clone({
        headers: request.headers.set('Authorization', this.keyMaster),
      });
    }

    return next.handle(request);
  }
}
