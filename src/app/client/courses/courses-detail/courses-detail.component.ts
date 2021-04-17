import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Accordion } from 'primeng/accordion';
import { combineLatest, Observable, pipe, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { CoursesService } from 'src/app/service/courses.service';

@Component({
  selector: 'app-courses-detail',
  templateUrl: './courses-detail.component.html',
  styleUrls: ['./courses-detail.component.scss'],
})
export class CoursesDetailComponent implements OnInit, OnDestroy {
  course: any;
  fakecourse: any;
  displayBasic = false;
  showmore = false;
  unsubscription = new Subject();
  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap(({ id }) => {
          const course = this.coursesService.findById(id);
          return combineLatest([course, this.coursesService.courseInCart]);
        }),

        takeUntil(this.unsubscription)
      )
      .subscribe(
        ([course, courseInCart]: any[]) => {
          this.course = { ...course, incart: false };
          if (courseInCart.find((item) => item._id === course._id)) {
            this.course['incart'] = true;
          }
          console.log(this.course);
        },
        (err) => console.log(err)
      );
  }

  ngOnDestroy() {
    this.unsubscription.next();
    this.unsubscription.unsubscribe();
  }

  showDialog() {
    this.displayBasic = true;
  }

  closeDialog() {
    this.displayBasic = false;
  }

  addToCart(course) {
    if (course.incart) {
      this.router.navigateByUrl('/cart');
    } else {
      course['incart'] = true;
      this.coursesService.setCourseInCart(course);
    }
  }

  expandAll(accor: Accordion) {
    const length = accor.tabList.length;
    let index = [];
    for (let i = 0; i < length; i++) {
      index.push(i);
    }
    accor.activeIndex = index.join(',');
  }
}
