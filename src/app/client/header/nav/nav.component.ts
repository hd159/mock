import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { NavCategory } from 'src/app/model/model';
import { CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  Main_block = 'Lập trình';
  laptrinh$: Observable<NavCategory>;
  anothers$: Observable<NavCategory[]>;
  categories$: Observable<NavCategory[]>;
  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categories$ = this.categoryService.getGroup('').pipe(shareReplay());

    this.laptrinh$ = this.categories$.pipe(
      map((categories) =>
        categories.find((item) => item.parent.title === this.Main_block)
      )
    );

    this.anothers$ = this.categories$.pipe(
      map((categories) =>
        categories.filter((item) => item.parent.title !== this.Main_block)
      )
    );
  }
}
