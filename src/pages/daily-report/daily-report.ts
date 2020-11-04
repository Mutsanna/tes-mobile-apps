import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { DataService } from '../../providers/data-service';
import { GlobalFunction } from '../../providers/global-function';

@IonicPage()
@Component({
  selector: 'page-daily-report',
  templateUrl: 'daily-report.html',
  providers: [DataService, GlobalFunction]
})
export class DailyReport {

  nis: string;
  name: string;
  class: string;
  date: string;
  endLoadData: boolean = false;

  list: Array<{durasi: string, waktu: string, keterangan: string}>;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    public storage: Storage,
    public globalFunction: GlobalFunction,
    public dataService: DataService,
    public alertCtrl: AlertController
  ) 
  {}

  ionViewDidLoad() {

  }

  ionViewWillEnter() {
    this.globalFunction.showLoader();
    this.dataUser();
    this.dataDaily();

    var i = 0;
    let interval = setInterval(()=> {
      if(this.endLoadData === true) {
        this.globalFunction.dismissLoader();
        clearInterval(interval);
      }
      if(i === 20) {
        this.globalFunction.dismissLoader();
        this.alertNotification();
        clearInterval(interval);
      }
      i++;
    }, 1000);
  }

  alertNotification() {
    let confirm = this.alertCtrl.create({
      title: 'Low internet connection',
      message: 'Reload?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.ionViewWillEnter();
          }
        }
      ]
    });
    confirm.present();  
  }

  dataUser() {
    this.storage.get('dataUser')
        .then(user => {
          
          this.nis = user.username;
          this.name = user.nama;
          
          this.storage.get('dataKelas')
              .then(dataKelas => {
                this.class = dataKelas[0].tingkat +" "+ dataKelas[0].jenjang;  //+" "+ data.nama_kelas;
              });
        });

    this.date = new Date().toISOString();
  }

  dataDaily() {
    this.dataService.getDataAbsensi()
        .then(data => {
          
          this.list = [];
          var listRaw = [];

          for(var i in data) {
            listRaw.push({
              durasi: data[i].durasi,
              waktu: data[i].waktu,
              keterangan: data[i].keterangan,
              sort: data[i].sort
            });
          }

          listRaw.sort(function(a,b) {
            return a.sort - b.sort;
          });

          this.list = listRaw;
          this.endLoadData = true;
        });
  }

}
