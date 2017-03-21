import { Component } from '@angular/core';
import { ViewController, App } from 'ionic-angular';

import { AboutPage } from '../about/about';
import { SettingsPage } from '../settings/settings';
import { CalculatorPage } from '../calculator/calculator';
import { CalcCore } from '../../providers/calc-core';
import { Field } from '../../providers/field';

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

  constructor(
    public viewCtrl: ViewController,
    public appCtrl: App,
    private calcCore: CalcCore,
    private fieldProvider: Field
  ) {}

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
    let csvData = this.calcCore.toCSV(this.fieldProvider.fields);
    // Create csv file from data

    // Share csv file via email

  }

}