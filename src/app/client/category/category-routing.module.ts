import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { HostCategoryComponent } from './host-category/host-category.component';
import { LessonCategoryComponent } from './lesson-category/lesson-category.component';
import { PostdetailComponent } from './postdetail/postdetail.component';

const routes: Routes = [
  { path: 'post/:id', component: PostdetailComponent },
  {
    path: '',
    children: [
      {
        path: ':name',
        component: HostCategoryComponent,
      },
      {
        path: 'detail/:name',
        component: CategoryDetailComponent,
      },
      { path: ':name/:id', component: LessonCategoryComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryRoutingModule {}
