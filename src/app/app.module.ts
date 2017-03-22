// Core
import { DatePipe } from '@angular/common';
import 'intl'; // iOS 9 support for DatePipe
import 'intl/locale-data/jsonp/en'; // iOS 9 support for DatePipe
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

// App Specific
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { PopoverPage } from '../pages/home/home-popover';
import { FieldAddPage } from '../pages/field-add/field-add';
import { FieldDetailPage } from '../pages/field-detail/field-detail';
import { AboutPage } from '../pages/about/about';
import { CalculatorPage } from '../pages/calculator/calculator';
import { SettingsPage } from '../pages/settings/settings';
import { DisclaimerPage } from '../pages/disclaimer/disclaimer';
import { FieldEditPage } from '../pages/field-edit/field-edit';
import { SpreadAddPage } from '../pages/spread-add/spread-add';
import { SpreadEditPage } from '../pages/spread-edit/spread-edit';
import { ManureAddPage } from '../pages/manure-add/manure-add';
import { ManureEditPage } from '../pages/manure-edit/manure-edit';
import { Field } from '../providers/field';
import { Settings } from '../providers/settings';
import { Strings } from '../providers/strings';
import { CalcCore } from '../providers/calc-core';
import { KeysPipe } from '../pipes/keys';
import { orderBy } from '../pipes/orderBy';

// External Dependencies
import { LocalStorageModule, LocalStorageService } from 'angular-2-local-storage';
import 'chart.js/src/chart.js';
import { ChartsModule } from 'ng2-charts/ng2-charts';

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
    KeysPipe,
    orderBy
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    LocalStorageModule.withConfig({
      prefix: 'fca',
      storageType: 'localStorage'
    }),
    ChartsModule
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
  Strings,
  DatePipe]
})
export class AppModule {}
