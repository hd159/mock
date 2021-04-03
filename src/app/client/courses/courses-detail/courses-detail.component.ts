import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, pipe } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { CoursesService } from 'src/app/service/courses.service';

@Component({
  selector: 'app-courses-detail',
  templateUrl: './courses-detail.component.html',
  styleUrls: ['./courses-detail.component.scss'],
})
export class CoursesDetailComponent implements OnInit {
  course$: Observable<any>;
  fakecourse: any;
  displayBasic = false;
  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.course$ = this.route.params.pipe(
      switchMap(({ id }) => this.coursesService.findById(id))
    );

    this.http.get('/assets/fakedata.json').subscribe((val) => {
      this.fakecourse = val;
    });
  }

  showBasicDialog() {
    this.displayBasic = true;
  }
}
