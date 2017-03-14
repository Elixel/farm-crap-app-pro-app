import { Component } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';
import { ViewChild } from '@angular/core';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import TurfArea from '@turf/area';

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
  map: any;
  draw: any;

  polygon: any;
  hectares: number;
  name: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // Set public access token
    mapboxgl.accessToken = 'pk.eyJ1IjoiY29va2llY29va3NvbiIsImEiOiJjaXp6b3dvZnEwMDNqMnFsdTdlbmJtcHY0In0.OeHfq5_gzEIW13JzzsZJEA';
  }

  ngOnInit() {
    // Create map
    this.map = new mapboxgl.Map({
      container: 'map-add',
      style: 'mapbox://styles/mapbox/satellite-v9',
      zoom: 12,
      center: [-4.146236, 50.373528]
    });
    // Create draw tools
    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
          polygon: true,
          trash: true
      }
    });
    // Add draw tools to map
    this.map.addControl(this.draw);
    // When a polygon is created
    this.map.on('draw.create', () => {
      this.calculatePolygons(this.draw);
    });
    // When a polygon is removed
    this.map.on('draw.delete', () => {
      this.calculatePolygons(this.draw);
    });
  }

  // Calculates the area within the drawn polygon(s)
  calculatePolygons(draw) {
    let featureCollection = draw.getAll();
    // Get area size
    if (featureCollection.features.length > 0) {
      let squareMetres = TurfArea(featureCollection);
      let hectares = squareMetres / 10000;
      let roundedArea = Math.round(hectares * 100) / 100;
      this.polygon = featureCollection.features;
      this.hectares = roundedArea;
    } else {
      this.polygon = null;
      this.hectares = null;
    }
  }

  // Previous button handler
  prevPressed() {
    this.slides.slidePrev();
  }

  // Next button handler
  nextPressed() {
    this.slides.slideNext();
  }

  // Finish button handler
  finishPressed() {
    this.navCtrl.pop();
  }

}
