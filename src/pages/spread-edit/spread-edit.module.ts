import { NgModule } from '@angular/core';
import { SpreadEditPage } from './spread-edit';
import { IonicPageModule } from 'ionic-angular';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
    declarations: [SpreadEditPage],
    imports: [IonicPageModule.forChild(SpreadEditPage), PipesModule]
})
export class SpreadEditPageModule {}