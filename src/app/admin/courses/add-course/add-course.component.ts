import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss'],
})
export class AddCourseComponent implements OnInit {
  items: MenuItem[];
  constructor() {}

  ngOnInit(): void {
    this.items = [
      {
        label: 'Landing Page',
        routerLink: 'landing-page',
      },
      {
        label: 'Curriculum',
        routerLink: 'curriculum',
      },
      {
        label: 'Target your student',
        routerLink: 'goals',
      },
    ];
  }
}
