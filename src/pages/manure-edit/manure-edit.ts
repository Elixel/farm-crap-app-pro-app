import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Settings } from '../../providers/settings';

/*
  Generated class for the ManureEdit page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-manure-edit',
  templateUrl: 'manure-edit.html'
})
export class ManureEditPage {
  name: string;
  nitrogenContent: number;
  phosphorousContent: number;
  potassiumContent: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public settingsProvider:Settings) {
    let manure: any = settingsProvider.customManure[navParams.data.customManureIndex];
    this.name = manure.name;
    this.nitrogenContent = manure.nitrogenContent;
    this.phosphorousContent = manure.phosphorousContent;
    this.potassiumContent = manure.potassiumContent;
  }

  savePressed() {
    // Overwrite existing manure at this index
    this.settingsProvider.setCustomManure(this.navParams.data.customManureIndex, {
      name: this.name,
      nitrogenContent: this.nitrogenContent,
      phosphorousContent: this.phosphorousContent,
      potassiumContent: this.potassiumContent
    });
    // Go back to settings
    this.navCtrl.pop();
  }

}
