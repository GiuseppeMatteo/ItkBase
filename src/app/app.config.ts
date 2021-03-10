import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { AppSettingModel } from './shared/models/app-setting.model';
import { Regexp } from './shared/models/reg-ex.model';

@Injectable({ providedIn: 'root' })
export class AppConfig {
  static settings: AppSettingModel;
  static regexp: Regexp;
  constructor(private http: HttpClient) {}
  load() {
    const jsonFileSettings = `assets/config/config.${environment.name}.json`;
    const jsonFileRegExp = `assets/regexp.pattern.json`;

    return new Promise<void>((resolve, reject) => {
      this.http
        .get(jsonFileSettings)
        .toPromise()
        .then((response) => {
          AppConfig.settings = <AppSettingModel>response;
          resolve();
        })
        .catch((response: any) => {
          reject(
            `Non si riesce a caricare il file '${jsonFileSettings}': ${JSON.stringify(
              response
            )}`
          );
        });

      this.http
        .get(jsonFileRegExp)
        .toPromise()
        .then((response) => {
          AppConfig.regexp = <Regexp>response;
          resolve();
        })
        .catch((response: any) => {
          reject(
            `Non si riesce a caricare il file '${jsonFileRegExp}': ${JSON.stringify(
              response
            )}`
          );
        });
    });
  }
}
