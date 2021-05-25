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
  ) { }
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
      message: 'Bạn có muốn xóa ' + course.title + '?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;
        this.coursesService.removeById(course._id).subscribe(
          (val) => {
            this.loading = false;
            this.courses = this.courses.filter((val) => val._id !== course._id);

            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Khóa học đã bị xóa',
              life: 3000,
            });
          },
          (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Thất bại',
              detail: 'Đã có lỗi xảy ra',
              life: 3000,
            });
          }
        );
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Hủy bỏ',
          detail: 'Bạn đã hủy bỏ',
          life: 3000,
        });
      },
    });
  }

  editCourse(course) {
    this.router.navigate(['admin/courses/edit', course._id, 'landing-page']);
  }
}
