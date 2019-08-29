import { Component, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';

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
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
  ) {
    this.login = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
    });
  }

  async handleSubmit({ username }) {
    const loading = await this.presentLoading();

    this.appService
      .login(username)
      .then((response: any) => {
        const { _id } = response;

        loading.dismiss();

        this.router.navigate([`main`]);
        // this.router.navigate([`dev/${_id}`]);
      })
      .catch(async () => {
        loading.dismiss();

        const alert = await this.alertCtrl.create({
          header: 'LOGIN',
          message: 'Usuário não encontrado. Ou não possivel realizar login!',
          buttons: ['OK'],
        });
        alert.present();
      });
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({ message: 'Logando...' });
    await loading.present();
    return loading;
  }
}
