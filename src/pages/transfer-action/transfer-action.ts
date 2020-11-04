import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { infoAccountModel } from '../../model/financeModel';
import { AuthService } from '../../providers/auth-service';
import { CurrencyPipe } from '@angular/common';
import { DataService } from '../../providers/data-service';

/**
 * Generated class for the TransferActionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-transfer-action',
  templateUrl: 'transfer-action.html',
  providers: [
    AuthService,
    DataService,
    CurrencyPipe
  ]
})
export class TransferActionPage {

  dataTarget: infoAccountModel
  dataSender: infoAccountModel
  nominal: number = 0
  keterangan: string = ""

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private dataService: DataService,
    private currency: CurrencyPipe,
  ) {
  }

  ionViewDidLoad() {
    this.dataTarget = this.navParams.get("targetData") as infoAccountModel
    this.dataSender = this.navParams.get("senderData") as infoAccountModel
  }

  doTransfer() {
    if (this.nominal != 0 && this.nominal != null) {
      if (this.nominal > this.dataSender.saldo) {
        let alert = this.alertCtrl.create({
          title: 'Saldo anda tidak cukup!',
          buttons: ['Ok']
        });
        alert.present();
      }
      else {
        let caption = 'Anda akan melakukan transfer sebesar<br><b>' + this.currency.transform(this.nominal, "IDR ") + '</b><br><br>'
        caption += 'Kepada<br><b>' + this.dataTarget.namaPemilik + '</b><br><b>' + this.dataTarget.noRekening + '</b><br><br>'
        caption += 'Masukkan password anda'

        let alert = this.alertCtrl.create({
          title: 'Konfirmasi Transfer',
          subTitle: caption,
          inputs: [
            {
              name: 'password',
              placeholder: 'Password',
              type: 'password'
            }
          ],
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Check',
              handler: data => {
                this.checkPassword(data['password']);
              }
            }
          ]
        });
        alert.present();
      }
    }
    else {
      let alert = this.alertCtrl.create({
        title: 'Nominal tidak boleh kosong!',
        buttons: ['Ok']
      });
      alert.present();
    }
  }

  checkPassword(password) {
    let loader = this.loadingCtrl.create({
      content: `<img src="img/loader8.gif" />`,
      spinner: 'hide',
    });
    loader.present()
    this.authService.getCheckPassword(password).then(isTrue => {
      if (isTrue) {
        // Do Transfer
        this.dataService.cbsTransferSaldo(this.dataSender.noRekening, this.dataTarget.noRekening, this.nominal, this.keterangan).then(result => {
          let caption = 'Anda sukses melakukan transfer sebesar<br><b>' + this.currency.transform(this.nominal, "IDR ") + '</b><br><br>'
          caption += 'Kepada<br><b>' + this.dataTarget.namaPemilik + '</b><br><b>' + this.dataTarget.noRekening + '</b><br><br>'
          caption += 'Dengan nomor transaksi<br>'
          caption += '<b>' + result["trx_ref_id"] + '</b>'

          loader.dismiss()
          let alert = this.alertCtrl.create({
            title: 'Success',
            subTitle: caption,
            buttons: [{
              text: 'Ok',
              handler: () => {
                this.navCtrl.pop()
              }
            }]
          });
          alert.present()
        },
        err => {
          loader.dismiss()
          let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: err,
            buttons: ['Ok']
          });
          alert.present();
        })
      } else {
        let alert = this.alertCtrl.create({
          title: 'Password Salah',
          buttons: ['Ok']
        });
        alert.present();
      }
    });
  }
}
