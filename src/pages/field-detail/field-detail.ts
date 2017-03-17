import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SpreadAddPage } from '../spread-add/spread-add';

import { Field } from '../../providers/field';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private fieldProvider: Field) {
    // Get field data
    this.field = this.fieldProvider.fields[navParams.data.fieldIndex];
  }

  addSpreadPressed(fieldIndex) {
    this.navCtrl.push(SpreadAddPage, {
      fieldIndex: this.navParams.data.fieldIndex
    });
  }

}
