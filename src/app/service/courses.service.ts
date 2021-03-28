import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CollectionService } from './collection.service';

const initalCoursesState = {}

@Injectable({
  providedIn: 'root'
})
export class CoursesService extends CollectionService<any>{

  constructor(http: HttpClient) {
    super(initalCoursesState, 'courses', http);
  }

}
