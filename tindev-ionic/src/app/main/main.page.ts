import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppService } from '../app.service';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MainPage implements OnInit, OnDestroy {
  private routeSubscription: Subscription;

  paramId: number;
  users: any[];
  currentDev: any;
  matchDev: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private appService: AppService,
  ) {
    this.routeSubscription = this.activatedRoute.params.subscribe(
      ({ id }) => (this.paramId = id),
    );
  }

  ngOnInit() {
    this.appService.devs(this.paramId).then(users => {
      const [user, ..._] = users;
      this.users = [users];
      this.currentDev = { ...user };
    });
  }

  async handleLike(id) {
    const loading = await this.presentLoading('Enviando like...');
    const filteredUsers = this.users.filter(user => user._id !== id);

    this.appService
      .like({ currentId: this.paramId, id })
      .then(() => {
        loading.dismiss();

        const [user, ...rest] = filteredUsers;
        this.currentDev = { ...user };
        this.users = [...rest];
      })
      .catch(async () => {
        loading.dismiss();

        const alert = await this.alertCtrl.create({
          header: 'LIKE',
          message: 'Não foi possivel realizar esta ação!',
          buttons: ['OK'],
        });
        alert.present();
      });
  }

  async handleDislike(id) {
    const loading = await this.presentLoading('Enviando dislike...');
    const filteredUsers = this.users.filter(user => user._id !== id);

    this.appService
      .dislike({ currentId: this.paramId, id })
      .then(() => {
        loading.dismiss();

        const [user, ...rest] = filteredUsers;
        this.currentDev = { ...user };
        this.users = [...rest];
      })
      .catch(async () => {
        loading.dismiss();

        const alert = await this.alertCtrl.create({
          header: 'LIKE',
          message: 'Não foi possivel realizar esta ação!',
          buttons: ['OK'],
        });
        alert.present();
      });
  }

  async presentLoading(message) {
    const loading = await this.loadingCtrl.create({ message });
    await loading.present();
    return loading;
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
