import { Component, OnInit } from '@angular/core';
import {User} from '../user';
import { Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import {HttpService} from '../http.service';
import {Dot} from '../dot';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [HttpService]
})
export class LoginComponent implements OnInit {

  user: User = new User();
  receivedUser: User;
  dots: Dot[] = [];
  status: number;

  constructor(private httpService: HttpService) { }

  loginForm = new FormGroup({
    login: new FormControl('', [
      Validators.required
    ]),
    password: new FormControl('', [
      Validators.required
    ])
  });

  ngOnInit(): void {
  }

  login() {
    // tslint:disable-next-line:max-line-length
    const url = 'http://localhost:8080/JIOJI/web/sign/in/' + this.loginForm.controls.login.value + '/' + this.loginForm.controls.password.value;
    // tslint:disable-next-line:max-line-length
    this.httpService.login(url).subscribe(data => {
      this.status = data.status;
      if ( this.status === 200 ) {
        setTimeout(success, 1000);
      }
    }, error => alert('LLITOTO HE TAK'));
  }

  unlogin() {
    this.loginForm.patchValue({
      login: '',
      password: ''
    });
    this.user.login = this.loginForm.controls.login.value;
    this.user.password = this.loginForm.controls.password.value;
    this.httpService.unlogin().subscribe();
  }

  register() {
    // tslint:disable-next-line:max-line-length
    const url = 'http://localhost:8080/JIOJI/web/registration/register/' + this.loginForm.controls.login.value + '/' + this.loginForm.controls.password.value;
    this.httpService.register(url).subscribe(data => {
      this.status = data.status;
      if ( this.status === 200 ) {
        setTimeout(success, 1000);
      }
    }, error => alert('LLITOTO HE TAK'));
  }

}

function success() {
  document.getElementById('toWorkZone').click();
}
