import { Component } from '@angular/core';
import { IonicPage, ViewController, App } from 'ionic-angular';

import { CalcCore } from '../../providers/calc-core';
import { Field } from '../../providers/field';

import { File } from '@ionic-native/file';
import { SocialSharing } from '@ionic-native/social-sharing';

@IonicPage()
@Component({
  template: `
    <ion-list>
      <button ion-item (click)="about()">About</button>
      <button ion-item (click)="settings()">Settings</button>
      <button ion-item (click)="calculator()">Calculator</button>
      <button ion-item (click)="export()">Export Data</button>
    </ion-list>
  `,
  providers: [
    File,
    SocialSharing
  ]
})
export class PopoverPage {

  constructor(
    public viewCtrl: ViewController,
    public appCtrl: App,
    private calcCore: CalcCore,
    private fieldProvider: Field,
    private file: File,
    private SocialSharing: SocialSharing
  ) {}

  about() {
    this.viewCtrl.dismiss();
    this.appCtrl.getRootNav().push('AboutPage');
  }

  settings() {
    this.viewCtrl.dismiss();
    this.appCtrl.getRootNav().push('SettingsPage');
  }

  calculator() {
    this.viewCtrl.dismiss();
    this.appCtrl.getRootNav().push('CalculatorPage');
  }

  export() {
    // Export data here
    let csvData = this.calcCore.toCSV(this.fieldProvider.fields);
    // Create/overwrite csv file from data and write to iOS tempDirectory
    this.file.writeFile(this.file.tempDirectory, 'fields.csv', csvData, {replace: true}) 
    .then((fileEntry) => {
      // Check user can share via email
      this.SocialSharing.canShareViaEmail().then(() => {
        // Share csv file via email
        this.SocialSharing.shareViaEmail('', 'From your Crap Calculator', [], [], [], fileEntry.nativeURL);
      }, () => {
        // Try sharing using the share sheet
        this.SocialSharing.share('From your Crap Calculator', '', fileEntry.nativeURL);
      });
    }, (error) => {
      console.error(error);
    });
    // Hide popover
    this.viewCtrl.dismiss();
  }

}