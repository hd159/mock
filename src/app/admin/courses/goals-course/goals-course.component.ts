import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CoursesService } from 'src/app/service/courses.service';

@Component({
  selector: 'app-goals-course',
  templateUrl: './goals-course.component.html',
  styleUrls: ['./goals-course.component.scss'],
})
export class GoalsCourseComponent implements OnInit {
  targetForm: FormGroup;
  label_target = 'What will students learn in your course?';
  label_require = 'Are there any course requirements or prerequisites?';
  label_target_student = 'Who are your target students?';
  placeholder_target = 'Example: Low-light photography';
  placeholder_require = 'Example: Be able to read sheet music';
  placeholder_target_student = 'Example: Beginner Python developers';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private coursesService: CoursesService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.targetForm = this.initForm();
    const valueCourse = this.coursesService.newCourseData;
    this.targetForm.patchValue({ ...valueCourse });
  }

  initForm() {
    return this.fb.group({
      goal: this.fb.array([this.fb.group({ content: '' })]),
      require: this.fb.array([this.fb.group({ content: '' })]),
      target_student: this.fb.array([this.fb.group({ content: '' })]),
    });
  }

  onSubmit() {
    const goalsData = this.targetForm.value;
    this.coursesService.newCourse.next({
      ...this.coursesService.newCourseData,
      ...goalsData,
    });

    console.log(this.coursesService.newCourseData);
    this.coursesService
      .create(this.coursesService.newCourseData)
      .subscribe((val) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Course Added',
        });
        this.coursesService.newCourse.next(null);
      });
  }

  prevPage() {
    this.router.navigate(['admin/courses/add/curriculum']);
  }

  nextPage() {
    const goalsData = this.targetForm.value;
    this.coursesService.newCourse.next({
      ...this.coursesService.newCourseData,
      ...goalsData,
    });
  }
}
