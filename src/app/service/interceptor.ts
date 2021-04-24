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
  kinveyAppKey = 'kid_SJ6y1x-vu';
  kinveyAppSecret = 'ef15c351bd2641049532bedac9b64dc0';
  keyMaster =
    'Basic a2lkX1NKNnkxeC12dTo2NDA5MDk4NmNhNmQ0YTdhYmJlNjNmNmRlOWNmNDdlMA==';

  keyRegister = 'Basic ' + btoa(this.kinveyAppKey + ':' + this.kinveyAppSecret);
  constructor() {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url.includes('/user') && request.method === 'POST') {
      request = request.clone({
        headers: request.headers.set('Authorization', this.keyRegister),
      });
    } else {
      request = request.clone({
        headers: request.headers.set('Authorization', this.keyMaster),
      });
    }

    return next.handle(request);
  }
}
