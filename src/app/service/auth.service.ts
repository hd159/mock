import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, of, throwError } from 'rxjs';
import {
  catchError,
  filter,
  map,
  pluck,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs/operators';
import { User } from '../store';

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
  private roleIdAdmin = '4bed90a4-ad34-441c-bae2-cba0900698a7';
  listRoles = {
    '4bed90a4-ad34-441c-bae2-cba0900698a7': 'admin',
    '200557a4-d086-4fce-8c22-6af8b27d2da7': 'user',
  };

  private userUrl = 'https://baas.kinvey.com/user/kid_SJ6y1x-vu';

  userInfo: BehaviorSubject<any> = new BehaviorSubject(null);
  userDetail$: Observable<any>;

  isAdminSubject$ = new BehaviorSubject<User>(null);
  private authSubject = new BehaviorSubject<AuthState>(initialAuthState);
  authState$: Observable<AuthState> = this.authSubject.asObservable();

  constructor(private http: HttpClient) {
    this.getUserId();

    this.userDetail$ = this.userInfo.pipe(
      filter((val) => !!val),
      switchMap((id) => this.getUser(id)),
      shareReplay()
    );
  }

  selectAuthData<T>(prop: string): Observable<T> {
    return this.authState$.pipe(map((val) => val[prop]));
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
    console.log(username, password)
    return this.http
      .post<any>(`${this.userUrl}/login`, {
        username: username,
        password: password,
      })
      .pipe(
        map((data: any) => {
          console.log(data);

          if (data._kmd.roles !== undefined) {
            if (data._kmd.roles[0].roleId == this.roleIdAdmin) {
              localStorage.setItem('typeUser', 'admin');
              this.isAdminSubject$.next(data);
              this.setUserId(data._id);
            }
          } else {
            localStorage.setItem('typeUser', 'user');
            localStorage.setItem('userInfo', JSON.stringify(data._id));
            this.setUserId(data._id);
          }

          return data;
        })
      );
  }

  setUserId(id) {
    localStorage.setItem('userInfo', JSON.stringify(id));
    this.userInfo.next(id);
  }

  getUserId() {
    const id = JSON.parse(localStorage.getItem('userInfo'));
    this.userInfo.next(id);
  }

  registerUser(data: any) {
    return this.http
      .post(this.userUrl, data)
      .pipe(catchError((err) => throwError(err)));
  }

  getAllUser(): Observable<User[]> {
    return this.http.get<any[]>(this.userUrl).pipe(
      map((users) => users.map((user) => this.mapUser(user, 'http'))),
      catchError((err) => throwError(err))
    );
  }

  getUser(id: string) {
    return this.http.get<any>(`${this.userUrl}/${id}`).pipe(
      catchError((err) => {
        return of(false);
      })
    );
  }

  getUserLearning(id: string): Observable<any[]> {
    const params = new HttpParams().set('fields', 'learning');
    return this.http
      .get<any[]>(`${this.userUrl}/${id}`, { params })
      .pipe(
        map((value: any) => {
          let learning;
          if (!value.learning) {
            learning = [];
          } else {
            learning = [...value.learning];
          }
          return learning;
        }),
        catchError((err) => {
          return of(false);
        })
      );
  }

  updateUser(userId, body) {
    return this.http.put(`${this.userUrl}/${userId}`, body);
  }

  logout() {
    localStorage.setItem('logged', 'false');
    localStorage.removeItem('userInfo');
    this.userInfo.next(null);
  }
}
