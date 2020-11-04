import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PilihSekolah } from './pilih-sekolah';

@NgModule({
  declarations: [
    PilihSekolah,
  ],
  imports: [
    IonicPageModule.forChild(PilihSekolah),
  ],
  exports: [
    PilihSekolah
  ]
})
export class PilihSekolahModule {}
