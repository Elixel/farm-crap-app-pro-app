import { NgModule } from '@angular/core';
import { DisclaimerPage } from './disclaimer';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
    declarations: [DisclaimerPage],
    imports: [IonicPageModule.forChild(DisclaimerPage)]
})
export class DisclaimerPageModule {}