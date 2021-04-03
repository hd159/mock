import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { AdminComponent } from './home-admin/admin.component';
import { AddPostComponent } from './post/add-post/add-post.component';
import { AddCategoryComponent } from './category/add-category/add-category.component';
import { DropdownDirective } from '../dropdown.directive';
import { CategorySelectorComponent } from './category/add-category/category-selector/category-selector.component';
import { CategoryListComponent } from './category/add-category/category-list/category-list.component';
import { EditCategoryComponent } from './category/edit-category/edit-category.component';
import { CategoryItemComponent } from './category/edit-category/category-item/category-item.component';
import { EditPostComponent } from './post/edit-post/edit-post.component';
import { UserComponent } from './user/user.component';
import { AddUserComponent } from './user/add-user/add-user.component';
import { FormCategoryComponent } from './category/form-category/form-category.component';
import { ModalEditComponent } from './category/edit-category/modal-edit/modal-edit.component';
import { FormPostComponent } from './post/form-post/form-post.component';
import { UserModalComponent } from './user/user-modal/user-modal.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartsModule } from 'ng2-charts';

import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from 'primeng/inputtext';
import { CoursesComponent } from './courses/courses.component';
import { ButtonModule } from 'primeng/button';
import { CoursesFormTargetComponent } from './courses/courses-form-target/courses-form-target.component';
import { CoursesCurriculumComponent } from './courses/courses-curriculum/courses-curriculum.component';
import { CurriculumItemComponent } from './courses/courses-curriculum/curriculum-item/curriculum-item.component';
import { CoursesLandingpageComponent } from './courses/courses-landingpage/courses-landingpage.component';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { PanelModule } from 'primeng/panel';



@NgModule({
  declarations: [
    AdminComponent,
    AddPostComponent,
    AddCategoryComponent,
    DropdownDirective,
    CategorySelectorComponent,
    CategoryListComponent,
    EditCategoryComponent,
    CategoryItemComponent,
    EditPostComponent,
    UserComponent,
    AddUserComponent,
    FormCategoryComponent,
    ModalEditComponent,
    FormPostComponent,
    UserModalComponent,
    DashboardComponent,
    CoursesComponent,
    CoursesFormTargetComponent,
    CoursesCurriculumComponent,
    CurriculumItemComponent,
    CoursesLandingpageComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    SweetAlert2Module.forChild(),
    ChartsModule,
    TableModule,
    CardModule,
    PaginatorModule,
    SkeletonModule,
    InputTextModule,
    ButtonModule,
    DividerModule,
    DropdownModule,
    ConfirmDialogModule,
    MessagesModule,
    ToastModule,
    PanelModule
  ],
  providers: [SweetAlert2Module, ConfirmationService, MessageService],
})
export class AdminModule { }
