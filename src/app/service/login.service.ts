import { Injectable } from '@angular/core';
import { Component, Output, Input, EventEmitter, OnInit} from '@angular/core';
import * as hello from 'hellojs';
import { StateService } from '../service/state.service';
import { Router } from '@angular/router';
import { Observable} from 'rxjs/Observable';
import { UserService } from '../service/user.service';
import { User } from '../models/user';
@Injectable()
export class LoginService {
    GOOGLE_CLIENT_ID = '1098022410981-p7n5ejjji8qlvdtff274pol54jo5i8ks.apps.googleusercontent.com';

    userGoogleProfile: EventEmitter<any> ;
    constructor(private stateService: StateService,
                private userService: UserService,
                private router: Router) {
        this.userGoogleProfile = new EventEmitter<any>();
        hello.init({
          google: this.GOOGLE_CLIENT_ID,
        }, {
          force: true,
          redirect_uri: '/landing',
          display: 'popup',
          response_type: 'token',
          scope: 'email'
        });
          hello.on('auth.login', this.authLogin.bind(this));
          hello.on('auth.logout', this.authLogout.bind(this));
          hello.on('auth.change', function() {alert('state changed!'); });
    }
    googleLogin(): any {
      this.googleLogOut();
      this.stateService.user.next(null);
      hello.login('google');
    }
    googleLogOut(): any {
      hello.logout('google', {});
      this.stateService.user.next(null);
      this.userGoogleProfile.emit(null);
    }
    authLogin(auth) {
      hello('google').api('me').then( this.updateUserInfo.bind(this));
    }
    authLogout(auth) {
      this.updateUserInfo.bind(this, null);
      this.router.navigate(['/landing']);
    }
    updateUserInfo(v) {
      this.stateService.internalUser.subscribe(res => {
        const internalUser = res;
        if (internalUser !== null && internalUser.Gmail === '') {
          internalUser.Gmail = v.email;
          this.userService.create(internalUser)
              .subscribe(() => alert('New User is added to database'));
        } else {
          this.userService.getUserIDByGmail(v.email)
              .subscribe(r => {
                if (typeof(r[0]) !== 'undefined') {
                  this.stateService.user.next(v);
                  this.userGoogleProfile.emit(v);
                  this.router.navigate(['/projects', 'dashboard']);
                } else {
                  alert('User is not registered yet. Please register. Please turn on the browser pop-up window.');
                  this.router.navigate(['/landing']);
                }
              });
          }
      });
    }
}