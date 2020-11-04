import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { DataService } from '../../providers/data-service';
import { infoHistoryModel } from '../../model/financeModel';

/**
 * Generated class for the InfoHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-info-history',
  templateUrl: 'info-history.html',
})
export class InfoHistoryPage {

  // summaryData: any = {
  //   debet: 0,
  //   kredit: 0,
  //   saldo: 0
  // };
  // historyList: any[] = [];

  dateNow: string = new Date().toISOString().substr(0, 10)
  dataHistory: infoHistoryModel
  startDate: string = ""
  endDate: string = ""

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public dataService: DataService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
  }

  ionViewDidLoad() {
    // this.getHistory();
    
    let nowDate = new Date()
    let firstDate = new Date()
    firstDate.setDate(1)

    this.startDate = firstDate.toISOString().substr(0, 10)
    this.endDate = nowDate.toISOString().substr(0, 10)

    this.getHistorys();
  }

  // getHistory() {
  //   this.summaryData = {
  //     debet: 0,
  //     kredit: 0,
  //     saldo: 0
  //   };

  //   this.historyList = [
  //     // {
  //     //   codeDate: "D 03/07/2019",
  //     //   saldo: 240000,
  //     //   keterangan: "Transfer sesama LKM"
  //     // },
  //     // {
  //     //   codeDate: "D 15/07/2019",
  //     //   saldo: 100000,
  //     //   keterangan: "Diproses Yana NoRek 1102211"
  //     // }
  //   ];
  // }

  getHistorys() {
    let loader = this.loadingCtrl.create({
      content: `<img src="img/loader8.gif" />`,
      spinner: 'hide',
    });
    loader.present()
    this.dataService.getFinanceHistory(this.stripDash(this.startDate), this.stripDash(this.endDate)).then((res: infoHistoryModel) => {
      // if (res.hasOwnProperty('response_data')) {
      //   res.response_data.forEach(item => {
      //     let codeDate = "";
      //     if (item.my_kode_trans == 100) {
      //       this.summaryData.debet += item.pokok;
      //       this.summaryData.saldo += item.pokok;
      //       codeDate = "D " + item.tgl_trans;
      //     } else if (item.my_kode_trans == 200) {
      //       this.summaryData.kredit += item.pokok;
      //       this.summaryData.saldo -= item.pokok;
      //       codeDate = "K " + item.tgl_trans;
      //     }

      //     this.historyList.push({
      //       codeDate: codeDate,
      //       saldo: item.pokok,
      //       keterangan: item.keterangan
      //     });
      //   });
      // }
      loader.dismiss()
      this.dataHistory = res
    },
    err => {
      loader.dismiss()
      this.alertCtrl.create({
        title: 'Error',
        subTitle: "Failed to connect with Finance server.",
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

  private stripDash(date: string): string {
    var result = date
    result = date.split("-").join("")
    return result
  }

  dateChanged() {
    this.getHistorys()
  }

  startDateChanged() {
    if (this.startDate > this.endDate) {
      this.endDate = this.startDate
    }
  }

}
