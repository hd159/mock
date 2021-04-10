import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CoursesService } from 'src/app/service/courses.service';

@Component({
  selector: 'app-courses-landingpage',
  templateUrl: './courses-landingpage.component.html',
  styleUrls: ['./courses-landingpage.component.scss'],
})
export class CoursesLandingpageComponent implements OnInit {
  formLandingPage: FormGroup;
  cities: any[];
  levels: any[];
  categories: any[];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private coursesService: CoursesService
  ) {}

  ngOnInit(): void {
    this.formLandingPage = this.initForm();
    const valueCourse = this.coursesService.newCourseData;
    this.formLandingPage.patchValue({ ...valueCourse });

    this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' },
    ];
    this.levels = [
      { name: 'Beginner', value: 'Beginner' },
      { name: 'Intermediate', value: 'Intermediate' },
      { name: 'Expert', value: 'Expert' },
      { name: 'All level', value: 'All level' },
    ];
    this.categories = [{ name: 'Development', value: 'dev' }];
  }

  initForm() {
    return this.fb.group({
      title: '',
      subtitle: '',
      html: '',
      selectedCity: '',
      selectedLevel: '',
      selectedCategory: '',
      img: '',
      preview_video: '',
      price: '',
    });
  }

  onSubmit() {
    console.log(this.formLandingPage.value);
  }

  nextPage() {
    const landingPageData = this.formLandingPage.value;
    this.coursesService.newCourse.next({
      ...this.coursesService.newCourseData,
      ...landingPageData,
    });
    this.router.navigate(['admin/courses/add/curriculum']);
  }
}
