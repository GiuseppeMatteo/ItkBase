import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReleaseModel } from './release.model';
import { ReleaseService } from './release.service';

@Component({
  templateUrl: './release.component.html',
})
export class ReleaseComponent {
  info$: Observable<ReleaseModel[]>;

  constructor(releaseService: ReleaseService) {
    this.info$ = releaseService.Retrieve().pipe(map((res) => JSON.parse(res)));
  }
}
