import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private baseURL = 'http://localhost:3333';

  constructor(private http: HttpClient) {}

  login(username): Promise<any> {
    return this.http.post<any>(`${this.baseURL}/devs`, {
      username
    }).toPromise();
  }

  devs(currentId): Promise<any> {
    return this.http.get(`${this.baseURL}/devs`, {
      headers: { user: currentId }
    }).toPromise();
  }

  dislike({ currentId, id }): Promise<any> {
    return this.http.post(`${this.baseURL}/devs/${id}/dislikes`, null, {
      headers: {
        user: currentId
      }
    }).toPromise();
  }

  like({ currentId, id }): Promise<any> {
    return this.http.post(`${this.baseURL}/devs/${id}/likes`, null, {
      headers: {
        user: currentId
      }
    }).toPromise();
  }
}
