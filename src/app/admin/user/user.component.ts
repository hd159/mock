import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { User } from 'src/app/store';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  userLists$: Observable<User[]>;
  listRoles = {
    '235d3761-8861-44f0-82ce-eb19606be7c6': 'admin',
    'eeb4dc5f-ba15-427d-b192-9797fc6eeb75': 'user',
  };

  showModal = false;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userLists$ = this.authService.getAllUser();
  }

  deleteUser(id: string) {

  }
}
