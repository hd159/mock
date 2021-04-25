import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';
import { CoursesService } from 'src/app/service/courses.service';

@Component({
  selector: 'app-user',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnInit, OnDestroy {
  formUserInfo: FormGroup;
  userInfo: any;
  loading = false;
  placeholderHeadline = "'Engineer at Udemy' or 'Architect'";
  defaultimg =
    'https://img-a.udemycdn.com/user/200_H/anonymous_3.png?UhdYXfkYuB40LR8CfMP0jhmy4Vo_Hirzh88TKirvqnx8CpeHBrtMk4DjRYW5o0WMrmuXJUeljBCYiCtnnqaUxkq0hPFgHT5UyWiIYk289z9UunDgtnONxKI';
  constructor(
    private userService: AuthService,
    private fb: FormBuilder,
    private coursesService: CoursesService,
    private messageService: MessageService
  ) {}
  languages: any[];
  unsubscription$ = new Subject();
  ngOnInit(): void {
    this.formUserInfo = this.initFormUser();
    this.loading = true;
    this.coursesService
      .getCountries()
      .pipe(takeUntil(this.unsubscription$))
      .subscribe((val) => (this.languages = val));

    const userId = JSON.parse(localStorage.getItem('userInfo'));

    this.userService
      .getUser(userId)
      .pipe(
        finalize(() => (this.loading = false)),
        takeUntil(this.unsubscription$)
      )
      .subscribe(
        (val) => {
          this.formUserInfo.patchValue({ ...val });
          this.userInfo = val;
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

  ngOnDestroy() {
    this.unsubscription$.next();
    this.unsubscription$.unsubscribe();
  }

  initFormUser(): FormGroup {
    return this.fb.group({
      firstName: [''],
      lastName: [''],
      headline: [''],
      language: [null],
      biography: [''],
      img: [this.defaultimg],
      social: this.fb.group({
        website: [''],
        twitter: [''],
        facebook: [''],
        youtube: [''],
      }),
    });
  }

  get formSocial() {
    return this.formUserInfo.get('social');
  }

  onSubmit() {
    const newValueUser = { ...this.userInfo, ...this.formUserInfo.value };

    this.loading = true;
    this.userService
      .updateUser(this.userInfo._id, newValueUser)
      .pipe(
        finalize(() => (this.loading = false)),
        takeUntil(this.unsubscription$)
      )
      .subscribe(
        (val) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Update successed',
          });
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
