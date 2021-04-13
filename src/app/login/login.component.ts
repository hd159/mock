import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, BehaviorSubject } from 'rxjs';
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

    const user = {
      username: this.form.get('username').value,
      password: this.form.get('password').value,
    };

    // send request to server here
    this.authService.login(user.password, user.password).subscribe(
      (data: any) => {
        console.log(data);

        if (localStorage.getItem('typeUser') === 'admin')
          this.router.navigateByUrl('/admin');
        else {
          localStorage.setItem('logged', 'true');
          this.router.navigateByUrl('/');
        }
      },
      (err) => {
        this.loading = false;
      }
    );

    //
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
}
