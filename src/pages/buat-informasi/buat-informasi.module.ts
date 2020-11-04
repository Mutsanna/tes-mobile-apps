import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuatInformasi } from './buat-informasi';

@NgModule({
  declarations: [
    BuatInformasi,
  ],
  imports: [
    IonicPageModule.forChild(BuatInformasi),
  ],
  exports: [
    BuatInformasi
  ]
})
export class BuatInformasiModule {}
