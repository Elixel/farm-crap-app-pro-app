import { Component } from '@angular/core';
import { NavController, PopoverController } from 'ionic-angular';
import { FieldAddPage } from '../field-add/field-add';
import { FieldDetailPage } from '../field-detail/field-detail';
import { AboutPage } from '../about/about';
import { CalculatorPage } from '../calculator/calculator';
import { SettingsPage } from '../settings/settings';
import { Field } from '../../providers/field';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public fields:Object[];

  constructor(public navCtrl: NavController, public popoverCtrl: PopoverController, private fieldProvider: Field) {
    this.fields = this.fieldProvider.fields;
  }

  deleteField(fieldIndex) {
    this.fieldProvider.deleteField(fieldIndex);
  }

  addField() {
    this.navCtrl.push(FieldAddPage);
  }

  viewField(fieldIndex) {
    this.navCtrl.push(FieldDetailPage, {
      fieldIndex: fieldIndex
    });
  }

  presentPopover(touchEvent) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: touchEvent
    });
  }

}

import { ViewController, App } from 'ionic-angular';

@Component({
  template: `
    <ion-list>
      <button ion-item (click)="about()">About</button>
      <button ion-item (click)="settings()">Settings</button>
      <button ion-item (click)="calculator()">Calculator</button>
      <button ion-item (click)="export()">Export Data</button>
    </ion-list>
  `
})
export class PopoverPage {

  constructor(public viewCtrl: ViewController, public appCtrl: App) {}

  about() {
    this.viewCtrl.dismiss();
    this.appCtrl.getRootNav().push(AboutPage);
  }

  settings() {
    this.viewCtrl.dismiss();
    this.appCtrl.getRootNav().push(SettingsPage);
  }

  calculator() {
    this.viewCtrl.dismiss();
    this.appCtrl.getRootNav().push(CalculatorPage);
  }

  export() {
    this.viewCtrl.dismiss();
    // Export data here
  }

}