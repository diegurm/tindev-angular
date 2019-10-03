import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Socket } from 'ngx-socket-io';

import { AppService } from '../app.service';
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
  currentDev: any = null;
  matchDev: any = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private appService: AppService,
    private socket: Socket,
  ) {}

  ngOnInit() {
    this.routeSubscription = this.activatedRoute.params.subscribe(({ id }) => {
      if (id) {
        this.paramId = id;
        this.socket = new Socket({
          url: 'http://localhost:3333',
          options: {
            query: { user: id },
          },
        });

        this.socket.on('match', dev => (this.matchDev = { ...dev }));
        this.appService.devs(this.paramId).then(users => {
          const [user, ..._] = users;
          this.users = [...users];
          this.currentDev = user !== undefined ? { ...user } : null;

          console.log(user);
        });
      }
    });
  }

  async handleLike() {
    const id = this.currentDev._id;
    const loading = await this.presentLoading('Enviando like...');
    const filteredUsers = this.users.filter(user => user._id !== id);

    this.appService
      .like({ currentId: this.paramId, id })
      .then(() => {
        loading.dismiss();

        const [user, ...rest] = filteredUsers;
        this.currentDev =  user !== undefined ? { ...user } : null;
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

  async handleDislike() {
    const id = this.currentDev._id;
    const loading = await this.presentLoading('Enviando dislike...');
    const filteredUsers = this.users.filter(user => user._id !== id);

    this.appService
      .dislike({ currentId: this.paramId, id })
      .then(() => {
        loading.dismiss();

        const [user, ...rest] = filteredUsers;
        this.currentDev =  user !== undefined ? { ...user } : null;
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
