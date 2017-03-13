import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Settings } from '../../providers/settings';

/*
  Generated class for the ManureAdd page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-manure-add',
  templateUrl: 'manure-add.html'
})
export class ManureAddPage {
  name: string;
  nitrogenContent: number;
  phosphorousContent: number;
  potassiumContent: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public settingsProvider:Settings) {}

  finishPressed() {
    // Add manure content to settings
    this.settingsProvider.addCustomManure({
      name: this.name,
      nitrogenContent: this.nitrogenContent,
      phosphorousContent: this.phosphorousContent,
      potassiumContent: this.potassiumContent
    });
    // Go back to settings
    this.navCtrl.pop();
  }

}
