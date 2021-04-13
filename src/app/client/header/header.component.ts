import { Router } from '@angular/router';
import { LoginComponent } from './../../login/login.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CoursesService } from 'src/app/service/courses.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  searchForm: FormGroup;
  isLogin = false;
  itemInCart$: Observable<number>;
  fake = [
    {
      author: 'Jose',
      img:
        'https://img-b.udemycdn.com/course/240x135/567828_67d0.jpg?secure=Ti496XEQnWw0vPWBnM6ULQ%3D%3D%2C1616880506',
      inCart: true,
      price: 12.99,
      rating: 4,
      title: '2021 Complete Python Bootcamp From Zero to Hero in Python',
      _id: '605eed4c61476500147198fe',
    },
    {
      author: 'Jose',
      img:
        'https://img-b.udemycdn.com/course/240x135/567828_67d0.jpg?secure=Ti496XEQnWw0vPWBnM6ULQ%3D%3D%2C1616880506',
      inCart: true,
      price: 12.99,
      rating: 4,
      title: '2021 Complete Python Bootcamp From Zero to Hero in Python',
      _id: '605eed4c61476500147198fe',
    },
  ];
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
    private coursesService: CoursesService
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
    localStorage.setItem('logged', 'false');
    localStorage.setItem('typeUser', '');
    localStorage.removeItem('userInfo');
    this.isLogin = false;
    this.router.navigateByUrl('/');
  }
}
