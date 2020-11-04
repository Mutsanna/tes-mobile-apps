import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailInformasi } from './detail-informasi';

@NgModule({
  declarations: [
    DetailInformasi,
  ],
  imports: [
    IonicPageModule.forChild(DetailInformasi),
  ],
  exports: [
    DetailInformasi
  ]
})
export class DetailInformasiModule {}
