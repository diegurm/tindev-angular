import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppService } from '../app.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit, OnDestroy {
  public paramId: number;
  public users: any[];
  public matchDev: any = null;

  private routeSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private appService: AppService
  ) {}

  ngOnInit() {
    this.routeSubscription = this.activatedRoute.params.subscribe(({ id }) => {
      if (id) {
        this.paramId = id;
        this.appService.devs(id).then(users => this.users = users);
      }
    });
  }

  handleLike(id) {
    this.appService.like({ currentId: this.paramId, id }).then(() => {
      this.users = this.users.filter(user => user._id !== id);
    });
  }

  handleDislike(id) {
    this.appService.dislike({ currentId: this.paramId, id }).then(() => {
      this.users = this.users.filter(user => user._id !== id);
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
