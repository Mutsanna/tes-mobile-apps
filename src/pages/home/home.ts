import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
//import * as $ from 'jquery';
import { Storage } from '@ionic/storage';
import { OneSignal } from '@ionic-native/onesignal';

import { DataService } from '../../providers/data-service';
import { GlobalFunction } from '../../providers/global-function';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [DataService, GlobalFunction]
})
export class Home {

  notifInformasi: any;
  notifPesan: string;
  group: string;
  countPesan: string;

  endPesan: boolean = false;
  endInformasi: boolean = false;

  // imageTest: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public dataService: DataService,
    public globalFunction: GlobalFunction,
    public storage: Storage,
    public oneSignal: OneSignal,
    public zone: NgZone,
    public alertCtrl: AlertController
  ) 
  {}

  ionViewWillEnter() {
    this.oneSignal.startInit('f74b990a-786d-40de-843e-f3b80f4a1b39', '544874095575');
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
    this.oneSignal.enableSound(true);
    this.oneSignal.enableVibrate(true);
    this.oneSignal.handleNotificationReceived()
                  .subscribe(data => {
                    this.loadData();
                  });
    this.oneSignal.endInit();
    this.loadData();
  }

  ionViewDidLoad() {
    // this.storage.get('dataUser')
    //     .then(data_user => {
    //       console.log(data_user);
    //       this.imageTest = "http://madani-tech.com/MadaniSS/assets/upload/"+ data_user.foto;
    //     });
  }

  loadData() {
    this.zone.run(()=> {
      this.globalFunction.showLoader();
      this.storage.get('group')
          .then(group => {
            this.group = group;

            this.banner();
            // if(this.group === "siswa") {
            //   this.notifikasiInformasi();  
            // } else if(this.group === "guru") {
            //   this.endInformasi = true;
            // }
            this.notifikasiInformasi();
            this.notifikasiPesan();

            var i = 0;
            let interval = setInterval(() => {
              if(this.endPesan === true && this.endInformasi === true) {
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
            
          });
    });
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
            this.loadData();
          }
        }
      ]
    });
    confirm.present();  
  }

  openAbsensi() {
  	this.navCtrl.push('DailyReport');
  }

  openNilai() {
    //  this.navCtrl.push('InfoNilai'); 
    this.navCtrl.push('NilaiKelasListPage');
  }

  openInformasi() {
     this.navCtrl.push('Informasi'); 
  }

  openPesan() {
     this.navCtrl.push('Pesan'); 
  }

  openKalender() {
    this.navCtrl.push('KalenderAkademikPage');
  }

  banner() {
  	// $('#banner').attr('style', 'background-color: orange;');
    // $('#banner').attr('style', 'background-image: url(../img/header.png);background-size: cover;height: 20%;');
  }

  notifikasiInformasi() {
    var update = false, idInformasi = null;
    this.dataService.getDataInformasi(update, idInformasi)
        .then(data => {
          // console.log("informasi", data);
          var listData = data,
              listDataCount = 0;

          for(var i in listData) {
            if(listData[i].is_read === "0") {
              listDataCount++;
            }
          }

          if(listDataCount > 0) {
            this.notifInformasi = listDataCount;
          } else {
            this.notifInformasi = null;
          }

          this.endInformasi = true;
        });
  }

  notifikasiPesan() {
    this.storage.get('group')
        .then(group => {
          this.storage.get('dataUser')
              .then(dataUser => {

                var id1, id2, list = true, getCount = true;

                // if(group === "guru") {
                //   id1 = dataUser.id_pegawai;
                // } else if(group === "siswa") {
                //   id1 = dataUser.id_siswa;
                // }

                id1 = dataUser.id_user;

                this.dataService.getPesan(id1, id2, group, list, getCount)
                    .then(data => {

                      if(data > 0) {
                        this.countPesan = data;
                      } else {
                        this.countPesan = null;
                      }

                      this.endPesan = true;
                    });
              });
        });
  }

}
