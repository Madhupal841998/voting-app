import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs';
import { User } from './user.model';
import { Vote } from './vote.model';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  selectedEmployee: User;
  employees: User[];
  readonly baseURL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  postUser(user: User) {
    return this.http.post(`${this.baseURL}/register`,user);
  }

  getUser(data) {
    return this.http.post(`${this.baseURL}/login`,data);
  }


  postVote(vote: Vote) {
    return this.http.post(`${this.baseURL}/vote`,vote);
  }
  getAdmin(){
    return this.http.get(`${this.baseURL}/admin`);
  }

}
