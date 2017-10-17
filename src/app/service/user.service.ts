import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { StateService } from '../service/state.service';
import { User } from '../models/user';

@Injectable()
export class UserService {
  private headers = new Headers();
  private usersUrl = environment.apiBaseUrl + 'users';

  constructor(private stateService: StateService,
    private http: Http ) {
      this.stateService.jwtToken
          .subscribe(res => {
            // console.log('User service: ', res);
            this.headers.append('Content-Type', 'application/json');
            if (res !== null) {
              this.headers.append('Authorization', 'Bearer ' + res.token);
            }
          });
    }
  getUsers():  Observable<Response> {
    return this.http.get(this.usersUrl, {headers: this.headers});
  }
  getUsersByID(id: string): Observable<Response> {
    return this.http.get(this.usersUrl, {headers: this.headers})
               .map(res => res.json().filter(value => id.indexOf(value._id) > -1));
  }
  getUserIDByGmail(gmail: string): Observable<Response> {
    console.log('In User service, getUserIDByGmail function, gmail received is: ');
    console.log(gmail);
    return this.http.get(this.usersUrl, {headers: this.headers, params: {Gmail: gmail}})
               .map(res => 
                res.json().filter(value => value.Gmail === gmail));
  }
  getUsersByIDs(ids: string[]): Observable<Response> {
    return this.http.get(this.usersUrl, {headers: this.headers})
               .map(res => res.json().filter(value => ids.indexOf(value._id) > -1));
  }
  userValidationByEmail(email: string): Observable<Response> {
    return this.http.get(this.usersUrl, {headers: this.headers})
               .map(res => res.json().filter(value => value.Email === email))
               .catch(err => Observable.throw(err));
  }

  delete(user: User): Observable<Response> {
    const url = `${this.usersUrl}/` + user._id;
    return this.http.delete(url, {headers: this.headers});
  }

  create(user: User): Observable<Response> {
    return this.http
      .post(this.usersUrl, user);
  }

  update(user: User): Observable<Response> {
    const url = `${this.usersUrl}/` + user._id;
    return this.http.put(url, JSON.stringify(user), {headers: this.headers});
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}

