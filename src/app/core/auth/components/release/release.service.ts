import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from 'src/app/app.config';

@Injectable({
  providedIn: 'root',
})
export class ReleaseService {
  constructor(private _http: HttpClient) {}

  Retrieve(): Observable<string> {
    return this._http.get<string>(`${AppConfig.settings.UrlAPI}Release`);
  }
}
