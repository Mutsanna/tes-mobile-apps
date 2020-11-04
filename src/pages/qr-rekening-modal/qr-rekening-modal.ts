import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the QrRekeningModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-qr-rekening-modal',
  templateUrl: 'qr-rekening-modal.html',
})
export class QrRekeningModalPage {
  qrValue: string

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
  }

  ionViewDidLoad() {
    this.qrValue = this.navParams.get("noRekening")
  }

  dismiss() {
    this.navCtrl.pop()
  }

}
