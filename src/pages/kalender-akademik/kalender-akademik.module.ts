import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { KalenderAkademikPage } from './kalender-akademik';

@NgModule({
  declarations: [
    KalenderAkademikPage,
  ],
  imports: [
    IonicPageModule.forChild(KalenderAkademikPage),
  ],
})
export class KalenderAkademikPageModule {}
