import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ManureAddPage } from '../manure-add/manure-add';
import { ManureEditPage } from '../manure-edit/manure-edit';
import { Settings } from '../../providers/settings';

/*
  Generated class for the Settings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  units: string;
  rainfall: string;
  fertiliserCostNitrogen: number;
  fertiliserCostPhosphorous: number;
  fertiliserCostPotassium: number;
  customManure: Object[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public settingsProvider:Settings) {
    this.units = settingsProvider.units;
    this.rainfall = settingsProvider.rainfall;
    this.fertiliserCostNitrogen = settingsProvider.fertiliserCostNitrogen;
    this.fertiliserCostPhosphorous = settingsProvider.fertiliserCostPhosphorous;
    this.fertiliserCostPotassium = settingsProvider.fertiliserCostPotassium;
    this.customManure = settingsProvider.customManure;
  }

  setUnits(newUnits) {
    this.settingsProvider.units = newUnits;
  }

  setRainfall(newRainfall) {
    this.settingsProvider.rainfall = newRainfall;
  }

  setFertiliserCostNitrogen(newFertiliserCostNitrogen) {
    this.settingsProvider.fertiliserCostNitrogen = newFertiliserCostNitrogen;
  }

  setFertiliserCostPhosphorous(newFertiliserCostPhosphorous) {
    this.settingsProvider.fertiliserCostPhosphorous = newFertiliserCostPhosphorous;
  }

  setFertiliserCostPotassium(newFertiliserCostPotassium) {
    this.settingsProvider.fertiliserCostPotassium = newFertiliserCostPotassium;
  }

  addCustomManurePressed() {
    this.navCtrl.push(ManureAddPage);
  }

  editCustomManure(index) {
    this.navCtrl.push(ManureEditPage, {
      customManureIndex: index
    });
  }

  deleteCustomManure(index) {
    this.settingsProvider.deleteCustomManure(index);
  }

}
