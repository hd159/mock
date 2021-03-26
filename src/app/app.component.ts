import { Component, OnDestroy } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { mergeMap } from 'rxjs/operators';

import { AuthService } from './service/auth.service';
import { CategoryService } from './service/category.service';
import { LessonService } from './service/lesson.service';
import { LoadingService } from './service/loading.service';

import { Store } from './store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  constructor(
    private authService: AuthService,
    private category: CategoryService
  ) {
    this.authService.setUser().subscribe();
    // this.category.push();
    // this.category.getGroup('').subscribe((val) => console.log(val));
  }

  ngOnDestroy() {}
}
