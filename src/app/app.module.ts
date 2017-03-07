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
import { FieldEditPage } from '../pages/field-edit/field-edit';
import { SpreadAddPage } from '../pages/spread-add/spread-add';
import { SpreadEditPage } from '../pages/spread-edit/spread-edit';

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
    SpreadEditPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
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
    SpreadEditPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
