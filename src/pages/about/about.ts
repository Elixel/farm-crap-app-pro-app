import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { DisclaimerPage } from '../disclaimer/disclaimer';

/*
  Generated class for the About page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl:ModalController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
  }

  showDisclaimerModal() {
    let disclaimerModal = this.modalCtrl.create(DisclaimerPage);
    disclaimerModal.present();
  }

}
