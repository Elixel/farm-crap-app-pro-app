import { Component } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';
import { ViewChild } from '@angular/core';

import { Field } from '../../providers/field';
import { Strings } from '../../providers/strings';
import { Settings } from '../../providers/settings';
import { CalcCore } from '../../providers/calc-core';

/*
  Generated class for the SpreadAdd page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-spread-add',
  templateUrl: 'spread-add.html'
})
export class SpreadAddPage {
  private field: any;
  @ViewChild(Slides) slides: Slides;
  private strings: any;
  private units: string;
  private customManureList: Object[];
  private cropRequirementsSupply: Object;
  private cropAvailable: Object;
  private manureCosts: Object;
  private crapPicture: String;
  private kilogramHectareToUnitsAcre: Function;

  private spreadDate: string;
  private manureType: string;
  private manureQuality:string;
  private manureApplicationType: string;
  private manureDensity: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private stringsProvider: Strings,
    private fieldProvider: Field,
    private settingsProvider: Settings,
    private calcCore: CalcCore
  ) {
    // Get field data
    this.field = fieldProvider.fields[navParams.data.fieldIndex];
    // Default to todays date for new spreading
    this.spreadDate = new Date().toISOString();
    // Load strings
    this.strings = stringsProvider.data;
    // Load units
    this.units = settingsProvider.units;
    // Default to half way for density
    this.manureDensity = 50;
    // Get custom manure
    this.customManureList = settingsProvider.customManure;
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
    this.manureDensity = this.strings.rangeMax[this.settingsProvider.units][this.manureType] / 2;
  }

  calculate() {
    let manureDensity;
    // Convert back from imperial units
    if (this.units === 'imperial') {
      if (this.strings.units[this.units].type[this.manureType] === 'gallons') {
        manureDensity = this.calcCore.gallonsAcreToMetresCubedHectare(this.manureDensity);
      } else if (this.strings.units[this.units].type[this.manureType] === 'tons') {
        manureDensity = this.calcCore.imperialTonToMetricTon(this.manureDensity);
      }
    } else {
      // No conversion required
      manureDensity = this.manureDensity;
    }
    // Perform calculations based on inputs
    this.cropAvailable = this.calcCore.calculateNutrients(
      this.manureType,
      manureDensity,
      this.manureQuality,
      this.calcCore.getSeason(new Date(this.spreadDate).getMonth() + 1),
      this.field.newCropType,
      this.field.soilType,
      this.manureApplicationType,
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
    this.crapPicture = this.calcCore.findImage(this.manureType, manureDensity);
  }

  // Add button handler
  addPressed() {
    let manureDensity;
    // Convert back from imperial units
    if (this.units === 'imperial') {
      if (this.strings.units[this.units].type[this.manureType] === 'gallons') {
        manureDensity = this.calcCore.gallonsAcreToMetresCubedHectare(this.manureDensity);
      } else if (this.strings.units[this.units].type[this.manureType] === 'tons') {
        manureDensity = this.calcCore.imperialTonToMetricTon(this.manureDensity);
      }
    } else {
      // No conversion required
      manureDensity = this.manureDensity;
    }
    // Create spread Object
    let spread = {
      spreadDate: this.spreadDate,
      manureType: this.manureType,
      manureQuality: this.manureQuality,
      manureApplicationType: this.manureApplicationType,
      manureDensity: manureDensity
    };
    // Add spread to field spread list
    this.fieldProvider.addSpread(this.navParams.data.fieldIndex, spread);
    // Navigate back to home
    this.navCtrl.pop();
  }

}
