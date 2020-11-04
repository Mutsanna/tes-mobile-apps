import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransferActionPage } from './transfer-action';

@NgModule({
  declarations: [
    TransferActionPage,
  ],
  imports: [
    IonicPageModule.forChild(TransferActionPage),
  ],
})
export class TransferActionPageModule {}
