import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of, Subject } from 'rxjs';
import { finalize, switchMap, takeUntil, tap } from 'rxjs/operators';
import { CoursesService } from 'src/app/service/courses.service';

@Component({
  selector: 'app-goals-course',
  templateUrl: './goals-course.component.html',
  styleUrls: ['./goals-course.component.scss'],
})
export class GoalsCourseComponent implements OnInit, OnDestroy {
  targetForm: FormGroup;
  label_target = 'What will students learn in your course?';
  label_require = 'Are there any course requirements or prerequisites?';
  label_target_student = 'Who are your target students?';
  placeholder_target = 'Example: Low-light photography';
  placeholder_require = 'Example: Be able to read sheet music';
  placeholder_target_student = 'Example: Beginner Python developers';
  idcourse: string;
  loading: boolean;
  unsubscription = new Subject();
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private coursesService: CoursesService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.targetForm = this.initForm();
    // const valueCourse = this.coursesService.newCourseData;
    // this.targetForm.patchValue({ ...valueCourse });

    this.route.params
      .pipe(
        tap(() => (this.loading = true)),
        switchMap(({ id }) => {
          if (id) {
            this.idcourse = id;
            return this.coursesService.findById(id);
          } else {
            return of(null);
          }
        }),

        takeUntil(this.unsubscription)
      )
      .subscribe((val) => {
        this.loading = false;
        if (val) {
          const requires = this.targetForm.get('require') as FormArray;
          const goals = this.targetForm.get('goal') as FormArray;
          const targets = this.targetForm.get('target_student') as FormArray;
          requires.clear();
          goals.clear();
          targets.clear();

          val.require.forEach((item) => {
            requires.push(this.fb.group({ content: '' }));
          });

          val.goal.forEach((item) => {
            goals.push(this.fb.group({ content: '' }));
          });

          val.target_student.forEach((item) => {
            targets.push(this.fb.group({ content: '' }));
          });

          this.targetForm.patchValue({ ...val });
        }
      });
  }

  ngOnDestroy() {
    this.unsubscription.next();
    this.unsubscription.unsubscribe();
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

  onSave() {
    console.log(this.targetForm.value);
  }

  prevPage() {
    if (this.idcourse) {
      this.router.navigate(['admin/courses/edit', this.idcourse, 'curriculum']);
    } else {
      this.router.navigate(['admin/courses/add/curriculum']);
    }
  }
}
