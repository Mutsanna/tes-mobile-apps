import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QrRekeningModalPage } from './qr-rekening-modal';
import { NgxQRCodeModule } from 'ngx-qrcode2';

@NgModule({
  declarations: [
    QrRekeningModalPage,
  ],
  imports: [
    IonicPageModule.forChild(QrRekeningModalPage),
    NgxQRCodeModule
  ],
})
export class QrRekeningModalPageModule {}
