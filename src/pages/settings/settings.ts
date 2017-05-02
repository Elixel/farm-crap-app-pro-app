import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ItemSliding } from 'ionic-angular';
import { Settings } from '../../providers/settings';

@IonicPage({
  defaultHistory: ['HomePage'],
  segment: 'settings'
})
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public settingsProvider:Settings, private alertCtrl: AlertController) {
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
    this.navCtrl.push('ManureAddPage');
  }

  editCustomManure(index) {
    this.navCtrl.push('ManureEditPage', {
      customManureIndex: index
    });
  }

  deleteCustomManure(slidingItem: ItemSliding, index) {
    ;
    let deleted = this.settingsProvider.deleteCustomManure(index);
    if (!deleted) {
      // Delete was unsuccessful, manure is being used in a spread
      let alert = this.alertCtrl.create({
        title: 'Cannot Delete Manure',
        subTitle: 'This custom manure is being used in a spread, please remove the spread before deleting.',
        buttons: ['Ok']
      });
      alert.present();
      // Close sliding drawer
      slidingItem.close();
    } 
  }

}
