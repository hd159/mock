import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { combineLatest, from, Observable, Subject } from 'rxjs';
import { finalize, mergeMap, take, takeUntil, toArray } from 'rxjs/operators';
import { LoadingProgressService } from 'src/app/loading-progress/loading-progress.service';
import { AuthService } from 'src/app/service/auth.service';
import { CoursesService } from 'src/app/service/courses.service';
import { User } from 'src/app/store';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, OnDestroy {
  userLists: User[];

  roles = [
    { name: 'Admin', value: 'admin' },
    { name: 'User', value: 'user' },
  ];
  selectedUsers: any[];
  userDialog: boolean;
  userDetailDialog: boolean;
  userDetail: any;
  showModal = false;
  userForm: any;
  totalPrice: number;
  unsubscription$ = new Subject();
  submitted: boolean;
  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private loadingService: LoadingProgressService,
    private coursesService: CoursesService
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  ngOnDestroy() {
    this.unsubscription$.next();
    this.unsubscription$.unsubscribe();
  }

  getUser() {
    this.authService
      .getAllUser()
      .pipe(takeUntil(this.unsubscription$))
      .subscribe((val) => {
        console.log(val);
        this.userLists = val;
      });
  }

  createUser() {
    this.userDialog = true;
    this.userForm = {};
    this.submitted = false;
  }

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
    this.userForm = {};
  }

  saveUser() {
    const { username, password } = this.userForm;
    this.loadingService.showLoading();
    if (this.userForm.role === 'admin') {
      this.authService
        .createAdminRole({ username, password })
        .pipe(
          finalize(() => this.loadingService.hideLoading()),
          takeUntil(this.unsubscription$)
        )
        .subscribe(
          (val) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'User added',
            });
            this.getUser();
            this.hideDialog();
          },
          (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: "Some thing wen't wrong",
            });
          }
        );
    } else {
      this.authService
        .registerUser({ username, password })
        .pipe(
          finalize(() => this.loadingService.hideLoading()),
          takeUntil(this.unsubscription$)
        )
        .subscribe(
          (val) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'User added',
            });
            this.getUser();
            this.hideDialog();
          },
          (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: "Some thing wen't wrong",
            });
          }
        );
    }
  }

  editUser(user) {
    this.userForm = { ...user };
    this.userDialog = true;
  }

  viewDetail(user) {
    this.totalPrice = 0;
    if (user.learning && user.learning.length > 0) {
      this.loadingService.showLoading();
      this.getCourseUserHasBuy(user.learning)
        .pipe(
          finalize(() => this.loadingService.hideLoading()),
          takeUntil(this.unsubscription$)
        )
        .subscribe((val) => {
          this.userDetailDialog = true;
          this.totalPrice = val.reduce((val, item) => val + item.price, 0);
          this.userDetail = {
            ...user,
            courses: [...val],
          };
        });
    } else {
      this.userDetailDialog = true;

      this.userDetail = {
        ...user,
        courses: [],
      };
    }
  }

  getCourseUserHasBuy(courseIds: string[]): Observable<any[]> {
    const params = new HttpParams().set('fields', 'title,price,img');
    return from(courseIds).pipe(
      mergeMap((id) => this.coursesService.findById(id, params)),
      toArray()
    );
  }

  deleteUser(user: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + user.username + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loadingService.showLoading();
        this.authService
          .deleteUser(user._id)
          .pipe(
            finalize(() => this.loadingService.hideLoading()),
            takeUntil(this.unsubscription$)
          )
          .subscribe((val) => {
            this.userForm = {};
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'User Deleted',
              life: 3000,
            });
            this.getUser();
          });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
        });
      },
    });
  }

  deleteSelectedUsers() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected users?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loadingService.showLoading();
        const deletemutiple = this.selectedUsers
          .map((user) => user._id)
          .map((id) => this.authService.deleteUser(id));
        combineLatest(deletemutiple)
          .pipe(
            finalize(() => this.loadingService.hideLoading()),
            takeUntil(this.unsubscription$)
          )
          .subscribe(
            (val) => {
              this.selectedUsers = null;
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Users Deleted',
                life: 3000,
              });
              this.getUser();
            },
            (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: "Some thing wen't wrong",
              });
            }
          );
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
        });
      },
    });
  }
}
