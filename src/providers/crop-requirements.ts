import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the CropRequirements provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CropRequirements {
  data: any;

  public cropRequirementsLabelMap = {
    'spring-barley-incorporated': 'Spring barley, straw incorporated',
    'spring-barley-removed': 'Spring barley, straw removed',
    'winter-wheat-incorporated': 'Winter wheat, straw incorporated',
    'winter-wheat-removed': 'Winter whea, straw removed',
    'grass-cut': 'Grass cut (yield 6-8k, conc 1.5, stock med)',
    'grass-grazed': 'Grass grazed (yield 6-8k, conc 1.5, stock med)'
  };

  constructor(public http: Http) {
    this.data = null;
  }

  load() {
    if (this.data) {
      return Promise.resolve(this.data);
    }
    return new Promise(resolve => {
      this.http.get('assets/json/crop-requirements-n.json')
      .map(res => res.json())
      .subscribe(data => {
        this.data = data;
        resolve(this.data);
      });
    })
  }

}
