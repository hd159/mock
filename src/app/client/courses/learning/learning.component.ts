import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { from, of, Subscription } from 'rxjs';
import { mergeMap, switchAll, tap, toArray } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';
import { CoursesService } from 'src/app/service/courses.service';

@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.scss'],
})
export class LearningComponent implements OnInit, OnDestroy {
  sortCategoriesOptions: any[];
  authorOptions: any[] = [];
  courses: any[];
  valueProgress = 20;
  listCourses: string[];

  subscription: Subscription[] = [];
  constructor(
    private coursesService: CoursesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.sortCategoriesOptions = [
      { label: 'Development', value: 'development' },
      { label: 'Business', value: 'business' },
      { label: 'IT & Software', value: 'it-software' },
      { label: 'Design', value: 'design' },
    ];

    const id = this.authService.userInfo;

    const sub = this.authService
      .getUserLearning(id)
      .pipe(
        tap(console.log),
        switchAll(),
        mergeMap((id: string) => {
          return this.coursesService.findById(id);
        }),
        toArray()
      )
      .subscribe((val) => {
        this.courses = val;
        val.forEach((item: any) => {
          const { author } = item;
          if (!this.authorOptions.includes(author)) {
            this.authorOptions.push(author);
          }
        });
        this.authorOptions = this.authorOptions.map((item) => ({
          label: item,
          value: item,
        }));
      });

    this.subscription.push(sub);
  }

  ngOnDestroy() {
    this.subscription.forEach((item) => item.unsubscribe());
  }
}
