// Core
import { DatePipe } from '@angular/common';
import 'intl'; // iOS 9 support for DatePipe
import 'intl/locale-data/jsonp/en'; // iOS 9 support for DatePipe
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

// Ionic Native
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { File } from '@ionic-native/file';
import { SocialSharing } from '@ionic-native/social-sharing';

// App Specific
import { MyApp } from './app.component';
import { Field } from '../providers/field';
import { Settings } from '../providers/settings';
import { Strings } from '../providers/strings';
import { CalcCore } from '../providers/calc-core';

// External Dependencies
import { LocalStorageModule, LocalStorageService } from 'angular-2-local-storage';
import 'chart.js/src/chart.js';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    LocalStorageModule.withConfig({
      prefix: 'fca',
      storageType: 'localStorage'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [{
    provide: ErrorHandler,
    useClass: IonicErrorHandler
  },
  StatusBar,
  SplashScreen,
  File,
  SocialSharing,
  Field,
  LocalStorageService,
  Settings,
  CalcCore,
  Strings,
  DatePipe]
})
export class AppModule {}
