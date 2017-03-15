import { Component, ViewChild } from '@angular/core';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController, NavParams, Slides } from 'ionic-angular';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import TurfArea from '@turf/area';
import TurfBbox from '@turf/bbox';

import { SoilNitrogenSupply } from '../../providers/soil-nitrogen-supply';
import { CropRequirements } from '../../providers/crop-requirements';
import { Field } from '../../providers/field';
import { Settings } from '../../providers/settings';
import { Strings } from '../../providers/strings';

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
  strings: Object[];
  soilTypeList: Object[];
  cropTypeList: Object[];
  cropRequirementsList: Object[];

  // Field Details
  polygon: any;
  private basicDetailsForm: FormGroup;
  private soilDetailsForm: FormGroup;
  private cropDetailsForm: FormGroup;

  // Summary details
  private requirementsNitrogen: number = 0;
  private requirementsPhosphorous: number = 0;
  private requirementsPotassium: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private soilNitrogenSupply: SoilNitrogenSupply,
    private formBuilder: FormBuilder,
    private cropRequirements: CropRequirements,
    private fieldProvider: Field,
    private settingsProvider:Settings,
    private stringsProvider: Strings
    ) {
    // Set public access token
    mapboxgl.accessToken = 'pk.eyJ1IjoiY29va2llY29va3NvbiIsImEiOiJjaXp6b3dvZnEwMDNqMnFsdTdlbmJtcHY0In0.OeHfq5_gzEIW13JzzsZJEA';

    // Get field data
    this.field = this.fieldProvider.fields[this.navParams.data.fieldIndex];

    // Create Basic Details Form
    this.basicDetailsForm = this.formBuilder.group({
      name: [this.field.name, Validators.required],
      hectares: [this.field.hectares, Validators.required]
    })

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
    stringsProvider.load()
    .then((result) => {
      this.strings = result;
    });

    // Load soil / crop types
    soilNitrogenSupply.load()
    .then((result) => {
      // Get soil types for 'low' rainfall (All options are the same, we are not considering the value yet)
      this.soilTypeList = result.choices[0].value.choices;
      // Get crop types for 'low' rainfall and 'sandyshallow' soil (All options are the same, we are not considering the value yet)
      this.cropTypeList = result.choices[0].value.choices[0].value.choices;
    });

    // Load crop requirements
    cropRequirements.load()
    .then((result) => {
      // Get crop types
      this.cropRequirementsList = result.choices;
    });
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
      // Calculate soil nitrogen supply for calculations
      let sns = this.soilNitrogenSupply.calculateSNS(this.settingsProvider.rainfall, this.soilDetailsForm.value.soilType, this.cropDetailsForm.value.oldCropType);
      // Update calculated values to view
      this.requirementsNitrogen = this.cropRequirements.getCropRequirements(this.cropDetailsForm.value.newCropType, 'nitrogen', this.soilDetailsForm.value.soilType, sns);
      this.requirementsPhosphorous = this.cropRequirements.getCropRequirements(this.cropDetailsForm.value.newCropType, 'phosphorous', this.soilDetailsForm.value.soilTestP, null);
      this.requirementsPotassium = this.cropRequirements.getCropRequirements(this.cropDetailsForm.value.newCropType, 'potassium', this.soilDetailsForm.value.soilTestK, null);
    }
  }

}
