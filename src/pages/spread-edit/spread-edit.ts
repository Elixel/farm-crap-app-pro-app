import { Component } from '@angular/core';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController, NavParams, Slides } from 'ionic-angular';
import { ViewChild } from '@angular/core';

import { Field } from '../../providers/field';
import { Strings } from '../../providers/strings';
import { Settings } from '../../providers/settings';
import { CalcCore } from '../../providers/calc-core';

/*
  Generated class for the SpreadEdit page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-spread-edit',
  templateUrl: 'spread-edit.html'
})
export class SpreadEditPage {
  private field: any;
  private spread: any;
  @ViewChild(Slides) slides: Slides;
  private strings: any;
  private units: string;
  private customManureList: Object[];
  private cropRequirementsSupply: Object;
  private cropAvailable: Object;
  private manureCosts: Object;
  private crapPicture: String;
  private kilogramHectareToUnitsAcre: Function;

  private spreadForm: FormGroup;
  private manureDensity: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private stringsProvider: Strings,
    private fieldProvider: Field,
    private settingsProvider: Settings,
    private calcCore: CalcCore
  ) {
    // Get field data
    this.field = fieldProvider.fields[navParams.data.fieldIndex];
    // Get custom manure
    this.customManureList = settingsProvider.customManure;
    // Load strings
    this.strings = stringsProvider.data;
    // Load units
    this.units = settingsProvider.units;
    // Get spread data
    this.spread = this.field.spreads[navParams.data.spreadIndex];
    // Create Spread Details Form
    this.spreadForm = this.formBuilder.group({
      // Default to todays date for new spreading
      spreadDate: [this.spread.spreadDate, Validators.required],
      manureType: [this.spread.manureType, Validators.required],
      manureQuality: [this.spread.manureQuality, Validators.required],
      // Check if existing application type is there, if so then it is a required field unless manure type changes
      manureApplicationType: [this.spread.manureApplicationType, this.spread.manureApplicationType ? Validators.required : null],
    });
    // Convert units if imperial units
    if (this.units === 'imperial') {
      if (this.strings.units[this.units].type[this.spreadForm.value.manureType] === 'gallons') {
        this.manureDensity = this.calcCore.metresCubedHectareToGallonsAcre(this.spread.manureDensity);
      } else if (this.strings.units[this.units].type[this.spreadForm.value.manureType] === 'tons') {
        this.manureDensity = this.calcCore.metricTonToImperialTon(this.spread.manureDensity);
      }
    } else {
      // No conversion required
      this.manureDensity = this.spread.manureDensity;
    }
    // Get and display crop supply/requirements
    this.cropRequirementsSupply = this.calcCore.getCropRequirementsSupply(
      this.settingsProvider.rainfall,
      this.field.newCropType,
      this.field.soilType,
      this.field.oldCropType,
      this.field.organicManures,
      this.field.soilTestP,
      this.field.soilTestK,
      this.field.grassGrown
    );
    // Get converter helpers
    this.kilogramHectareToUnitsAcre = this.calcCore.kilogramHectareToUnitsAcre;
  }

  // Previous button handler
  prevPressed() {
    // Slide to values
    this.slides.slidePrev();
  }

  // Next button handler
  nextPressed() {
    // Perform calculations
    this.calculate();
    // Slide to calculated values
    this.slides.slideNext();
  }

  // Manure choice has changed, so update some ranges
  manureTypeChanged() {
    // Reset slider to half way
    this.manureDensity = this.strings.rangeMax[this.settingsProvider.units][this.spreadForm.value.manureType] / 2;
    // Clear form controls
    this.spreadForm.patchValue({manureQuality: '', manureApplicationType: ''});
    // Change Validators
    if (!this.strings.application[this.spreadForm.value.manureType]) { // If application is empty, do not require it
      this.spreadForm.controls['manureApplicationType'].setValidators(null);
    } else { // Application is not empty, require it
      this.spreadForm.controls['manureApplicationType'].setValidators([Validators.required]);
    }
    this.spreadForm.controls['manureApplicationType'].updateValueAndValidity();
  }

  calculate() {
    let manureDensity;
    // Convert back from imperial units
    if (this.units === 'imperial') {
      if (this.strings.units[this.units].type[this.spreadForm.value.manureType] === 'gallons') {
        manureDensity = this.calcCore.gallonsAcreToMetresCubedHectare(this.manureDensity);
      } else if (this.strings.units[this.units].type[this.spreadForm.value.manureType] === 'tons') {
        manureDensity = this.calcCore.imperialTonToMetricTon(this.manureDensity);
      }
    } else {
      // No conversion required
      manureDensity = this.manureDensity;
    }
    // Perform calculations based on inputs
    this.cropAvailable = this.calcCore.calculateNutrients(
      this.spreadForm.value.manureType,
      manureDensity,
      this.spreadForm.value.manureQuality,
      this.calcCore.getSeason(new Date(this.spreadForm.value.spreadDate).getMonth() + 1),
      this.field.newCropType,
      this.field.soilType,
      this.spreadForm.value.manureApplicationType,
      this.field.soilTestP,
      this.field.soilTestK
    );
    // Calculate manure costs
    this.manureCosts = [
      this.calcCore.getCostStringFromNutrient(0, this.cropAvailable, this.field.hectares),
      this.calcCore.getCostStringFromNutrient(1, this.cropAvailable, this.field.hectares),
      this.calcCore.getCostStringFromNutrient(2, this.cropAvailable, this.field.hectares)
    ];
    // Select image
    this.crapPicture = this.calcCore.findImage(this.spreadForm.value.manureType, manureDensity);
  }

  // Save button handler
  savePressed() {
    let manureDensity;
    // Convert back from imperial units
    if (this.units === 'imperial') {
      if (this.strings.units[this.units].type[this.spreadForm.value.manureType] === 'gallons') {
        manureDensity = this.calcCore.gallonsAcreToMetresCubedHectare(this.manureDensity);
      } else if (this.strings.units[this.units].type[this.spreadForm.value.manureType] === 'tons') {
        manureDensity = this.calcCore.imperialTonToMetricTon(this.manureDensity);
      }
    } else {
      // No conversion required
      manureDensity = this.manureDensity;
    }
    // Create spread Object
    let spread = {
      spreadDate: this.spreadForm.value.spreadDate,
      manureType: this.spreadForm.value.manureType,
      manureQuality: this.spreadForm.value.manureQuality,
      manureApplicationType: this.spreadForm.value.manureApplicationType,
      manureDensity: manureDensity
    };
    // Add spread to field spread list
    this.fieldProvider.setSpread(this.navParams.data.fieldIndex, this.navParams.data.spreadIndex, spread);
    // Navigate back to home
    this.navCtrl.pop();
  }

}
