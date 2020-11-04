import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Pesan } from './pesan';

@NgModule({
  declarations: [
    Pesan,
  ],
  imports: [
    IonicPageModule.forChild(Pesan),
  ],
  exports: [
    Pesan
  ]
})
export class PesanModule {}
