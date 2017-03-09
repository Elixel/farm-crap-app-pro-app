import { Component } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';
import { ViewChild } from '@angular/core';

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
  @ViewChild(Slides) slides: Slides;
  manureDensity = 1;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SpreadAddPage');
  }

  // Previous button handler
  prevPressed() {
    this.slides.slidePrev();
  }

  // Next button handler
  nextPressed() {
    this.slides.slideNext();
  }

  // Finish button handler
  finishPressed() {
    this.navCtrl.pop();
  }

}
