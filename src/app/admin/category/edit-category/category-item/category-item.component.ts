import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Query, Errors } from 'kinvey-angular-sdk';
import { combineLatest, forkJoin, from, Observable, of } from 'rxjs';
import { finalize, map, mergeMap, tap } from 'rxjs/operators';
import { Category } from 'src/app/model/model';
import { CategoryService } from 'src/app/service/category.service';
import { LessonService } from 'src/app/service/lesson.service';
import { LoadingService } from 'src/app/service/loading.service';
import { SwalAlertComponent } from 'src/app/shared/swal-alert/swal-alert.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-category-item',
  templateUrl: './category-item.component.html',
  styleUrls: ['./category-item.component.scss'],
  providers: [SwalAlertComponent],
})
export class CategoryItemComponent implements OnInit {
  @Input() items: Category[];
  @Input() currentPage = 0;
  @Output() removed = new EventEmitter<string>();
  showModal: boolean = false;
  itemEdit: Category;
  itemDelete: Category;
  idxEdit: number;

  constructor(
    private categoryService: CategoryService,
    private lessonService: LessonService,
    private loading: LoadingService,
    private swal: SwalAlertComponent
  ) {}

  ngOnInit(): void {}

  onEdit(item: Category, index: number) {
    this.showModal = !this.showModal;
    this.itemEdit = item;
    this.idxEdit = index;
  }

  editSuccess(category: Category) {
    this.items[this.idxEdit] = category;
    this.idxEdit = null;
  }

  onDeleteById(item: Category) {
    this.itemDelete = item;
    this.swal.swalConfirm(item.title + ' category').then((result) => {
      if (result.value) {
        this.loading.loadingOn();
        this.resolvedelete().subscribe((val) => {
          this.swal.swalSuccess();
          this.removed.emit();
          this.loading.loadingOff();
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.itemDelete = null;
        this.swal.swalCancel('Category');
      }
    });
  }

  resolvedelete() {
    return forkJoin(this.remove(this.itemDelete._id));
  }

  remove(id: string) {
    return this.categoryService.removeById(id).pipe(
      mergeMap(() => this.findAllCategory(id)),
      mergeMap((val) => {
        if (val.length === 0) {
          return this.deleteMultiple(id).pipe(
            tap(() => {
              const query = new Query();
              query.equalTo('idcha', id);
              this.lessonService.removeMultipleValue(query);
            })
          );
        } else {
          return from(val).pipe(mergeMap((val) => this.remove(val['_id'])));
        }
      })
    );
  }

  findAllCategory(id: string) {
    const params = new HttpParams()
      .set('query', JSON.stringify({ idparent: id }))
      .set('fields', '_id');
    return this.categoryService.find(params);
  }

  deleteMultiple(idparent: string) {
    const params = new HttpParams().set(
      'query',
      JSON.stringify({ idparent: idparent })
    );
    return this.categoryService.removeMultipleValue(params);
  }
}
