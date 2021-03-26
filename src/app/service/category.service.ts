import { LessonService } from 'src/app/service/lesson.service';
import { Injectable } from '@angular/core';
import { DataStoreService, DataStoreType, Query } from 'kinvey-angular-sdk';
import {
  BehaviorSubject,
  combineLatest,
  from,
  Observable,
  of,
  throwError,
} from 'rxjs';
import {
  catchError,
  map,
  mergeMap,
  share,
  shareReplay,
  switchAll,
  switchMapTo,
  tap,
  toArray,
} from 'rxjs/operators';
import { Category, NavCategory } from '../model/model';
import { CategoryName, Store } from '../store';
import { CollectionService } from './collection.service';
import { AuthService } from './auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface CategoryState {
  categoryName: CategoryName;
}

const initialCategoryState: CategoryState = {
  categoryName: null,
};

@Injectable({ providedIn: 'root' })
export class CategoryService extends CollectionService<CategoryState> {
  categories$: any;

  private categorySubject = new BehaviorSubject<CategoryState>(
    initialCategoryState
  );
  categoryState$: Observable<CategoryState> = this.categorySubject.asObservable();

  constructor(http: HttpClient) {
    super(initialCategoryState, 'category', http);

    this.categories$ = this.find().pipe(shareReplay());
  }

  getAllCategories() {
    return this.find().pipe(shareReplay());
  }

  getGroup(idparent: string): Observable<any[]> {
    return this.categories$.pipe(
      map((val: any) => val.filter((item) => item.idparent === idparent)),
      switchAll(),
      map((val) => ({
        parent: {
          title: val['title'],
          _id: val['_id'],
          desc: val['desc'] || '',
          img: val['img'] || '',
        },
        childs: [],
      })),
      mergeMap((val: any) =>
        combineLatest([of(val), this.getGroup(val.parent._id)])
      ),
      tap(([parent, child]) => {
        parent.childs = [...parent.childs, ...child];
      }),
      map(([parent]) => parent),
      toArray()
    );
  }

  setCategory(): Observable<CategoryName> {
    return this.getGroup('').pipe(
      map((val) => {
        let laptrinh: NavCategory;
        let anothers: NavCategory[];
        val.forEach((item, index) => {
          if (item.parent.title === 'Lập trình') {
            laptrinh = item;
            const another = [...val];
            another.splice(index, 1);
            anothers = another;
          } else {
            anothers = [...val];
          }
        });
        const categoryName: CategoryName = {
          'Lập trình': laptrinh,
          anothers: anothers,
        };

        return categoryName;
      })
    );
  }

  setCategoryToStore() {
    return this.setCategory().pipe(
      switchMapTo(this.setCategory()),
      tap((categoryName) => this.setState({ categoryName }))
    );
  }

  getCategoryForEdit(): Observable<Partial<Category>[]> {
    return this.find<Category>().pipe(
      mergeMap((val) => from(val)),
      map((category: any) => ({
        idparent: category.idparent,
        title: category.title,
        _id: category['_id'],
      })),
      toArray(),
      catchError((err) => throwError(err))
    );
  }

  findPath(idparent: string, arr: Category[]): Observable<any> {
    console.log(idparent);
    return this.findById<Category>(idparent).pipe(
      tap((val) => arr.unshift(val)),
      mergeMap((val) => {
        if (!val.idparent) {
          return of(null);
        } else {
          return this.findPath(val.idparent, arr);
        }
      })
    );
  }
}
