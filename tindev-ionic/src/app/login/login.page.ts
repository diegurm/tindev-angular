import { Component, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppService } from '../app.service';

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
  ) {
    this.login = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
    });
  }
  async handleSubmit({ username }) {
    const response = await this.appService.login(username);
    const { _id } = response;

    alert(_id);

    // this.router.navigate([`dev/${_id}`]);
  }
}
