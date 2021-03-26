import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  searchForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      search: [''],
    });
  }

  ngOnInit(): void {}
}
