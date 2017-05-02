import { NgModule } from '@angular/core';
import { FieldDetailPage } from './field-detail';
import { IonicPageModule } from 'ionic-angular';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
    declarations: [
        FieldDetailPage
    ],
    imports: [
        IonicPageModule.forChild(FieldDetailPage),
        ChartsModule,
        PipesModule
    ]
})
export class FieldDetailPageModule {}