import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the SoilNitrogenSupply provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class SoilNitrogenSupply {
  data: any;

  public soilTypeLabelMap = {
    sandyshallow: 'Sandy/Shallow',
    mediumshallow: 'Medium/Shallow',
    deepclay: 'Deep Clay',
    deepsilt: 'Deep Silt',
    organic: 'Organic (10-20% organic matter)',
    peat: 'Peat'
  };

  public cropTypeLabelMap = {
    cereals: 'Cereals',
    'low-n-veg': 'Low nitrogen veg',
    forage: 'Forage',
    sugarbeet: 'Sugar beet',
    oilseed: 'Oilseed rape',
    potatoes: 'Potatoes',
    peas: 'Peas',
    beans: 'Beans',
    uncropped: 'Uncropped',
    'medium-n-veg': 'Medium nitrogen veg',
    'high-n-veg': 'High nitrogen veg'
  };

  constructor(public http: Http) {
    this.data = null;
  }

  load() {
    if (this.data) {
      return Promise.resolve(this.data);
    }
    return new Promise(resolve => {
      this.http.get('assets/json/soil-nitrogen-supply.json')
      .map(res => res.json())
      .subscribe(data => {
        this.data = data;
        resolve(this.data);
      });
    })
  }

}
