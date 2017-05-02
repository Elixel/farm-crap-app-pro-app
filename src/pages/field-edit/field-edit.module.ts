import { NgModule } from '@angular/core';
import { FieldEditPage } from './field-edit';
import { IonicPageModule } from 'ionic-angular';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
    declarations: [FieldEditPage],
    imports: [IonicPageModule.forChild(FieldEditPage), PipesModule]
})
export class FieldEditPageModule {}