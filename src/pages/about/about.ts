import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

@IonicPage({
  defaultHistory: ['HomePage'],
  segment: 'about'
})
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl:ModalController
  ) {}

  showDisclaimerModal() {
    let disclaimerModal = this.modalCtrl.create('DisclaimerPage');
    disclaimerModal.present();
  }

}
