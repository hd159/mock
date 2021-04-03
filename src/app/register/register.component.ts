import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';
import { CategoryService } from '../service/category.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
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
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
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
    if (this.form.get('password').value !== this.form.get('confirmPassword').value) {
      return;
    }
    this.loading = true;

    // send request to server here
    const user = this.form.value;
    console.log(user);

    // send request to server here

    // this.sub = this.authService
    //   .logout()
    //   .pipe(
    //     switchMap(() => this.authService.signup(user)),
    //     catchError((err) => {
    //       this.loading = false;
    //       alert('invalid credential');

    //       return this.authService.loginDefault();
    //     }),

    //     tap(() => {
    //       this.categoryService.pull();

    //     }),
    //     finalize(() => {
    //       this.loading = false;
    //     })
    //   )

    //   .subscribe(console.log);

    this.authService.registerUser(user).subscribe(console.log);
  }
}
