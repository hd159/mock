import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { combineLatest, from, Observable, Subject } from 'rxjs';
import { finalize, mergeMap, take, takeUntil, toArray } from 'rxjs/operators';
import { LoadingProgressService } from 'src/app/loading-progress/loading-progress.service';
import { AuthService } from 'src/app/service/auth.service';
import { CoursesService } from 'src/app/service/courses.service';
import { FalconMessageService } from 'src/app/service/falcon-message.service';
import { User } from 'src/app/store';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [FalconMessageService],
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
    private confirmationService: ConfirmationService,
    private loadingService: LoadingProgressService,
    private coursesService: CoursesService,
    private messageService: FalconMessageService
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
          id: currentUser._id,
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
          this.messageService.showSuccess(
            'Th??nh c??ng',
            '???? c???p nh???t ng?????i d??ng'
          );
          this.getUser();
          this.hideDialog();
        },
        (err) => {
          this.loadingService.hideLoading();
          this.messageService.showError('Th???t b???i', '???? c?? l???i x???y ra');
        }
      );
  }

  registerUser() {
    const { username, password } = this.userForm;
    const body = {
      username,
      password,
    };
    this.loadingService.showLoading();

    this.authService
      .createUserWithRole(body, this.userForm.role)
      .pipe(
        finalize(() => this.loadingService.hideLoading()),
        takeUntil(this.unsubscription$)
      )
      .subscribe(
        (val) => {
          this.messageService.showSuccess(
            'Th??nh c??ng',
            '???? th??m ng?????i d??ng m???i'
          );

          this.getUser();
          this.hideDialog();
        },
        (err) => {
          this.messageService.showError('Th???t b???i', '???? c?? l???i x???y ra');
        }
      );
  }

  editUser(user) {
    if (
      user.priority >= this.userAccess.priority &&
      this.userAccess.role !== 'admin'
    ) {
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
    if (
      user.priority >= this.userAccess.priority &&
      this.userAccess.role !== 'admin'
    ) {
      return;
    }

    this.confirmationService.confirm({
      message: 'B???n c?? mu???n x??a ' + user.username + '?',
      header: 'X??c nh???n',
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
            this.messageService.showSuccess(
              'Th??nh c??ng',
              'Ng?????i d??ng ???? b??? x??a'
            );

            this.getUser();
          });
      },
      reject: () => {
        this.messageService.showError('H???y b???', 'B???n ???? h???y b???');
      },
    });
  }

  deleteSelectedUsers() {
    this.confirmationService.confirm({
      message: ' B???n c?? mu???n x??a c??c ng?????i d??ng ???? ch???n?',
      header: 'X??c nh???n',
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
              this.messageService.showSuccess(
                'Th??nh c??ng',
                'Ng?????i d??ng ???? b??? x??a'
              );
              this.getUser();
            },
            (err) => {
              this.messageService.showError('L???i', '???? c?? l???i x???y ra');
            }
          );
      },
      reject: () => {
        this.messageService.showError('H???y b???', 'B???n ???? h???y b???');
      },
    });
  }
}
