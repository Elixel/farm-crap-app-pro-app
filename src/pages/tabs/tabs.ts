import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  home = 'HomePage';
  calculator = 'CalculatorPage';
  settings = 'SettingsPage';

  constructor() {}

}
