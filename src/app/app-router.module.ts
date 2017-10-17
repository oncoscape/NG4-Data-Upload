import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, ResolveData } from '@angular/router';

import { NavbarComponent } from './navbar/navbar.component';
import { HelpComponent } from './help/help.component';
import { LandingComponent } from './landing/landing.component';
import { RegisterComponent } from './register/register.component';
import { UsersComponent } from './users/users.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectsDashboardComponent } from './projects-dashboard/projects-dashboard.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/landing',
    pathMatch: 'full'
  }, {
    path: 'landing',
    component: LandingComponent
  }, {
    path: 'users',
    component: UsersComponent,
    children: [
      { path: ':id', component: UserDetailComponent }
    ]
  }, {
    path: 'register',
    component: RegisterComponent
  }, {
    path: 'help',
    component: HelpComponent
  }, {
    path: 'projects',
    component: ProjectsComponent,
    children: [
      { path: 'dashboard', component: ProjectsDashboardComponent },
      { path: ':id', component: ProjectDetailComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRouterModule { }
