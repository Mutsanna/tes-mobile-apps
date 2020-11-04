import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NilaiKelasListPage } from './nilai-kelas-list';

@NgModule({
  declarations: [
    NilaiKelasListPage,
  ],
  imports: [
    IonicPageModule.forChild(NilaiKelasListPage),
  ],
})
export class NilaiKelasListPageModule {}
