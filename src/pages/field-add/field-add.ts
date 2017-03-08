import { Component } from '@angular/core';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import { Map } from 'mapbox-gl';
import { NavController, NavParams, Slides } from 'ionic-angular';
import { ViewChild } from '@angular/core';

/*
  Generated class for the FieldAdd page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-field-add',
  templateUrl: 'field-add.html'
})
export class FieldAddPage {
  @ViewChild(Slides) slides: Slides;
  map: Map<any, any>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // Set public access token
    mapboxgl.accessToken = 'pk.eyJ1IjoiY29va2llY29va3NvbiIsImEiOiJjaXp6b3dvZnEwMDNqMnFsdTdlbmJtcHY0In0.OeHfq5_gzEIW13JzzsZJEA';
  }

  ngOnInit() {
    // Enable pager on slide carousel
    this.slides.pager = true;
    // Create map instance
    this.map = new mapboxgl.Map({
      container: 'map-add',
      style: 'mapbox://styles/mapbox/satellite-v9',
      zoom: 12,
      center: [-4.146236, 50.373528]
    });
  }

  // Previous button
  prev() {
    this.slides.slidePrev();
  }

  // Next button
  next() {
    this.slides.slideNext();
  }

  addField() {
    this.navCtrl.pop();
  }

}
