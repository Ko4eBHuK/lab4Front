import { Component, OnInit } from '@angular/core';
import {User} from '../user';
import {HttpService} from '../http.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [HttpService]
})
export class HeaderComponent implements OnInit {

  user: User;

  constructor(private httpService: HttpService) { }
  ngOnInit(): void {
    this.httpService.getUser().subscribe((data: User) => this.user = data);
  }
}
