import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppService } from '../app.service';

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
    private appService: AppService
  ) {
    this.login = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {}

  async onSubmit({ username }) {
    const response = await this.appService.postDev(username).toPromise();
    const { _id } = response;

    console.log(_id);
  }
}
