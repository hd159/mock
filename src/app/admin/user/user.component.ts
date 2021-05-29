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
  roles: any;
  selectedUsers: any[];
  userDialog: boolean;
  userDetailDialog: boolean;
  userDetail: any;
  showModal = false;
  userForm: any;
  totalPrice: number;
  unsubscription$ = new Subject();
  submitted: boolean;
  userAccess: any;
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
    const allUser$ = this.authService.getAllUser();
    const currentUser$ = this.authService.userDetail$;
    combineLatest([allUser$, currentUser$])
      .pipe(takeUntil(this.unsubscription$))
      .subscribe(([allUser, currentUser]) => {
        this.userLists = allUser;
        this.userAccess = {
          priority: currentUser.priority,
          role: currentUser.roleId[0],
        };

        this.roles = [
          { name: 'Admin', value: 'admin' },
          { name: 'User', value: 'user' },
          { name: 'Supporter', value: 'supporter' },
        ];

        if (currentUser.roleId[0] !== 'admin') {
          this.roles = this.roles.filter((item) => item.value !== 'admin');
        }
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
    if (this.userForm._id) {
      this.updateUser();
    } else {
      this.registerUser();
    }
  }

  updateUser() {
    this.loadingService.showLoading();
    const { _id, role, prevRole } = this.userForm;
    this.authService
      .updateRole(_id, role, prevRole)
      .pipe(takeUntil(this.unsubscription$))
      .subscribe(
        (val) => {
          this.loadingService.hideLoading();
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Đã cập nhật người dùng',
          });
          this.getUser();
          this.hideDialog();
        },
        (err) => {
          this.loadingService.hideLoading();
          this.messageService.add({
            severity: 'error',
            summary: 'Thất bại',
            detail: 'Đã có lỗi xảy ra',
          });
        }
      );
  }

  registerUser() {
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
              summary: 'Thành công',
              detail: 'Đã thêm người dùng mới',
            });
            this.getUser();
            this.hideDialog();
          },
          (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Thất bại',
              detail: 'Đã có lỗi xảy ra',
            });
          }
        );
    } else {
      this.authService
        .registerUserAdminPage({ username, password })
        .pipe(
          finalize(() => this.loadingService.hideLoading()),
          takeUntil(this.unsubscription$)
        )
        .subscribe(
          (val) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Đã thêm người dùng mới',
            });
            this.getUser();
            this.hideDialog();
          },
          (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Thất bại',
              detail: 'Đã có lỗi xảy ra',
            });
          }
        );
    }
  }

  editUser(user) {
    if (user.priority >= this.userAccess.priority) {
      return;
    }

    this.userForm = {
      ...user,
      role: user.roleId[user.roleId.length - 1],
      prevRole: user.roleId[0],
    };

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
    if (user.priority >= this.userAccess.priority) {
      return;
    }

    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa ' + user.username + '?',
      header: 'Xác nhận',
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
              summary: 'Thành công',
              detail: 'Người dùng đã bị xóa',
              life: 3000,
            });
            this.getUser();
          });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Hủy bỏ',
          detail: 'Bạn đã hủy bỏ',
        });
      },
    });
  }

  deleteSelectedUsers() {
    this.confirmationService.confirm({
      message: ' Bạn có muốn xóa các người dùng đã chọn?',
      header: 'Xác nhận',
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
                summary: 'Thành công',
                detail: 'Người dùng đã bị xóa',
                life: 3000,
              });
              this.getUser();
            },
            (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Đã có lỗi xảy ra',
              });
            }
          );
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Hủy bỏ',
          detail: 'Bạn đã hủy bỏ',
        });
      },
    });
  }
}
