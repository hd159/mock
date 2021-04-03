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
import { FileUploadModule } from 'primeng/fileupload';
import { CoursesComponent } from '../courses/courses.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { AccordionModule } from 'primeng/accordion';
import { CoursesDetailComponent } from '../courses/courses-detail/courses-detail.component';
import { CoursesPaymentComponent } from '../courses/courses-payment/courses-payment.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';

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
    CoursesComponent,
    CoursesDetailComponent,
    CoursesPaymentComponent,
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FileUploadModule,
    CardModule,
    ButtonModule,
    DialogModule,
    AccordionModule,
    AutoCompleteModule,
    RadioButtonModule,
    InputTextModule,
  ],
  providers: [],
})
export class CategoryModule {}
