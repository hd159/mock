import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';
import { Store, User } from 'src/app/store';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  userDropdown: boolean = false;
  sidebarToggle: boolean = true;
  wasInside: boolean = false;
  user$: User
  constructor(private authService: AuthService, private router: Router) {
    this.authService.isAdminSubject$.subscribe((data) => {
      this.user$ = data
    })
  }

  ngOnInit(): void { }

  toggleUserDropdown() {
    this.userDropdown = !this.userDropdown;
    this.wasInside = true;
  }

  toggerSidebar() {
    this.sidebarToggle = !this.sidebarToggle;
  }

  @HostListener('document:click')
  clickOutside() {
    if (!this.wasInside) {
      this.userDropdown = false;
    }
    this.wasInside = false;
  }

  onLogout() {

  }
}
