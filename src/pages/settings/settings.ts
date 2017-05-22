import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ItemSliding } from 'ionic-angular';
import { Settings } from '../../providers/settings';

import { CalcCore } from '../../providers/calc-core';
import { Field } from '../../providers/field';

import { File } from '@ionic-native/file';
import { SocialSharing } from '@ionic-native/social-sharing';

@IonicPage({
  defaultHistory: ['HomePage'],
  segment: 'settings'
})
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers: [
    File,
    SocialSharing
  ]
})
export class SettingsPage {
  units: string;
  rainfall: string;
  fertiliserCostNitrogen: number;
  fertiliserCostPhosphorous: number;
  fertiliserCostPotassium: number;
  customManure: Object[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public settingsProvider:Settings,
    private alertCtrl: AlertController,
    private calcCore: CalcCore,
    private fieldProvider: Field,
    private file: File,
    private SocialSharing: SocialSharing
  ) {
    this.units = settingsProvider.units;
    this.rainfall = settingsProvider.rainfall;
    this.fertiliserCostNitrogen = settingsProvider.fertiliserCostNitrogen;
    this.fertiliserCostPhosphorous = settingsProvider.fertiliserCostPhosphorous;
    this.fertiliserCostPotassium = settingsProvider.fertiliserCostPotassium;
    this.customManure = settingsProvider.customManure;
  }

  setUnits(newUnits) {
    this.settingsProvider.units = newUnits;
    // Reload tabs with new units
    this.navCtrl.parent.getByIndex(0).setRoot('HomePage');
    this.navCtrl.parent.getByIndex(1).setRoot('CalculatorPage');
  }

  setRainfall(newRainfall) {
    this.settingsProvider.rainfall = newRainfall;
    // Reload tabs with new settings
    this.navCtrl.parent.getByIndex(0).setRoot('HomePage');
    this.navCtrl.parent.getByIndex(1).setRoot('CalculatorPage');
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

  about() {
    this.navCtrl.push('AboutPage');
  }

  export() {
    // Export data here
    let csvData = this.calcCore.toCSV(this.fieldProvider.fields);
    // Create/overwrite csv file from data and write to iOS tempDirectory
    this.file.writeFile(this.file.tempDirectory, 'fields.csv', csvData, {replace: true}) 
    .then((fileEntry) => {
      // Check user can share via email
      this.SocialSharing.canShareViaEmail().then(() => {
        // Share csv file via email
        this.SocialSharing.shareViaEmail('', 'From your Crap Calculator', [], [], [], fileEntry.nativeURL);
      }, () => {
        // Try sharing using the share sheet
        this.SocialSharing.share('From your Crap Calculator', '', fileEntry.nativeURL);
      });
    }, (error) => {
      let alert = this.alertCtrl.create({
        title: 'Unable to export data',
        subTitle: 'Unable to write to temporary directory. Please try freeing up some space on your device and try again.',
        buttons: ['Ok']
      });
      alert.present();
    });
  }

}
