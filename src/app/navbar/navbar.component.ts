import { Component, OnInit, ViewChild } from '@angular/core';
import { StateService } from '../service/state.service';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';
import { Observable} from 'rxjs/Observable';
import { LoginService } from '../service/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {
  user: any;
  constructor( private stateService: StateService,
               private userService: UserService,
               private loginService: LoginService,
               private router: Router) {
                  this.stateService.user.subscribe((data) => {
                    this.user = data;
                });
              }
  ngOnInit() {}

  goDashboard() {
    if (this.user) {
      this.router.navigate(['projects/', 'dashboard']);
    } else {
      alert('Please Log in or register.');
    }
  }
  goHelp() {
    this.router.navigate(['help']);
  }
  googleLogOut() {
    this.loginService.googleLogOut();
  }
  toProfile() {
      this.userService.getUserByGmail(this.user.email)
        .map(res => res.json()[0])
        .subscribe(res => {
          this.router.navigate([`/users/${res._id}/`]);
        });
  }
 }


