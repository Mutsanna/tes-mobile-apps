import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NilaiDetailGeneralPage } from './nilai-detail-general';

@NgModule({
  declarations: [
    NilaiDetailGeneralPage,
  ],
  imports: [
    IonicPageModule.forChild(NilaiDetailGeneralPage),
  ],
})
export class NilaiDetailGeneralPageModule {}
