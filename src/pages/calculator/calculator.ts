import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { ViewChild } from '@angular/core';

import { Strings } from '../../providers/strings';
import { Settings } from '../../providers/settings';
import { CalcCore } from '../../providers/calc-core';

@IonicPage({
  defaultHistory: ['HomePage'],
  segment: 'calculator'
})
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
  
  private calculatorForm: FormGroup;
  private manureDensity: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
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
    // Create Calculator Form
    this.calculatorForm = this.formBuilder.group({
      // Default to todays date for new spreading
      season: ['', Validators.required],
      soilType: ['', Validators.required],
      newCropType: ['', Validators.required],
      manureType: ['', Validators.required],
      manureQuality: ['', Validators.required],
      manureApplicationType: ['', Validators.required]
    });
    // Default to half way for application rate
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
    this.manureDensity = this.strings.rangeMax[this.settingsProvider.units][this.calculatorForm.value.manureType] / 2;
    // Clear form controls
    this.calculatorForm.patchValue({manureQuality: '', manureApplicationType: ''});
    // Change Validators
    if (!this.strings.application[this.calculatorForm.value.manureType]) { // If application is empty, do not require it
      this.calculatorForm.controls['manureApplicationType'].setValidators(null);
    } else { // Application is not empty, require it
      this.calculatorForm.controls['manureApplicationType'].setValidators([Validators.required]);
    }
    this.calculatorForm.controls['manureApplicationType'].updateValueAndValidity();
  }

  calculate() {
    let manureDensity;
    // Convert back from imperial units
    if (this.units === 'imperial') {
      if (this.strings.units[this.units].type[this.calculatorForm.value.manureType] === 'gallons') {
        manureDensity = this.calcCore.gallonsAcreToMetresCubedHectare(this.manureDensity);
      } else if (this.strings.units[this.units].type[this.calculatorForm.value.manureType] === 'tons') {
        manureDensity = this.calcCore.imperialTonToMetricTon(this.manureDensity);
      }
    } else {
      // No conversion required
      manureDensity = this.manureDensity;
    }
    // Perform calculations based on inputs
    this.cropAvailable = this.calcCore.calculateNutrients(
      this.calculatorForm.value.manureType,
      manureDensity,
      this.calculatorForm.value.manureQuality,
      this.calculatorForm.value.season,
      this.calculatorForm.value.newCropType,
      this.calculatorForm.value.soilType,
      this.calculatorForm.value.manureApplicationType,
      0,
      0
    );
    // Calculate manure costs
    this.manureCosts = [
      this.calcCore.getCostStringFromNutrient(0, this.cropAvailable[1], 1),
      this.calcCore.getCostStringFromNutrient(1, this.cropAvailable[1], 1),
      this.calcCore.getCostStringFromNutrient(2, this.cropAvailable[1], 1)
    ];
    // Select image
    this.crapPicture = this.calcCore.findImage(this.calculatorForm.value.manureType, manureDensity);
  }

}
