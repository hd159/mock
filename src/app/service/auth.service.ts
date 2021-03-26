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
  canLoadPost: false,
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private roleAdmin = 'c0010439-58dc-4ed2-a498-841e69ed082e';
  listRoles = {
    'c0010439-58dc-4ed2-a498-841e69ed082e': 'admin',
    '200557a4-d086-4fce-8c22-6af8b27d2da7': 'user',
  };

  private userUrl = 'https://baas.kinvey.com/user/kid_Syuc3AOgO';

  private key =
    'Basic a2lkX1N5dWMzQU9nTzphZGZjYjhkY2ZlMjU0M2FlYTEyOTM5N2MyYmM2Yzg4MQ==';

  private headers = new HttpHeaders().set('Authorization', this.key);

  private isAdminSubject = new BehaviorSubject<boolean>(null);
  isAdmin$ = this.isAdminSubject.asObservable().pipe(distinctUntilChanged());

  private authSubject = new BehaviorSubject<AuthState>(initialAuthState);
  authState$: Observable<AuthState> = this.authSubject.asObservable();

  constructor(
    private userService: UserService,
    private http: HttpClient,
    private loading: LoadingService,
    private categoryService: CategoryService
  ) {}

  get valueAuthState() {
    return this.authSubject.getValue();
  }

  setAuthState(val: Partial<AuthState>) {
    this.authSubject.next({ ...this.valueAuthState, ...val });
  }

  selectAuthData<T>(prop: string): Observable<T> {
    return this.authState$.pipe(map((val) => val[prop]));
  }

  updateAuthState<T>(prop: string, payload: { key: string; value: T[] }) {
    const currentValue = this.valueAuthState[prop];

    const fieldUpdate = currentValue[payload.key];

    const newValue = { [payload.key]: [...fieldUpdate, ...payload.value] };

    return this.setAuthState({ [prop]: { ...currentValue, ...newValue } });
  }

  // checkCredential() {
  //   console.log(this.activeUser1, 'incheck');
  //   if (this.activeUser1) {
  //     return from(this.activeUser1.me()).pipe(
  //       map((user) => {
  //         console.log(user);
  //         if (user) {
  //           return this.mapUser(user);
  //         } else {
  //           return null;
  //         }
  //       }),
  //       catchError((err) => {
  //         console.log({ ...err }, 'asdasd');

  //         return this.loginDefault();
  //       })
  //     );
  //   } else {
  //     return this.loginDefault();
  //   }
  // }

  // get activeUser(): Observable<User> {
  //   return of(this.userService.getActiveUser()).pipe(
  //     map((user) => {
  //       console.log(user);
  //       if (user) {
  //         return this.mapUser(user);
  //       } else {
  //         return null;
  //       }
  //     }),
  //     catchError((err) => {
  //       console.log({ ...err }, 1);
  //       return throwError(err);
  //     })
  //   );
  // }

  checkCredential() {
    return of(this.activeUser1).pipe(
      mergeMap((user) => {
        if (user) {
          return from(this.activeUser1.me());
        } else {
          return this.loginDefault();
        }
      }),
      catchError((err) => {
        console.log({ ...err }, 'err in me');
        return this.loginDefault();
      })
    );
  }

  get activeUser(): Observable<User> {
    return of(this.userService.getActiveUser()).pipe(
      map((user) => {
        console.log(user);
        if (user) {
          return this.mapUser(user);
        } else {
          return null;
        }
      }),
      catchError((err) => {
        console.log({ ...err }, 1);
        return throwError(err);
      })
    );
  }

  get activeUser1() {
    return this.userService.getActiveUser();
  }

  signup(data: any) {
    return from(this.userService.signup(data)).pipe(
      catchError((err) => throwError(err))
    );
  }

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
    return from(this.userService.login(username, password)).pipe(
      map((user) => this.mapUser(user)),
      tap((user) => {
        this.setRoleAdmin(user);
      }),
      catchError((err) => throwError(err))
    );
  }

  logout() {
    return from(this.userService.logout()).pipe(
      tap((val) => console.log(val, 'logout')),
      catchError((err) => {
        console.log({ ...err }, 'logout');
        return throwError(err);
      })
    );
  }

  loginDefault() {
    this.setAuthState({ canLoadPost: false });
    return this.logout().pipe(switchMap(() => this.login('test', '123456')));
  }

  setRoleAdmin(user: User) {
    if (user.roleId.includes(this.roleAdmin)) {
      this.isAdminSubject.next(true);
      this.setAuthState({ currentUser: user });
    } else {
      this.isAdminSubject.next(false);
    }
  }

  setUser() {
    document.body.style.overflow = 'hidden';
    this.loading.loadingOn();
    return this.activeUser.pipe(
      tap(() => {}),
      switchMap((user) => {
        if (user) {
          this.setAuthState({ canLoadPost: true });
          console.log(user, 'inset');
          this.setRoleAdmin(user);

          return this.categoryService.setCategoryToStore();
        } else {
          this.setAuthState({ canLoadPost: false });
          return this.loginDefault().pipe(
            tap((user) => this.setAuthState({ canLoadPost: true })),
            mergeMap((val) => this.categoryService.setCategoryToStore())
          );
        }
      }),
      finalize(() => {
        this.loading.loadingOff();
        document.body.style.overflow = 'visible';
      })
    );
  }

  registerUser(data: any) {
    const key =
      'Basic ' +
      btoa('kid_r1x-mZeCw' + ':' + 'c43aec5e8ffa4221a1ae126a87d30465');

    const headers = new HttpHeaders()
      .set('Authorization', key)
      .set('Content-Type', 'application/json');

    return this.http
      .post(this.userUrl, data, { headers })
      .pipe(catchError((err) => throwError(err)));
  }

  getAllUser(): Observable<User[]> {
    return this.http
      .get<any[]>(this.userUrl, { headers: this.headers })
      .pipe(
        map((users) => users.map((user) => this.mapUser(user, 'http'))),
        catchError((err) => throwError(err))
      );
  }

  remove(userId: string) {
    return from(this.userService.remove(userId, { hard: true })).pipe(
      catchError((err) => throwError(err))
    );
  }
}
