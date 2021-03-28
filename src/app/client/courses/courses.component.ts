
import { Component, OnInit } from '@angular/core';
import { CoursesService } from 'src/app/service/courses.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit {

  courses: any
  constructor(private coursesService: CoursesService) { }

  ngOnInit(): void {
    this.coursesService.find().subscribe(val => {
      this.courses = val
    })
  }


}
