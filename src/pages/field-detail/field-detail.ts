import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SpreadAddPage } from '../spread-add/spread-add';
import { SpreadEditPage } from '../spread-edit/spread-edit';

import { Field } from '../../providers/field';
import { Strings } from '../../providers/strings';

/*
  Generated class for the FieldDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-field-detail',
  templateUrl: 'field-detail.html'
})
export class FieldDetailPage {
  field: any;
  fieldIndex: number;
  
  strings: Object;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fieldProvider: Field,
    private stringsProvider: Strings
  ) {
    // Get field data
    this.field = this.fieldProvider.fields[navParams.data.fieldIndex];
    // Load strings
    this.strings = stringsProvider.data;
  }

  addSpreadPressed() {
    this.navCtrl.push(SpreadAddPage, {
      fieldIndex: this.navParams.data.fieldIndex
    });
  }

  editSpreadPressed(spreadIndex) {
    this.navCtrl.push(SpreadEditPage, {
      fieldIndex: this.navParams.data.fieldIndex,
      spreadIndex: spreadIndex
    });
  }

  deleteSpreadPressed(spreadIndex) {
    this.fieldProvider.deleteSpread(this.navParams.data.fieldIndex, spreadIndex);
  }

}
