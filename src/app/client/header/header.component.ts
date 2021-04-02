import { Router } from '@angular/router';
import { LoginComponent } from './../../login/login.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  searchForm: FormGroup;
  isLogin = false
  constructor(private fb: FormBuilder, private _router: Router) {
    this.searchForm = this.fb.group({
      search: [''],
    });
  }
  items = [
    {
      icon: 'pi pi-bell',

    },
    {
      icon: 'pi pi-shopping-cart',
      command: () => this.showCart()
    },
    {
      icon: 'pi pi-user',
      items: [
        {
          label: 'My account',
          command: () => this.showUser()
        },
        { label: 'My learning' },
        { label: 'My cart' },
        { label: 'Log out' }
      ],

    }
  ];
  showUser() {
    this._router.navigateByUrl('/user-info')
  }
  showCart() {
    this._router.navigateByUrl('/cart')
  }
  ngOnInit(): void {
    if (localStorage.getItem('logged') == 'true')
      this.isLogin = true
  }
}
