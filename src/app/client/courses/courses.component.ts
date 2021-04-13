import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { DataView } from 'primeng/dataview';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
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

  subscription: Subscription[] = [];
  constructor(
    private coursesService: CoursesService,
    private router: Router,
    private authService: AuthService
  ) {
    this.coursesService.courseInCart.subscribe((val) => console.log(val));
  }

  ngOnInit(): void {
    this.sortPriceOptions = [
      { label: 'Price High to Low', value: '!price' },
      { label: 'Price Low to High', value: 'price' },
    ];

    this.sortCategoriesOptions = [
      { label: 'Development', value: 'development' },
      { label: 'Business', value: 'business' },
      { label: 'IT & Software', value: 'it-software' },
      { label: 'Design', value: 'design' },
    ];

    const courseInCart: Observable<
      any[]
    > = this.coursesService.courseInCart.asObservable();
    const totalCourses: Observable<any[]> = this.coursesService.find();

    const coursesHasBuy: Observable<any[]> = this.authService.getUserLearning(
      this.authService.userInfo
    );

    const sub = combineLatest([totalCourses, courseInCart, coursesHasBuy])
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
        })
      )
      .subscribe((val) => {
        this.courses = val;
      });

    this.subscription.push(sub);
  }

  ngOnDestroy() {
    this.subscription.forEach((item) => item.unsubscribe());
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

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  addToCart(course) {
    if (course.inCart) {
      this.router.navigateByUrl('/cart');
    } else {
      const itemInCart = this.coursesService.courseInCart.value;
      itemInCart.push(course);
      this.coursesService.courseInCart.next(itemInCart);
      course.inCart = true;
    }
  }
}
