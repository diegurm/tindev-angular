import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private baseURL = 'http://localhost:3333';

  constructor(private http: HttpClient) {}

  postDev(username): Observable<any> {
    return this.http.post<any>(`${this.baseURL}/devs`, {
      username
    });
  }
}
