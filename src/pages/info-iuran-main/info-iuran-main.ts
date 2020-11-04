import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DataService } from '../../providers/data-service';
import { infoIuranModel } from '../../model/financeModel';


/**
 * Generated class for the InfoSaldoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-info-iuran-main',
  templateUrl: 'info-iuran-main.html',
})
export class InfoIuranMainPage {

  dataUser: any;
  totalIuran: any = {
    totalTagihan: 0,
    totalBayar: 0,
    tunggakan: 0
  }

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: Storage,
    public dataService: DataService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
  }

  ionViewDidLoad() {
    this.getUserData()
    this.getIurans()
  }

  async getUserData() {
    this.dataUser = await this.storage.get('dataUser');
  }
  getIurans() {
    let loader = this.loadingCtrl.create({
      content: `<img src="img/loader8.gif" />`,
      spinner: 'hide',
    });
    loader.present()
    this.dataService.getFinanceIuran().then((res: Array<infoIuranModel>) => {
      this.totalIuran.totalTagihan = 0
      this.totalIuran.totalBayar = 0
      this.totalIuran.tunggakan = 0

      for (let i = 0; i < res.length; i++) {
        let data = res[i]
        this.totalIuran.totalTagihan += data.tagihan
        this.totalIuran.totalBayar += data.iuran
        this.totalIuran.tunggakan += data.tunggakan
      }
      loader.dismiss()
    },
    err => {
      loader.dismiss()
      this.handleError("Failed to connect with Finance server.")
    });
  }

  openDetails() {
    this.navCtrl.push("InfoIuranPage")
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


}
