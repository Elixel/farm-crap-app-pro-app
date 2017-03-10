import { Component } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';
import { ViewChild } from '@angular/core';

/*
  Generated class for the Calculator page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-calculator',
  templateUrl: 'calculator.html'
})
export class CalculatorPage {
  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad CalculatorPage');
  }

  // Previous button handler
  prevPressed() {
    this.slides.slidePrev();
  }

  // Next button handler
  nextPressed() {
    this.slides.slideNext();
  }

}
