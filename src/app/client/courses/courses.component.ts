import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { DataView } from 'primeng/dataview';
import { combineLatest, Observable, of, Subject, Subscription } from 'rxjs';
import { map, mergeMap, takeUntil, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';
import { CoursesService } from 'src/app/service/courses.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit, OnDestroy {
  displayBasic = false;
  currentIndex: number;
  courses: any[] = [];

  sortPriceOptions: any[];
  sortCategoriesOptions: any[];
  sortOrder: number;
  sortField: string;
  displayDialog: boolean;
  currentUserId: any;
  userForm: FormGroup;
  loading: boolean;
  unsubscription = new Subject();
  constructor(
    private coursesService: CoursesService,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.userForm = this.initForm();
    this.sortPriceOptions = [
      { label: 'Giá thấp đến cao', value: 'price' },
      { label: 'Giá cao đến thấp', value: '!price' },
    ];

    this.sortCategoriesOptions = [
      { label: 'Development', value: 'dev' },
      { label: 'Business', value: 'business' },
      { label: 'Marketing', value: 'marketing' },
      { label: 'Design', value: 'design' },
    ];

    const courseInCart: Observable<
      any[]
    > = this.coursesService.courseInCart.asObservable();
    const totalCourses: Observable<any[]> = this.coursesService.find();

    const coursesHasBuy: Observable<any[]> = this.authService.userInfo.pipe(
      tap((id) => (this.currentUserId = id)),
      mergeMap((id) => {
        if (id) {
          return this.authService.getUserLearning(id);
        } else {
          return of([]);
        }
      })
    );

    combineLatest([totalCourses, courseInCart, coursesHasBuy])
      .pipe(
        map(([courses, courseIncart, coursesHasBuy]) => {
          let result = [...courses];

          if (coursesHasBuy && coursesHasBuy.length > 0) {
            result = result.filter((item) => !coursesHasBuy.includes(item._id));
          }

          result = result.map((course) => ({
            ...course,
            inCart: courseIncart.some((item) => item._id === course._id),
          }));

          return result;
        }),
        takeUntil(this.unsubscription)
      )
      .subscribe((val) => {
        this.courses = val;
        console.log(this.currentUserId);
      });
  }

  ngOnDestroy() {
    this.unsubscription.next();
    this.unsubscription.unsubscribe();
  }

  initForm() {
    return this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  showBasicDialog(index?) {
    this.currentIndex = index;
    this.displayBasic = true;
  }

  closeBasicDialog() {
    this.displayBasic = false;
  }

  onNavigate(id: string) {
    this.router.navigate(['category/courses', id]);
  }

  onSortChange(event) {
    let value = event.value;
    console.log(value);

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  addToCart(course) {
    if (!this.currentUserId && localStorage.getItem('logged') !== 'true') {
      this.displayDialog = true;
    } else {
      if (course.inCart) {
        this.router.navigateByUrl('/cart');
      } else {
        course.inCart = true;
        this.coursesService.setCourseInCart(course);
      }
    }
  }

  onLogin() {
    if (this.userForm.invalid) {
      return;
    }
    const { username, password } = this.userForm.value;
    this.loading = true;
    this.authService
      .login(username, password)
      .pipe(takeUntil(this.unsubscription))
      .subscribe((val) => {
        this.loading = false;
        this.displayDialog = false;
        localStorage.setItem('logged', 'true');
        this.authService.isLoginClient$.next(true);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Login success',
        });
      });
  }
}
