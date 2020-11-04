import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DataService } from '../../providers/data-service';
import { infoSaldoModel } from '../../model/financeModel';
import { ThemeableBrowser, ThemeableBrowserObject, ThemeableBrowserOptions } from '@ionic-native/themeable-browser'
import { CBS_OY_URL } from '../../providers/config';


/**
 * Generated class for the InfoSaldoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-info-saldo',
  templateUrl: 'info-saldo.html',
})
export class InfoSaldoPage {

  dataUser: any;
  dataFinance: any;
  dataSaldo: infoSaldoModel;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: Storage,
    public dataService: DataService,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private themeablebrowser: ThemeableBrowser
  ) {
  }

  ionViewDidLoad() {
    this.getUserData();
    this.getSaldo();
  }

  async getUserData() {
    this.dataUser = await this.storage.get('dataUser');
    this.storage.get("dataFinance").then(dataFinance => {
      this.dataFinance = dataFinance
    })
  }

  getSaldo() {
    let loader = this.loadingCtrl.create({
      content: `<img src="img/loader8.gif" />`,
      spinner: 'hide',
    });
    loader.present()
    this.dataService.getFinanceSaldo().then((res: infoSaldoModel) => {
      loader.dismiss()
      this.dataSaldo = res
    },
    err => {
      loader.dismiss()
      this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Failed to connect with Finance server.',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              this.navCtrl.pop()
            }
          }
        ],
      }).present();
    });
  }

  topupWebView() {
    this.storage.get("dataFinance").then(dataFinance => {
      const options: ThemeableBrowserOptions = {
        toolbar: {
            height: 58,
            color: '#464d93'
        },
        title: {
            color: '#FFFFFF',
            staticText: "Top Up Saldo with OY! Bayar"
        },
        closeButton: {
            wwwImage: 'img/ic_close.png',
            align: 'left',
            event: 'closePressed'
        }
      };
  
      var timestamp = this.createTimestamp()
      var description = "TOP UP SALDO"
      description += " Rekening " + dataFinance.data.no_rekening
      description += " A/n: " + this.dataSaldo.namaPemilik
      description += " Pada tanggal " + new Date().toISOString().substr(0, 10)

      var url = CBS_OY_URL + dataFinance.oy_username + "?"
      url += ("txid=" + dataFinance.data.kode_lkm + dataFinance.data.convertion_id + timestamp)
      url += ("&description=" + description)
      url += ("&show_contact=false")
      url += ("&show_account=false")
      url += ("&send_notif=true")
      url += ("&enable_payment_va=true")
      url += ("&enable_payment_cc=false")
      
      this.themeablebrowser.create(
        encodeURI(url),
        '_blank',
        options
      )
    })
  }

  createTimestamp() {
    const dateNow = new Date()

    let timestampComponents = {
      year: (dateNow.getFullYear().toString()),
      month: (dateNow.getMonth() < 10 ? "0" + (dateNow.getMonth() + 1) : (dateNow.getMonth() + 1)).toString(),
      date: (dateNow.getDate() < 10 ? "0" + dateNow.getDate() : dateNow.getDate()).toString(),
      hours: (dateNow.getHours() < 10 ? "0" + dateNow.getHours() : dateNow.getHours()).toString(),
      minutes: (dateNow.getMinutes() < 10 ? "0" + dateNow.getMinutes() : dateNow.getMinutes()).toString(),
      seconds: (dateNow.getSeconds() < 10 ? "0" + dateNow.getSeconds() : dateNow.getSeconds()).toString()
    }

    return (
      timestampComponents.year +
      timestampComponents.month +
      timestampComponents.date +
      timestampComponents.hours +
      timestampComponents.minutes +
      timestampComponents.seconds
    )
  }

}
