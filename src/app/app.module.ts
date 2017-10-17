import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { Router, RouterModule } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';
import * as hello from 'hellojs';
import * as _ from 'underscore';
import { FileSelectDirective, FileDropDirective, FileUploadModule } from 'ng2-file-upload';

import { AppComponent } from './app.component';
import { AppRouterModule } from './app-router.module';
import { UsersComponent } from './users/users.component';
import { LandingComponent } from './landing/landing.component';
import { ProjectsComponent } from './projects/projects.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProjectsDashboardComponent, DateFormatter } from './projects-dashboard/projects-dashboard.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { RegisterComponent } from './register/register.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { PermissionsComponent, UserFullNamePipe } from './permissions/permissions.component';
import { FilesComponent, Overlapping} from './files/files.component';
import { HelpComponent } from './help/help.component';

import { UserService } from './service/user.service';
import { StateService } from './service/state.service';
import { FileService } from './service/file.service';
import { PermissionService } from './service/permission.service';
import { LoginService } from './service/login.service';
import { UpdateEmitService } from './service/update-emit.service';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    RegisterComponent,
    ProjectsComponent,
    NavbarComponent,
    ProjectsDashboardComponent,
    ProjectDetailComponent,
    UsersComponent,
    UserDetailComponent,
    PermissionsComponent,
    FilesComponent,
    DateFormatter,
    UserFullNamePipe,
    Overlapping,
    HelpComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRouterModule,
    ReactiveFormsModule,
    HttpModule,
    FileUploadModule,
    NgbModule.forRoot(),
    SlimLoadingBarModule.forRoot()
  ],
  exports: [SlimLoadingBarModule],
  providers: [UserService,
              LoginService,
              StateService,
              UpdateEmitService,
              FileService],
  bootstrap: [AppComponent]
})
export class AppModule { }
