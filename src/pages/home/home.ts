import { Component } from '@angular/core';
import { NavController, PopoverController, ItemSliding, ModalController } from 'ionic-angular';

import { Field } from '../../providers/field';

import { FieldAddPage } from '../field-add/field-add';
import { FieldEditPage } from '../field-edit/field-edit';
import { FieldDetailPage } from '../field-detail/field-detail';
import { DisclaimerPage } from '../disclaimer/disclaimer';
import { AboutPage } from '../about/about';
import { CalculatorPage } from '../calculator/calculator';
import { SettingsPage } from '../settings/settings';
import { Settings } from '../../providers/settings';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public fields:Object[];

  constructor(public navCtrl: NavController, public popoverCtrl: PopoverController, private fieldProvider: Field, private settingsProvider:Settings, private modalCtrl:ModalController) {
    // Get fields
    this.fields = this.fieldProvider.fields;
    // Show disclaimer if not accepted
    if (!settingsProvider.disclaimerAccepted) {
      this.showDisclaimerModal();
    }
  }

  deleteField(fieldIndex) {
    this.fieldProvider.deleteField(fieldIndex);
  }

  addField() {
    this.navCtrl.push(FieldAddPage);
  }

  editField(slidingItem: ItemSliding, fieldIndex) {
    // Close sliding drawer
    slidingItem.close();
    // Go to edit view
    this.navCtrl.push(FieldEditPage, {
      fieldIndex: fieldIndex
    })
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

  showDisclaimerModal() {
    let disclaimerModal = this.modalCtrl.create(DisclaimerPage);
    disclaimerModal.present();
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