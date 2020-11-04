import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { DataService } from '../../providers/data-service';
import { AuthService } from '../../providers/auth-service';
import { Storage } from '@ionic/storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

/**
 * Generated class for the FinancePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-finance',
  templateUrl: 'finance.html',
})
export class FinancePage {

  history: any = "transaction";
  dataFinance: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataService: DataService,
    public authService: AuthService,
    public alertCtrl: AlertController,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private barcodeScanner: BarcodeScanner
  ) {
  }

  ionViewDidLoad() {
    this.getData();
  }

  getData() {
    let loader = this.loadingCtrl.create({
      content: `<img src="img/loader8.gif" />`,
      spinner: 'hide',
    });
    loader.present()
    this.storage.get('dataUser').then((res: any) => {
      // this.dataService.getDataFinance(res.id_siswa).then(resReq => {
      //   // resReq["body"].no_rekening = resReq["body"].no_rekening.padStart(10, "0")
      //   // console.log(resReq)
      //   this.storage.set('dataFinance', resReq);
      //   // this.dataFinance = resReq;
      //   loader.dismiss();
      // });

      // this.dataService.getDataFinanceByNis(res.username).then(resReq => {
      //   this.storage.set('dataFinance', resReq);
      //   // console.log(resReq)
      //   loader.dismiss();
      // },
      // () => {
      //   loader.dismiss();
      //   this.alertCtrl.create({
      //     title: 'Error',
      //     subTitle: 'Data Finance tidak ditemukan.',
      //     buttons: [
      //       {
      //         text: 'Ok',
      //         handler: () => {
      //           this.navCtrl.pop()
      //         }
      //       }
      //     ],
      //   }).present();
      // });

      this.dataService.getDataFinanceMulti(res.username).then(resReq => {
        this.storage.set('dataFinance', resReq);
        // console.log(resReq)

        this.dataFinance = resReq

        switch (resReq["provider"].toUpperCase()) {
          case "USSI":
            loader.dismiss();
            break;
          case "CBS": {
            loader.dismiss()
            break;
          }
          default: {
            loader.dismiss()
            this.handleError('Finance provider is not defined!')
            break;
          }
        }
      },
      () => {
        loader.dismiss();
        this.handleError('Data Finance tidak ditemukan.')
      });
    });
  }

  checkPassword(password, page) {
    this.authService.getCheckPassword(password).then(isTrue => {
      if (isTrue) {
        this.navCtrl.push(page);
      } else {
        let alert = this.alertCtrl.create({
          title: 'Password Salah',
          buttons: ['Ok']
        });
        alert.present();
      }
    });
  }

  confirmPassword(page) {
    // this.navCtrl.push(page);
    let alert = this.alertCtrl.create({
      title: 'Masukan Password',
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
          handler: data => {
            // console.log('Cancel clicked');
          }
        },
        {
          text: 'Check',
          handler: data => {
            this.checkPassword(data['password'], page);
          }
        }
      ]
    });
    alert.present();
  }

  showModal(page: string) {
    this.modalCtrl.create(
      page,
      {
        noRekening: this.dataFinance.data.no_rekening
      },
      {
        cssClass: "app-modal-view"
      }
    ).present()
  }

  handleError(msg) {
    this.alertCtrl.create({
      title: 'Error',
      subTitle: msg,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.pop()
          }
        }
      ],
    }).present();
  }

  scanQrForTransfer() {
    let loader = this.loadingCtrl.create({
      content: `<img src="img/loader8.gif" />`,
      spinner: 'hide',
    });
    this.barcodeScanner.scan().then(barcodeData => {
      // console.log('Barcode data', barcodeData);
      if (!barcodeData.cancelled) {
        var rekening = barcodeData.text;
        loader.present()
        this.dataService.cbsAccountCheck(rekening).then(tujuan => {
          this.dataService.cbsAccountCheck(this.dataFinance.data.no_rekening).then(pengirim => {
            loader.dismiss()
            this.navCtrl.push("TransferActionPage", { targetData: tujuan, senderData: pengirim })
          })
        },
        err => {
          loader.dismiss()
          this.handleError(err)
        })
      }
    }).catch(err => {
      console.log(err)
      this.handleError("Something went wrong.<br>Please try again later.");
    });
  }

}
