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
import { PaymentService } from 'src/app/service/payment.service';
import { MessageService } from 'primeng/api';
import { LoadingProgressService } from 'src/app/loading-progress/loading-progress.service';

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
    private router: Router,
    private loadingService: LoadingProgressService,
    private paymentService: PaymentService
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
      value: this.totalPrice.toFixed(2),
      onApprove: (detail) => {
        console.log(detail);

        this.loadingService.showLoading();
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

              const bodyPayment = {
                user: { ...user },
                ...detail,
                courses: [...this.coursesService.courseInCart.value],
              };

              const updateUser = this.authService.updateUser(user._id, body);

              const updateStudents = this.coursesService.updateStudent();

              const paymentInfo = this.paymentService.createPayment(
                bodyPayment
              );

              return combineLatest([updateUser, updateStudents, paymentInfo]);
            }),
            takeUntil(this.unsubscription)
          )
          .subscribe((val) => {
            this.loadingService.hideLoading();
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

  createPayment(userid, paymentInfo) {
    const body = {
      userid,
    };
  }
}
