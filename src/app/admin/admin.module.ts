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
  ],
  providers: [SweetAlert2Module],
})
export class AdminModule {}
