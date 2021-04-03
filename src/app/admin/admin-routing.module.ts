import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCategoryComponent } from './category/add-category/add-category.component';
import { AddPostComponent } from './post/add-post/add-post.component';
import { EditCategoryComponent } from './category/edit-category/edit-category.component';
import { EditPostComponent } from './post/edit-post/edit-post.component';
import { AdminComponent } from './home-admin/admin.component';
import { AddUserComponent } from './user/add-user/add-user.component';
import { UserComponent } from './user/user.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CoursesComponent } from './courses/courses.component';
import { CoursesCurriculumComponent } from './courses/courses-curriculum/courses-curriculum.component';
import { CoursesLandingpageComponent } from './courses/courses-landingpage/courses-landingpage.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'add-category', component: AddCategoryComponent },
      { path: 'edit-category', component: EditCategoryComponent },
      { path: 'add-post', component: AddPostComponent },
      { path: 'edit-post', component: EditPostComponent },
      { path: 'edit-post/:id', component: AddPostComponent },
      { path: 'users', component: UserComponent },
      { path: 'add-user', component: AddUserComponent },
      {
        path: 'courses',
        component: CoursesComponent,
      },
      { path: 'courses/curriculum', component: CoursesCurriculumComponent },
      { path: 'courses/landing-page', component: CoursesLandingpageComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
