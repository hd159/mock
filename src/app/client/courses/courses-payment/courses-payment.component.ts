import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { render } from 'creditcardpayments/creditCardPayments';

@Component({
  selector: 'app-courses-payment',
  templateUrl: './courses-payment.component.html',
  styleUrls: ['./courses-payment.component.scss'],
})
export class CoursesPaymentComponent implements OnInit, OnDestroy {
  selectedCountry;
  filteredCountries;
  subscription: Subscription[] = [];
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const sub = this.http.get('/assets/countries.json').subscribe((val) => {
      this.filteredCountries = val;
    });
    this.subscription.push(sub);
  }

  ngOnDestroy() {
    this.subscription.forEach((item) => item.unsubscribe());
  }

  onPayment() {
    render({
      id: '#paypal',
      currency: 'USD',
      value: '20.0',
      onApprove: (detail) => {
        console.log(detail);

        alert('success');
      },
    });
  }
}
