import { Component } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';
import { ViewChild } from '@angular/core';

import { Strings } from '../../providers/strings';
import { Settings } from '../../providers/settings';
import { CalcCore } from '../../providers/calc-core';

/*
  Generated class for the Calculator page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-calculator',
  templateUrl: 'calculator.html'
})
export class CalculatorPage {
  @ViewChild(Slides) slides: Slides;
  private strings: any;
  private units: string;
  private customManureList: Object[];
  private cropAvailable: Object;
  private manureCosts: Object;
  private crapPicture: String;
  
  private season: string;
  private soilType: string;
  private newCropType: string;
  private manureType: string;
  private manureQuality:string;
  private manureApplicationType: string;
  private manureDensity: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private stringsProvider: Strings,
    private settingsProvider: Settings,
    private calcCore: CalcCore
  ) {
    // Load strings
    this.strings = stringsProvider.data;
    // Load units
    this.units = settingsProvider.units;
    // Get custom manure
    this.customManureList = settingsProvider.customManure;
    // Default to half way for density
    this.manureDensity = 50;
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
    this.manureDensity = this.strings.rangeMax[this.manureType] / 2;
  }

  calculate() {
    // Perform calculations based on inputs
    this.cropAvailable = this.calcCore.calculateNutrients(
      this.manureType,
      this.manureDensity,
      this.manureQuality,
      this.season,
      this.newCropType,
      this.soilType,
      this.manureApplicationType,
      0,
      0
    );
    // Calculate manure costs
    this.manureCosts = [
      this.calcCore.getCostStringFromNutrient(0, this.cropAvailable, 1),
      this.calcCore.getCostStringFromNutrient(1, this.cropAvailable, 1),
      this.calcCore.getCostStringFromNutrient(2, this.cropAvailable, 1)
    ];
    // Select image
    this.crapPicture = this.calcCore.findImage(this.manureType, this.manureDensity);
  }

}
