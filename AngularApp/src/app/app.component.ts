import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    public route: ActivatedRoute,
    public router: Router,
  ){

  }

  register(){
    this.router.navigate(['/register']);
  }
  login(){
    this.router.navigate(['/login']);
  }
}
