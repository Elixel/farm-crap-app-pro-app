import { Component, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.js';
import TurfArea from '@turf/area';
import TurfBbox from '@turf/bbox';

import { Field } from '../../providers/field';
import { Settings } from '../../providers/settings';
import { Strings } from '../../providers/strings';
import { CalcCore } from '../../providers/calc-core';

@IonicPage({
  defaultHistory: ['HomePage'],
  segment: 'field-edit/:fieldIndex'
})
@Component({
  selector: 'page-field-edit',
  templateUrl: 'field-edit.html'
})
export class FieldEditPage {
  private field: any;

  @ViewChild(Slides) slides: Slides;
  private map: any;
  private draw: any;
  private strings: Object;
  private units: string;
  private kilogramHectareToUnitsAcre: Function;
  private boundaryText: string;

  // Field Details
  private polygon: any;
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
    // Load units
    this.units = settingsProvider.units;
    // Create Basic Details Form
    this.basicDetailsForm = this.formBuilder.group({
      name: [this.field.name, Validators.required],
      hectares: [parseFloat((settingsProvider.units === 'imperial' ? this.calcCore.hectaresToAcres(this.field.hectares) : this.field.hectares).toFixed(2)), Validators.required]
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
    // Get converter helpers
    this.kilogramHectareToUnitsAcre = this.calcCore.kilogramHectareToUnitsAcre;
  }

  ngOnInit() {
    // Create map
    this.map = new mapboxgl.Map({
      container: 'map-edit',
      style: 'mapbox://styles/mapbox/satellite-v9',
      zoom: 3.75,
      center: [-4, 54]
    });
    // Create draw tools
    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
          polygon: true,
          trash: true
      }
    });
    // Get existing field polygon
    if (this.field.polygon) {
      this.polygon = this.field.polygon;
      this.map.on('load', () => {
        // Add field to draw
        this.draw.set(this.polygon);
        // Select polygon
        this.draw.changeMode('simple_select', {
          featureIds: [this.draw.getAll().features[0].id]
        });
        // Calculate field boundaries
        let bounds = TurfBbox(this.polygon);
        // Contain map within boundaries
        this.map.fitBounds(bounds, {
          padding: 50
        });
      });
    }
    // Add draw tools to map
    this.map.addControl(this.draw);
    this.boundaryText = 'If this best represents your field, click Next; else click delete and try again.';
    // Draw validation
    this.map.on('draw.modechange', (event) => {
      // Make sure the user hasn't exited prematurely
      let features = this.draw.getAll().features;
      if (features.length) {
        let isFeature = features[0].geometry.coordinates[0][0];
        // When a polygon has begun creation
        if (event.mode === 'draw_polygon') {
          // If user hasn't got a polygon drawn
          if (!isFeature) {
            this.boundaryText = 'Create the boundaries of your field below by creating points in a clockwise fashion.';
          // If there is already a polygon on the map
          } else {
            // Force back to simple select mode, do not allow the user to draw another polygon
            this.draw.changeMode('simple_select', {
              featureIds: [features[0].id]
            });
          }
        }
        // If user exited out without creating boundaries
        if (event.mode === 'simple_select' && !isFeature) {
          this.boundaryText = 'Select the draw field button on the map below to start creating your field boundaries.';
        }
        // If user tries to edit the polygon (not supported)
        if (event.mode === 'direct_select') {
          // Go back to normal selection for the polygon
          this.draw.changeMode('simple_select', {
            featureIds: [features[0].id]
          });
        }
      }
    });
    // When a polygon changes selection
    this.map.on('draw.selectionchange', (event) => {
      // If user deselects polygon
      if (!event.features.length) {
        // Re-select polygon
        setTimeout(() => {
          this.draw.changeMode('simple_select', {
            featureIds: [this.draw.getAll().features[0].id]
          });
        });
      }
    });
    // When a polygon is created
    this.map.on('draw.create', () => {
      this.calculatePolygons(this.draw);
      this.boundaryText = 'If this best represents your field, click Next; else click delete and try again.';
    });
    // When a polygon is removed
    this.map.on('draw.delete', () => {
      this.calculatePolygons(this.draw);
      this.boundaryText = 'Select the draw field button on the map below to start creating your field boundaries.';
    });
  }

  // Calculates the area within the drawn polygon(s)
  calculatePolygons(draw) {
    // Get drawn polygons
    let featureCollection = draw.getAll();
    if (featureCollection.features.length > 0) {
      // Get area size in hectares
      let squareMetres = TurfArea(featureCollection);
      let hectares = squareMetres / 10000;
      // Save polygon shape
      this.polygon = featureCollection.features;
      // Update hectares form field for next view
      this.basicDetailsForm.get('hectares').setValue(parseFloat((this.units === 'imperial' ? this.calcCore.hectaresToAcres(hectares) : hectares).toFixed(2)));
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
      // When in imperial units mode, hectares is stored as acres temporarily so we are doing the correct conversion here
      hectares: parseFloat(this.settingsProvider.units === 'imperial' ? this.calcCore.acresToHectares(this.basicDetailsForm.value.hectares) : this.basicDetailsForm.value.hectares),
      soilType: this.soilDetailsForm.value.soilType,
      organicManures: this.soilDetailsForm.value.organicManures,
      soilTestP: this.soilDetailsForm.value.soilTestP,
      soilTestK: this.soilDetailsForm.value.soilTestK,
      grassGrown: this.cropDetailsForm.value.grassGrown,
      oldCropType: this.cropDetailsForm.value.oldCropType,
      newCropType: this.cropDetailsForm.value.newCropType,
      spreads: this.field.spreads
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