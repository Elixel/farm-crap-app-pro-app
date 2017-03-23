import { Component } from '@angular/core';
import { NavController, PopoverController, ItemSliding, ModalController } from 'ionic-angular';

import { Field } from '../../providers/field';

import { FieldAddPage } from '../field-add/field-add';
import { FieldEditPage } from '../field-edit/field-edit';
import { FieldDetailPage } from '../field-detail/field-detail';
import { DisclaimerPage } from '../disclaimer/disclaimer';
import { PopoverPage } from './home-popover';

import { Strings } from '../../providers/strings';
import { Settings } from '../../providers/settings';
import { CalcCore } from '../../providers/calc-core';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public fields:Object[];
  private units: string;
  private strings: any;
  private hectaresToAcres: Function;

  constructor(public navCtrl: NavController,
  public popoverCtrl: PopoverController,
  private fieldProvider: Field,
  private settingsProvider: Settings,
  private stringsProvider: Strings,
  private modalCtrl: ModalController,
  private calcCore: CalcCore) {
    // Get fields
    this.fields = this.fieldProvider.fields;
    // Show disclaimer if not accepted
    if (!settingsProvider.disclaimerAccepted) {
      this.showDisclaimerModal();
    }
    // Pre-load all JSON datasets
    calcCore.load();
    // Load strings
    this.strings = stringsProvider.data;
    // Load units
    this.units = settingsProvider.units;
    // Get converter helpers
    this.hectaresToAcres = calcCore.hectaresToAcres;
  }

  ionViewWillEnter() {
    // Re-load units
    this.units = this.settingsProvider.units;
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
