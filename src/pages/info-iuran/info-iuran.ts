import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { DataService } from '../../providers/data-service';
import { infoIuranModel } from '../../model/financeModel';

/**
 * Generated class for the InfoIuranPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-info-iuran',
  templateUrl: 'info-iuran.html',
})
export class InfoIuranPage {

  iuranList: Array<infoIuranModel> = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public dataService: DataService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
    ) {
  }

  ionViewDidLoad() {
    // this.getIuran();
    this.getIurans();
  }

  getIurans() {
    let loader = this.loadingCtrl.create({
      content: `<img src="img/loader8.gif" />`,
      spinner: 'hide',
    });
    loader.present()
    this.dataService.getFinanceIuran().then((res: Array<infoIuranModel>) => {
      this.iuranList = res;
      loader.dismiss()
    },
    err => {
      loader.dismiss()
      this.handleError("Failed to connect with Finance server.")
    });
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
