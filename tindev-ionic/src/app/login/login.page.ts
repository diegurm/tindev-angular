import { Component, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginPage {
  login: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private appService: AppService,
    private router: Router
  ) {
    this.login = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
    });
  }
  async handleSubmit({ username }) {
    const response = await this.appService.login(username);
    const { _id } = response;

    this.router.navigate([`main`]);
    // this.router.navigate([`dev/${_id}`]);
  }
}
