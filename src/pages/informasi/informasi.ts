import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { OneSignal } from '@ionic-native/onesignal';

import { DataService } from '../../providers/data-service';
import { GlobalFunction } from '../../providers/global-function';

@IonicPage()
@Component({
  selector: 'page-informasi',
  templateUrl: 'informasi.html',
  providers: [DataService, GlobalFunction]
})
export class Informasi {

  infoList: any[] = [];
  group: string;
  count: number;

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

  ionViewDidLoad() {
  }

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

  loadData() {
    this.zone.run(()=> {
      this.globalFunction.showLoader();
      this.storage.get('group')
          .then(group => {
            // this.group = group;
            this.storage.get('dataKelas')
                .then(dataKelas => {
                  if(group === "guru") {
                    if(dataKelas.length !== 0) {
                      this.group = "WaliKelas";
                    } else {
                      this.group = group;
                    }
                  } else if(group === "siswa") {
                    this.group = group;
                  }
                });
          });
      
      var update = false, idInformasi = null;
      var endLoadData = false;
      this.dataService.getDataInformasi(update, idInformasi)
        .then(data => {
          var listData = data;

          this.infoList = [];
          for(var i=0;i<listData.length;i++) {

            this.infoList.push({
              idInformasi: parseInt(listData[i].id_informasi),
              judulInformasi: listData[i].judul,
              isiInformasi: listData[i].isi,
              isRead: listData[i].is_read
            });
          }

          this.infoList.sort(function(a,b) {
            return b.idInformasi - a.idInformasi;
          });

          this.count = this.infoList.length;

          endLoadData = true;
        });

      var i = 0;
      let interval = setInterval(()=> {
        if(endLoadData === true) {
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

  infoSelected(info) {
    var update = true, idInformasi = info.idInformasi;
    this.dataService.getDataInformasi(update, idInformasi)
        .then(data => {
          this.navCtrl.push('DetailInformasi', {info: info});
        });
  }

  buatInformasi() {
    this.navCtrl.push('BuatInformasi'); 
  }

}
