import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CoursesService } from 'src/app/service/courses.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit, OnDestroy {
  courses: any[];
  selectedCourses: any[] = [];
  loading: boolean;
  unscription$ = new Subject();
  constructor(
    private coursesService: CoursesService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {}
  ngOnInit(): void {
    const params = new HttpParams().set(
      'fields',
      'title,img,price,category,rating'
    );
    this.coursesService
      .find(params)
      .pipe(takeUntil(this.unscription$))
      .subscribe((val) => {
        console.log(val);
        this.courses = val;
      });
  }

  ngOnDestroy() {
    this.unscription$.next();
    this.unscription$.unsubscribe();
  }

  createCourse() {
    this.router.navigateByUrl('admin/courses/add');
  }

  deleteCourse(course) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + course.title + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;
        this.coursesService.removeById(course._id).subscribe(
          (val) => {
            this.loading = false;
            this.courses = this.courses.filter((val) => val._id !== course._id);

            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Product Deleted',
              life: 3000,
            });
          },
          (err) => console.log(err)
        );
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
          life: 3000,
        });
      },
    });
  }

  editCourse(course) {
    this.router.navigate(['admin/courses/edit', course._id, 'landing-page']);
  }
}
