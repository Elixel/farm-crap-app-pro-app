import { Component } from '@angular/core';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import { Map } from 'mapbox-gl';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  map: Map<any, any>;

  constructor(public navCtrl: NavController) {
    // Set public access token
    mapboxgl.accessToken = 'pk.eyJ1IjoiY29va2llY29va3NvbiIsImEiOiJjaXp6b3dvZnEwMDNqMnFsdTdlbmJtcHY0In0.OeHfq5_gzEIW13JzzsZJEA';
  }

  ngOnInit() {
    // Create map instance
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/satellite-v9',
      zoom: 12,
      center: [-4.146236, 50.373528]
    });
  }

}
