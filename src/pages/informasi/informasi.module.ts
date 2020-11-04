import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Informasi } from './informasi';

@NgModule({
  declarations: [
    Informasi,
  ],
  imports: [
    IonicPageModule.forChild(Informasi),
  ],
  exports: [
    Informasi
  ]
})
export class InformasiModule {}
