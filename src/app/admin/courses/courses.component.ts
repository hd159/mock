import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CoursesService } from 'src/app/service/courses.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit, OnDestroy {
  courses: any[];
  selectedCourses: any[] = [];
  subscription: Subscription[] = [];
  constructor(
    private coursesService: CoursesService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {}
  ngOnInit(): void {
    const sub = this.coursesService.find().subscribe((val) => {
      console.log(val);
      this.courses = val;
    });
    this.subscription.push(sub);
  }

  ngOnDestroy() {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }

  // onSubmit() {
  //   const target = this.targetForm.value;
  //   const landing = this.landingPage.formLandingPage.value;
  //   const curriculum = this.curriculum.formCurriculum.value;

  //   const newCourses = {
  //     ...target,
  //     ...landing,
  //     ...curriculum,
  //     author: 'jane',
  //     rating: 0,
  //     price: 30,
  //   };

  //   this.coursesService.create(newCourses).subscribe((val) => console.log(val));
  // }

  createCourse() {
    this.router.navigateByUrl('admin/courses/add');
  }

  deleteCourse(course) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + course.title + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.courses = this.courses.filter((val) => val._id !== course._id);

        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Deleted',
          life: 3000,
        });
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

  editCourse(course) {}
}
