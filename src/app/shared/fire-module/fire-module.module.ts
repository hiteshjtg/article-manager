import { NgModule } from '@angular/core';
import { environment } from '../../../environments/environment';

import { AngularFireModule } from '@angular/fire/compat';

@NgModule({
  declarations: [],
  imports: [AngularFireModule.initializeApp(environment.firebase)],
  exports: [AngularFireModule],
})
export class FireModuleModule {}
