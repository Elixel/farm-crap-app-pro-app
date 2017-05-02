import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Settings } from '../../providers/settings';

@IonicPage()
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
