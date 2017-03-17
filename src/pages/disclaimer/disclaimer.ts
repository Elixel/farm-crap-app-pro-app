import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Settings } from '../../providers/settings';

/*
  Generated class for the Disclaimer page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-disclaimer',
  templateUrl: 'disclaimer.html'
})
export class DisclaimerPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private settingsProvider:Settings) {}

  agree() {
    // Accepted disclaimer, store flag so it doesn't show again
    this.settingsProvider.disclaimerAccepted = true;
    // Hide modal
    this.viewCtrl.dismiss();
  }

}
