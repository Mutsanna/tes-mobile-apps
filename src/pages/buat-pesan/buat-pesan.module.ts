import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuatPesan } from './buat-pesan';

@NgModule({
  declarations: [
    BuatPesan,
  ],
  imports: [
    IonicPageModule.forChild(BuatPesan),
  ],
  exports: [
    BuatPesan
  ]
})
export class BuatPesanModule {}
