import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from 'kinvey-angular-sdk';
import { BehaviorSubject, from, Observable, of, throwError } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  finalize,
  map,
  mergeMap,
  switchMap,
  tap,
} from 'rxjs/operators';
import { Store, User } from '../store';
import { CategoryService } from './category.service';
import { LoadingService } from './loading.service';

export interface AuthState {
  currentUser: User;
  canLoadPost: boolean;
}

const initialAuthState: AuthState = {
  currentUser: null,
  canLoadPost: true,
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private roleIdAdmin = 'c0010439-58dc-4ed2-a498-841e69ed082e';
  listRoles = {
    'c0010439-58dc-4ed2-a498-841e69ed082e': 'admin',
    '200557a4-d086-4fce-8c22-6af8b27d2da7': 'user',
  };

  private userUrl = 'https://baas.kinvey.com/user/kid_rJvDFm84u';

  private key =
    'Basic a2lkX1N5dWMzQU9nTzphZGZjYjhkY2ZlMjU0M2FlYTEyOTM5N2MyYmM2Yzg4MQ==';

  private headers = new HttpHeaders().set('Authorization', this.key);

  isAdminSubject$ = new BehaviorSubject<User>(null);

  private authSubject = new BehaviorSubject<AuthState>(initialAuthState);
  authState$: Observable<AuthState> = this.authSubject.asObservable();

  constructor(
    private http: HttpClient,
    private loading: LoadingService,
    private categoryService: CategoryService
  ) { }

  // get valueAuthState() {
  //   return this.authSubject.getValue();
  // }

  // setAuthState(val: Partial<AuthState>) {
  //   this.authSubject.next({ ...this.valueAuthState, ...val });
  // }

  selectAuthData<T>(prop: string): Observable<T> {
    return this.authState$.pipe(map((val) => val[prop]));
  }

  // updateAuthState<T>(prop: string, payload: { key: string; value: T[] }) {
  //   const currentValue = this.valueAuthState[prop];

  //   const fieldUpdate = currentValue[payload.key];

  //   const newValue = { [payload.key]: [...fieldUpdate, ...payload.value] };

  //   return this.setAuthState({ [prop]: { ...currentValue, ...newValue } });
  // }

  mapUser(user: any, mode?: string) {
    let userInfo: User;
    let roleId: string[];
    if (mode === 'http') {
      roleId = user._kmd['roles']?.map((role) => role.roleId) || [];
    } else {
      roleId = user.data._kmd['roles']?.map((role) => role.roleId) || [];
    }
    userInfo = {
      username: user.username,
      _id: user._id,
      email: user.email,
      roleId,
    };

    return userInfo;
  }

  login(username: string, password: string): Observable<User> {
    return this.http.post<any>(`${this.userUrl}/login`, { username: username, password: password }).pipe(
      map((data: any) => {
        if (data._kmd.roles !== undefined) {
          if (data._kmd.roles[0].roleId == this.roleIdAdmin) {
            localStorage.setItem('typeUser', 'admin')
            this.isAdminSubject$.next(data)
          }
        }
        else
          localStorage.setItem('typeUser', 'user')

        return data
      })
    )
  }

  // logout() {
  //   return from(this.userService.logout()).pipe(
  //     tap((val) => console.log(val, 'logout')),
  //     catchError((err) => {
  //       console.log({ ...err }, 'logout');
  //       return throwError(err);
  //     })
  //   );
  // }


  // setRoleAdmin(user: User) {
  //   if (user.roleId.includes(this.roleIdAdmin)) {
  //     this.isAdminSubject.next(true);
  //     this.setAuthState({ currentUser: user });
  //   } else {
  //     this.isAdminSubject.next(false);
  //   }
  // }

  registerUser(data: any) {
    return this.http
      .post(this.userUrl, data)
      .pipe(catchError((err) => throwError(err)));
  }

  getAllUser(): Observable<User[]> {
    return this.http
      .get<any[]>(this.userUrl)
      .pipe(
        map((users) => users.map((user) => this.mapUser(user, 'http'))),
        catchError((err) => throwError(err))
      );
  }
}
