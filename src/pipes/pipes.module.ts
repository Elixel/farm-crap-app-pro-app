import { NgModule } from '@angular/core';

import { KeysPipe } from './keys';
import { orderBy } from './orderBy';

@NgModule({
    declarations: [KeysPipe, orderBy],
    exports: [KeysPipe, orderBy]
})
export class PipesModule {}