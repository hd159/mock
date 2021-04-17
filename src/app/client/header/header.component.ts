import { Router } from '@angular/router';
import { LoginComponent } from './../../login/login.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CoursesService } from 'src/app/service/courses.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';
import { PreviousRouteService } from 'src/app/service/previous-route.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  searchForm: FormGroup;
  isLogin = false;
  itemInCart$: Observable<number>;

  items = [
    {
      icon: 'pi pi-bell',
    },
    {
      icon: 'pi pi-shopping-cart',
      styleClass: 'cart',
      escape: false,
      routerLink: ['/cart'],
    },
    {
      icon: 'pi pi-user',
      items: [
        {
          label: 'My account',
          routerLink: ['/user-info'],
        },
        { label: 'My learning', routerLink: ['/category/learning'] },
        { label: 'My cart', routerLink: ['/cart'] },
        {
          label: 'Log out',
          command: () => this.logoutUser(),
        },
      ],
    },
  ];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private coursesService: CoursesService,
    private authService: AuthService,
    private previousRouteService: PreviousRouteService
  ) {
    this.searchForm = this.fb.group({
      search: [''],
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('logged') == 'true') this.isLogin = true;
    this.itemInCart$ = this.coursesService.courseInCart
      .asObservable()
      .pipe(map((val) => val.length));
  }

  logoutUser() {
    this.isLogin = false;
    this.authService.logout();
    this.router.navigateByUrl('/');
    this.previousRouteService.setPrevRoute(null);
  }
}
