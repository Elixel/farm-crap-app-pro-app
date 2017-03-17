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
  field: any;
  @ViewChild(Slides) slides: Slides;
  strings: Object;
  customManureList: Object[];
  cropRequirementsSupply: Object;

  spreadDate: string;
  manureType: string = 'cattle';
  manureQuality:string = 'dm2';
  manureApplicationType: string = 'splash-surface';
  manureDensity = 1;

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
    // Get custom manure
    this.customManureList = settingsProvider.customManure;
    // Get and display crop supply/requirements
    console.log(this.settingsProvider.rainfall,
      this.field.newCropType,
      this.field.soilType,
      this.field.oldCropType,
      this.field.organicManures,
      this.field.soilTestP,
      this.field.soilTestK,
      this.field.grassGrown);
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
  }

  // Previous button handler
  prevPressed() {
    this.slides.slidePrev();
  }

  // Next button handler
  nextPressed() {
    this.slides.slideNext();
    this.calculate();
  }

  calculate() {
    // Calculate season from spread date
    let season: string;
    switch (new Date(this.spreadDate).getMonth() + 1) {
      case 12:
      case 1:
      case 2:
        season = 'winter';
        break;
      case 3:
      case 4:
      case 5:
        season = 'spring';
        break;
      case 6:
      case 7:
      case 8:
        season = 'summer';
        break;
      case 9:
      case 10:
      case 11:
        season = 'winter';
        break;
    };
    
    // Perform calculations based on inputs
    let calc = this.calcCore.getNutrients(
      this.manureType,
      this.manureDensity,
      this.manureQuality,
      season,
      this.field.newCropType,
      this.field.soilType,
      this.manureApplicationType,
      this.field.soilTestP,
      this.field.soilTestK
    );

    // Spit out calculations to console
    console.log(calc);
  }

  // Finish button handler
  finishPressed() {
    this.navCtrl.pop();
  }

}
