import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, mergeMap, switchAll } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { CollectionService } from './collection.service';

const initalCoursesState = {};
interface Course {
  landingPageData: any;
  curriculumData: any;
  goalsData: any;
}
@Injectable({
  providedIn: 'root',
})
export class CoursesService extends CollectionService<any> {
  newCourse: BehaviorSubject<any>;
  courseInCart: BehaviorSubject<any[]>;
  constructor(http: HttpClient, private authService: AuthService) {
    super(initalCoursesState, 'courses', http);
    this.newCourse = new BehaviorSubject(null);

    this.getCoursesLocal();
  }

  get newCourseData() {
    return this.newCourse.value;
  }

  getCoursesLocal() {
    const cartItem =
      JSON.parse(
        localStorage.getItem(`courseInCart${this.authService.userInfo.value}`)
      ) || [];
    this.courseInCart = new BehaviorSubject(cartItem);
  }

  setCourseInCart(course) {
    const itemInCart = this.courseInCart.value;
    itemInCart.push(course);
    this.courseInCart.next(itemInCart);

    localStorage.setItem(
      `courseInCart${this.authService.userInfo.value}`,
      JSON.stringify(itemInCart)
    );
  }

  removeCourseInCart(course) {
    const value = this.courseInCart.value;
    const newValue = value.filter((item) => item._id !== course._id);
    this.courseInCart.next(newValue);
    localStorage.setItem(
      `courseInCart${this.authService.userInfo.value}`,
      JSON.stringify(newValue)
    );
  }

  resetCourseInCart() {
    this.courseInCart.next([]);
    localStorage.setItem(
      `courseInCart${this.authService.userInfo.value}`,
      JSON.stringify([])
    );
  }

  updateStudent() {
    return this.courseInCart.pipe(
      switchAll(),
      mergeMap((course) => {
        const courseUpdate = { ...course, student: course.student + 1 };
        return this.update(courseUpdate, course._id);
      })
    );
  }
}
