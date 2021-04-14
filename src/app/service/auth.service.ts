import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, of, throwError } from 'rxjs';
import { catchError, map, pluck, shareReplay } from 'rxjs/operators';
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
  private roleIdAdmin = 'c0010439-58dc-4ed2-a498-841e69ed082e';
  listRoles = {
    'c0010439-58dc-4ed2-a498-841e69ed082e': 'admin',
    '200557a4-d086-4fce-8c22-6af8b27d2da7': 'user',
  };

  private userUrl = 'https://baas.kinvey.com/user/kid_rJvDFm84u';

  userInfo: any;
  userDetail$: Observable<any>;

  isAdminSubject$ = new BehaviorSubject<User>(null);

  private authSubject = new BehaviorSubject<AuthState>(initialAuthState);
  authState$: Observable<AuthState> = this.authSubject.asObservable();

  constructor(private http: HttpClient) {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.userDetail$ = this.getUser(this.userInfo).pipe(shareReplay());
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
    return this.http
      .post<any>(`${this.userUrl}/login`, {
        username: username,
        password: password,
      })
      .pipe(
        map((data: any) => {
          if (data._kmd.roles !== undefined) {
            if (data._kmd.roles[0].roleId == this.roleIdAdmin) {
              localStorage.setItem('typeUser', 'admin');
              this.isAdminSubject$.next(data);
              localStorage.setItem('userInfo', JSON.stringify(data._id));
            }
          } else {
            localStorage.setItem('typeUser', 'user');
            localStorage.setItem('userInfo', JSON.stringify(data._id));
          }

          return data;
        })
      );
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
    return this.http.get<any>(`${this.userUrl}/${id}`);
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
        })
      );
  }

  updateLearning(userId, body) {
    return this.http.put(`${this.userUrl}/${userId}`, body);
  }
}
