import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  login: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private appService: AppService,
    private router: Router
  ) {
    this.login = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {}

  async onSubmit({ username }) {
    const response = await this.appService.login(username);
    const { _id } = response;

    this.router.navigate([`dev/${_id}`]);
  }
}
