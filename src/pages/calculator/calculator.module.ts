import { NgModule } from '@angular/core';
import { CalculatorPage } from './calculator';
import { IonicPageModule } from 'ionic-angular';

import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
    declarations: [CalculatorPage],
    imports: [
        IonicPageModule.forChild(CalculatorPage),
        PipesModule
    ]
})
export class CalculatorPageModule {}