import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, Subscription } from 'rxjs';
import {
  catchError,
  finalize,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { AuthService } from '../service/auth.service';
import { CheckPassWord } from '../shared/validators/check-password';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  formRegister: FormGroup;
  loading = false;
  submitted = false;
  unsubscription = new Subject();
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService,
    private checkPassword: CheckPassWord
  ) { }

  ngOnInit() {
    this.formRegister = this.formBuilder.group(
      {
        username: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: [
          '',
          Validators.compose([Validators.required, Validators.email]),
        ],
        password: [
          '',
          Validators.compose([Validators.required, Validators.minLength(6)]),
        ],
        confirmPassword: [
          '',
          Validators.compose([Validators.required, Validators.minLength(6)]),
        ],
      },
      {
        validators: this.checkPassword.validate,
      }
    );
  }

  ngOnDestroy() {
    this.unsubscription.next();
    this.unsubscription.unsubscribe();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.formRegister.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.formRegister.invalid && !this.formRegister.errors) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please input all fields',
      });

      return;
    }
    if (this.f.password.value !== this.f.confirmPassword.value) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Password do not match',
      });
      return;
    }

    this.loading = true;
    // send request to server here
    const user = this.formRegister.value;

    this.authService
      .registerUser(user)
      .pipe(takeUntil(this.unsubscription))
      .subscribe(
        (val) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Register success',
          });
          localStorage.setItem('logged', 'true')
          setTimeout(() => {
            this.router.navigateByUrl('/');
          }, 1000);
        },
        (err) => {
          if (err.status === 409) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'UserAlreadyExists',
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: "Some thing wen't wrong",
            });
          }

          this.loading = false;
        }
      );
  }
}
