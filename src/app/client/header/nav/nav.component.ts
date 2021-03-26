import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, pluck, shareReplay } from 'rxjs/operators';
import { CategoryName, Store } from 'src/app/store';
import { NavCategory } from 'src/app/model/model';
import { CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  laptrinh$: Observable<NavCategory>;
  anothers$: Observable<NavCategory[]>;

  constructor(private store: Store, private categoryService: CategoryService) {
    const category$ = this.categoryService
      .selectData<CategoryName>('categoryName')
      .pipe(
        filter((val) => !!val),
        shareReplay()
      );
    this.laptrinh$ = category$.pipe(pluck('Lập trình'));
    this.anothers$ = category$.pipe(pluck('anothers'));

    // this.categoryService.state$.subscribe(console.log);
  }

  ngOnInit(): void {}
}
