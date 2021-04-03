import { Injectable } from '@angular/core';
import {
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  CanActivate,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad, CanActivate {
  constructor(private router: Router, private authService: AuthService) { }
  canLoad(route: Route, segments: UrlSegment[]): Observable<any> {
    return this.authService.isAdminSubject$.pipe(
      tap((val) => {
        if (val === null) {
          this.router.navigateByUrl('admin/login');
        }
      })
    );
  }

  canActivate(): Observable<any> {
    return this.authService.isAdminSubject$.pipe(
      tap((val) => {
        if (val === null) {
          this.router.navigateByUrl('admin/login');
        }
      })
    );
  }
}
