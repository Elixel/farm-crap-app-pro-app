import { Component } from '@angular/core';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import { Map } from 'mapbox-gl';
import { NavController, NavParams } from 'ionic-angular';
import { SpreadAddPage } from '../spread-add/spread-add';

/*
  Generated class for the FieldDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-field-detail',
  templateUrl: 'field-detail.html'
})
export class FieldDetailPage {
  map: Map<any, any>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // Set public access token
    mapboxgl.accessToken = 'pk.eyJ1IjoiY29va2llY29va3NvbiIsImEiOiJjaXp6b3dvZnEwMDNqMnFsdTdlbmJtcHY0In0.OeHfq5_gzEIW13JzzsZJEA';
  }

  ngOnInit() {
    // Create map instance
    /*this.map = new mapboxgl.Map({
      container: 'map-detail',
      style: 'mapbox://styles/mapbox/satellite-v9',
      zoom: 12,
      center: [-4.146236, 50.373528]
    });*/
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FieldDetailPage');
  }

  addSpreadPressed() {
    this.navCtrl.push(SpreadAddPage);
  }

}
