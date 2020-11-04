import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InfoNilai } from './info-nilai';

@NgModule({
  declarations: [
    InfoNilai,
  ],
  imports: [
    IonicPageModule.forChild(InfoNilai),
  ],
  exports: [
    InfoNilai
  ]
})
export class InfoNilaiModule {}
