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
  keyMaster =
    'Basic a2lkX3JKdkRGbTg0dTozOTUyOGRkNDVkNGQ0OTFlYjdiZDFmOTVlYjJlZWI1Ng==';

  constructor() {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    request = request.clone({
      headers: request.headers.set('Authorization', this.keyMaster),
    });

    return next.handle(request);
  }
}
