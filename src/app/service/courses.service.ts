import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
  constructor(http: HttpClient) {
    super(initalCoursesState, 'courses', http);
    this.newCourse = new BehaviorSubject(null);
    this.courseInCart = new BehaviorSubject([]);
  }

  get newCourseData() {
    return this.newCourse.value;
  }
}
