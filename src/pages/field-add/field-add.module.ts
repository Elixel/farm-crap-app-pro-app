import { NgModule } from '@angular/core';
import { FieldAddPage } from './field-add';
import { IonicPageModule } from 'ionic-angular';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
    declarations: [FieldAddPage],
    imports: [IonicPageModule.forChild(FieldAddPage), PipesModule]
})
export class FieldAddPageModule {}