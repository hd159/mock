import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { PostdetailComponent } from './postdetail/postdetail.component';
import { HostCategoryComponent } from './host-category/host-category.component';
import { LessonCategoryComponent } from './lesson-category/lesson-category.component';
import { CommentComponent } from './comment/comment.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommentDetailComponent } from './comment/comment-detail/comment-detail.component';
import { CommentFormComponent } from './comment/comment-form/comment-form.component';
import { PathCategoryComponent } from './path-category/path-category.component';

@NgModule({
  declarations: [
    CategoryDetailComponent,
    PostdetailComponent,
    HostCategoryComponent,
    LessonCategoryComponent,
    CommentComponent,
    CommentDetailComponent,
    CommentFormComponent,
    PathCategoryComponent,
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  providers: [],
})
export class CategoryModule {}
