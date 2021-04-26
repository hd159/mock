import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, mergeMap, pluck, switchAll } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { CollectionService } from './collection.service';

const initalPaymentState = {};

@Injectable({
  providedIn: 'root',
})
export class PaymentService extends CollectionService<any> {
  constructor(
    http: HttpClient,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    super(initalPaymentState, 'infopayment', http);
  }

  createPayment(body) {
    return this.http.post(this.url, body);
  }
}
