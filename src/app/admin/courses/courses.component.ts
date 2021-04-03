import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CoursesService } from 'src/app/service/courses.service';
import { CoursesCurriculumComponent } from './courses-curriculum/courses-curriculum.component';
import { CoursesLandingpageComponent } from './courses-landingpage/courses-landingpage.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit {
  targetForm: FormGroup;
  label_target = 'What will students learn in your course?';
  label_require = 'Are there any course requirements or prerequisites?';
  label_target_student = 'Who are your target students?';
  placeholder_target = 'Example: Low-light photography';
  placeholder_require = 'Example: Be able to read sheet music';
  placeholder_target_student = 'Example: Beginner Python developers';
  constructor(
    private fb: FormBuilder,
    private coursesService: CoursesService
  ) {}

  @ViewChild('landing') landingPage: CoursesLandingpageComponent;
  @ViewChild('curriculum') curriculum: CoursesCurriculumComponent;
  ngOnInit(): void {
    this.targetForm = this.initForm();
  }

  initForm() {
    return this.fb.group({
      goal: this.fb.array([this.fb.group({ content: '' })]),
      require: this.fb.array([this.fb.group({ content: '' })]),
      target_student: this.fb.array([this.fb.group({ content: '' })]),
    });
  }

  onSubmit() {
    const target = this.targetForm.value;
    const landing = this.landingPage.formLandingPage.value;
    const curriculum = this.curriculum.formCurriculum.value;

    const newCourses = {
      ...target,
      ...landing,
      ...curriculum,
      author: 'jane',
      rating: 0,
      price: 30,
    };

    this.coursesService.create(newCourses).subscribe((val) => console.log(val));
  }
}
