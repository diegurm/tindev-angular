import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppService } from '../app.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit, OnDestroy {
  private routeSubscription: Subscription;

  paramId: number;
  users: any[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private appService: AppService,
  ) {
    this.routeSubscription = this.activatedRoute.params.subscribe(({ id }) => {
      console.log(id);

      this.paramId = id;
    });
  }

  ngOnInit() {
    this.appService.devs(this.paramId).then(users => (this.users = users));
  }

  handleLike(id) {
    const filtredUsers = [...this.users.filter(user => user._id !== id)];

    this.appService.like({ currentId: this.paramId, id }).then(() => {
      this.users = [...filtredUsers];
    });
  }

  handleDislike(id) {
    const filtredUsers = [...this.users.filter(user => user._id !== id)];

    this.appService.dislike({ currentId: this.paramId, id }).then(() => {
      this.users = [...filtredUsers];
    });
  }

  async presentLoading({ message }) {
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
