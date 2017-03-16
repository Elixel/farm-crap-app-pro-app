import { Component, ViewChild } from '@angular/core';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController, NavParams, Slides } from 'ionic-angular';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import TurfArea from '@turf/area';
import TurfBbox from '@turf/bbox';

import { Field } from '../../providers/field';
import { Settings } from '../../providers/settings';
import { Strings } from '../../providers/strings';
import { CalcCore } from '../../providers/calc-core';

/*
  Generated class for the FieldEdit page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-field-edit',
  templateUrl: 'field-edit.html'
})
export class FieldEditPage {
  field: any;

  @ViewChild(Slides) slides: Slides;
  map: any;
  draw: any;
  strings: Object;

  // Field Details
  polygon: any;
  private basicDetailsForm: FormGroup;
  private soilDetailsForm: FormGroup;
  private cropDetailsForm: FormGroup;

  // Summary details
  private cropRequirementsSupply: Object;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private fieldProvider: Field,
    private settingsProvider:Settings,
    private stringsProvider: Strings,
    private calcCore: CalcCore
  ) {
    // Set public access token
    mapboxgl.accessToken = 'pk.eyJ1IjoiY29va2llY29va3NvbiIsImEiOiJjaXp6b3dvZnEwMDNqMnFsdTdlbmJtcHY0In0.OeHfq5_gzEIW13JzzsZJEA';
    // Get field data
    this.field = this.fieldProvider.fields[this.navParams.data.fieldIndex];
    // Create Basic Details Form
    this.basicDetailsForm = this.formBuilder.group({
      name: [this.field.name, Validators.required],
      hectares: [this.field.hectares, Validators.required]
    });
    // Create Soil Details Form
    this.soilDetailsForm = this.formBuilder.group({
      soilType: [this.field.soilType, Validators.required],
      organicManures: [this.field.organicManures],
      soilTestP: [this.field.soilTestP],
      soilTestK: [this.field.soilTestK]
    });
    // Create Crop Details Form
    this.cropDetailsForm = this.formBuilder.group({
      grassGrown: [this.field.grassGrown],
      oldCropType: [this.field.oldCropType, Validators.required],
      newCropType: [this.field.newCropType, Validators.required]
    });
    // Load strings
    this.strings = stringsProvider.data;
  }

  ngOnInit() {
    // Create map
    this.map = new mapboxgl.Map({
      container: 'map-edit',
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
    // Get existing field polygon
    this.polygon = this.field.polygon;
    this.map.on('load', () => {
      // Add field to draw
      this.draw.set(this.polygon);
      // Calculate field boundaries
      let bounds = TurfBbox(this.polygon);
      // Contain map within boundaries
      this.map.fitBounds(bounds, {
        padding: 50
      });
    });
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
    // Get drawn polygons
    let featureCollection = draw.getAll();
    if (featureCollection.features.length > 0) {
      // Get area size in hectares (rounded to two decimal places)
      let squareMetres = TurfArea(featureCollection);
      let hectares = squareMetres / 10000;
      let roundedArea = Math.round(hectares * 100) / 100;
      // Save polygon shape
      this.polygon = featureCollection.features;
      // Update hectares form field for next view
      this.basicDetailsForm.get('hectares').setValue(roundedArea);
    } else {
      // Reset values
      this.polygon = null;
      this.basicDetailsForm.get('hectares').setValue(null);
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

  savePressed() {
    // Create field object
    let field = {
      polygon: this.polygon,
      name: this.basicDetailsForm.value.name,
      hectares: this.basicDetailsForm.value.hectares,
      soilType: this.soilDetailsForm.value.soilType,
      organicManures: this.soilDetailsForm.value.organicManures,
      soilTestP: this.soilDetailsForm.value.soilTestP,
      soilTestK: this.soilDetailsForm.value.soilTestK,
      grassGrown: this.cropDetailsForm.value.grassGrown,
      oldCropType: this.cropDetailsForm.value.oldCropType,
      newCropType: this.cropDetailsForm.value.newCropType
    };
    // Edit field in fields list
    this.fieldProvider.set(field, this.navParams.data.fieldIndex);
    // Navigate back to home
    this.navCtrl.pop();
  }

  slideChanged() {
    // If last slide
    if (this.slides.isEnd()) {
      // Get and display crop supply/requirements
      this.cropRequirementsSupply = this.calcCore.getCropRequirementsSupply(
        this.settingsProvider.rainfall,
        this.cropDetailsForm.value.newCropType,
        this.soilDetailsForm.value.soilType,
        this.cropDetailsForm.value.oldCropType,
        this.soilDetailsForm.value.organicManures,
        this.soilDetailsForm.value.soilTestP,
        this.soilDetailsForm.value.soilTestK,
        this.cropDetailsForm.value.grassGrown
      );
    }
  }

}