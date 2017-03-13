import { Component } from '@angular/core';
/*import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import { Map } from 'mapbox-gl';
import { ViewChild } from '@angular/core';*/
import { NavController, PopoverController/*, Slides*/ } from 'ionic-angular';
import { FieldAddPage } from '../field-add/field-add';
import { FieldDetailPage } from '../field-detail/field-detail';
import { AboutPage } from '../about/about';
import { CalculatorPage } from '../calculator/calculator';
import { SettingsPage } from '../settings/settings';
import { Field } from '../../providers/field';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  // @ViewChild(Slides) slides: Slides;
  // map: Map<any, any>;
  public fields:Object[];

  constructor(public navCtrl: NavController, public popoverCtrl: PopoverController, private fieldProvider: Field) {
    this.fields = this.fieldProvider.fields;
    console.log(this.fields);
    // Set public access token
    // mapboxgl.accessToken = 'pk.eyJ1IjoiY29va2llY29va3NvbiIsImEiOiJjaXp6b3dvZnEwMDNqMnFsdTdlbmJtcHY0In0.OeHfq5_gzEIW13JzzsZJEA';
  }


  /*ngOnInit() {
    // Enable pager on slide carousel
    this.slides.pager = true;
    // Create map instance
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/satellite-v9',
      zoom: 12,
      center: [-4.146236, 50.373528]
    });
  }*/

  addField() {
    this.navCtrl.push(FieldAddPage);
  }

  viewField() {
    this.navCtrl.push(FieldDetailPage);
  }

  presentPopover(touchEvent) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: touchEvent
    });
  }

}

import { ViewController, App } from 'ionic-angular';

@Component({
  template: `
    <ion-list>
      <button ion-item (click)="about()">About</button>
      <button ion-item (click)="settings()">Settings</button>
      <button ion-item (click)="calculator()">Calculator</button>
      <button ion-item (click)="export()">Export Data</button>
    </ion-list>
  `
})
export class PopoverPage {

  constructor(public viewCtrl: ViewController, public appCtrl: App) {}

  about() {
    this.viewCtrl.dismiss();
    this.appCtrl.getRootNav().push(AboutPage);
  }

  settings() {
    this.viewCtrl.dismiss();
    this.appCtrl.getRootNav().push(SettingsPage);
  }

  calculator() {
    this.viewCtrl.dismiss();
    this.appCtrl.getRootNav().push(CalculatorPage);
  }

  export() {
    this.viewCtrl.dismiss();
    // Export data here
  }

}