import { NgModule } from '@angular/core';
import { SpreadAddPage } from './spread-add';
import { IonicPageModule } from 'ionic-angular';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
    declarations: [SpreadAddPage],
    imports: [IonicPageModule.forChild(SpreadAddPage), PipesModule]
})
export class SpreadAddPageModule {}