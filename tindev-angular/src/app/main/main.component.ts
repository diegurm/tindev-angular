import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppService } from '../app.service';
import { Socket } from 'ngx-socket-io';

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
    private appService: AppService,
    private socket: Socket
  ) {}

  ngOnInit() {
    this.routeSubscription = this.activatedRoute.params.subscribe(({ id }) => {
      if (id) {
        this.paramId = id;
        this.socket = new Socket({
          url: 'http://localhost:3333',
          options: {
            query: { user: id }
          }
        });

        this.socket.on('match', dev => this.matchDev = {...dev });
        this.appService.devs(id).then(users => (this.users = [...users]));
      }
    });
  }

  handleLike(id) {
    const filteredUsers = this.users.filter(user => user._id !== id);
    this.appService.like({ currentId: this.paramId, id }).then(() => {
      this.users = [...filteredUsers];
    });
  }

  handleDislike(id) {
    const filteredUsers = this.users.filter(user => user._id !== id);
    this.appService.dislike({ currentId: this.paramId, id }).then(() => {
      this.users = [...filteredUsers];
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
