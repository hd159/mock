import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  Subject,
  Subscription,
} from 'rxjs';
import { render } from 'creditcardpayments/creditCardPayments';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from 'src/app/service/courses.service';
import {
  map,
  mergeMap,
  shareReplay,
  switchAll,
  takeUntil,
} from 'rxjs/operators';
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
  showBtn: boolean = true;
  loading = false;
  unsubscription = new Subject();
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private coursesService: CoursesService,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
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
    this.showBtn = false;
    render({
      id: '#paypalbtn',
      currency: 'USD',
      value: this.totalPrice.toString(),
      onApprove: (detail) => {
        this.loading = true;
        this.userInfo$
          .pipe(
            mergeMap((user) => {
              const coursesId = this.coursesService.courseInCart.value.map(
                (item) => item._id
              );
              if (!user.learning) {
                user.learning = [];
              }

              const body = {
                ...user,
                learning: [...user.learning, ...coursesId],
              };

              const updateUser = this.authService.updateLearning(
                user._id,
                body
              );

              const updateStudents = this.coursesService.updateStudent();

              return combineLatest([updateUser, updateStudents]);
            }),
            takeUntil(this.unsubscription)
          )
          .subscribe((val) => {
            this.loading = false;
            this.messageService.add({
              severity: 'success',
              detail: 'Payment success',
            });

            this.coursesService.resetCourseInCart();
            // this.router.navigateByUrl('/category/learning');
          });
      },
    });
  }
}
