import { NgModule } from '@angular/core';
import { PopoverPage } from './home-popover';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
    declarations: [PopoverPage],
    imports: [IonicPageModule.forChild(PopoverPage)]
})
export class PopoverPageModule {}