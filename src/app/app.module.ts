import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage, PopoverPage } from '../pages/home/home';
import { FieldAddPage } from '../pages/field-add/field-add';
import { FieldDetailPage } from '../pages/field-detail/field-detail';
import { AboutPage } from '../pages/about/about';
import { CalculatorPage } from '../pages/calculator/calculator';
import { SettingsPage } from '../pages/settings/settings';
import { DisclaimerPage } from '../pages/disclaimer/disclaimer';
import { FieldEditPage, KeysPipe } from '../pages/field-edit/field-edit';
import { SpreadAddPage } from '../pages/spread-add/spread-add';
import { SpreadEditPage } from '../pages/spread-edit/spread-edit';
import { ManureAddPage } from '../pages/manure-add/manure-add';
import { ManureEditPage } from '../pages/manure-edit/manure-edit';
import { Field } from '../providers/field';
import { Settings } from '../providers/settings';
import { LocalStorageModule, LocalStorageService } from 'angular-2-local-storage';
import { Strings } from '../providers/strings';
import { CalcCore } from '../providers/calc-core';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    FieldAddPage,
    FieldDetailPage,
    PopoverPage,
    AboutPage,
    CalculatorPage,
    SettingsPage,
    DisclaimerPage,
    FieldEditPage,
    SpreadAddPage,
    SpreadEditPage,
    ManureAddPage,
    ManureEditPage,
    KeysPipe
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    LocalStorageModule.withConfig({
      prefix: 'fca',
      storageType: 'localStorage'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    FieldAddPage,
    FieldDetailPage,
    PopoverPage,
    AboutPage,
    CalculatorPage,
    SettingsPage,
    DisclaimerPage,
    FieldEditPage,
    SpreadAddPage,
    SpreadEditPage,
    ManureAddPage,
    ManureEditPage
  ],
  providers: [{
    provide: ErrorHandler,
    useClass: IonicErrorHandler
  },
  Field,
  LocalStorageService,
  Settings,
  CalcCore,
  Strings]
})
export class AppModule {}
