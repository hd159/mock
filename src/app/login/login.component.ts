import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  catchError,
  finalize,
  switchMap,
  switchMapTo,
  tap,
} from 'rxjs/operators';
import { AuthService } from '../service/auth.service';
import { CategoryService } from '../service/category.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup;
  loading = false;
  submitted = false;
  sub: Subscription;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const user = this.form.value;

    // send request to server here

    this.sub = this.authService
      .logout()
      .pipe(
        switchMap((val) => {
          return this.authService.login(user.username, user.password);
        }),
        catchError((err) => {
          this.loading = false;
          alert('invalid credential');

          return this.authService.loginDefault();
        }),

        tap(() => {
          this.categoryService.pull();
          this.router.navigateByUrl('/admin');
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe();

    //
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
}
