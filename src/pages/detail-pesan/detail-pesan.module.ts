import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailPesan } from './detail-pesan';

@NgModule({
  declarations: [
    DetailPesan,
  ],
  imports: [
    IonicPageModule.forChild(DetailPesan),
  ],
  exports: [
    DetailPesan
  ]
})
export class DetailPesanModule {}
