import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { render } from 'creditcardpayments/creditCardPayments';
import { ActivatedRoute } from '@angular/router';
import { CoursesService } from 'src/app/service/courses.service';
import { map, mergeMap, shareReplay, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-courses-payment',
  templateUrl: './courses-payment.component.html',
  styleUrls: ['./courses-payment.component.scss'],
})
export class CoursesPaymentComponent implements OnInit, OnDestroy {
  selectedCountry;
  filteredCountries;

  courses: any[];

  originalPrice: number;
  totalPrice: number;
  discountPrice = 0;
  selectedCity;
  paymentMethod = 'paypal';
  userInfo$: Observable<any>;
  unsubscription = new Subject();
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private coursesService: CoursesService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.http
      .get('/assets/countries.json')
      .pipe(takeUntil(this.unsubscription))

      .subscribe((val: any) => {
        this.filteredCountries = val.data;
      });

    this.coursesService.courseInCart
      .pipe(takeUntil(this.unsubscription))
      .subscribe((courses) => {
        this.courses = courses;
        this.originalPrice = courses.reduce(
          (value, item) => value + parseFloat(item.price),
          0
        );
        this.totalPrice = this.originalPrice - this.discountPrice;
      });

    this.userInfo$ = this.authService.userDetail$;
  }

  ngOnDestroy() {
    this.unsubscription.next();
    this.unsubscription.unsubscribe();
  }

  onPayment() {
    render({
      id: '#paypalbtn',
      currency: 'USD',
      value: this.totalPrice.toString(),
      onApprove: (detail) => {
        this.userInfo$
          .pipe(
            mergeMap((user) => {
              const courses = this.coursesService.courseInCart.value.map(
                (item) => item._id
              );
              if (!user.learning) {
                user.learning = [];
              }

              const body = {
                ...user,
                learning: [...user.learning, ...courses],
              };

              return this.authService.updateLearning(user._id, body);
            }),
            takeUntil(this.unsubscription)
          )
          .subscribe((val) => {
            this.messageService.add({
              severity: 'success',
              detail: 'Payment success',
            });

            this.coursesService.resetCourseInCart();
          });
      },
    });
  }
}
