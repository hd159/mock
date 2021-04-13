import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { CoursesService } from 'src/app/service/courses.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  coursesInCart$: Observable<any[]>;
  totalPrice$: Observable<number>;
  constructor(private coursesService: CoursesService) {}

  ngOnInit(): void {
    this.coursesInCart$ = this.coursesService.courseInCart
      .asObservable()
      .pipe(shareReplay());

    this.totalPrice$ = this.coursesInCart$.pipe(
      map((val) =>
        val.reduce((total, item) => total + parseFloat(item.price), 0)
      )
    );
  }

  removeCourse(course) {
    this.coursesService.removeCourseInCart(course);
  }
}
