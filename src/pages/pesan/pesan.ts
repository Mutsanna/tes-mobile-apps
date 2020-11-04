import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { OneSignal } from '@ionic-native/onesignal';

import { DataService } from '../../providers/data-service';
import { GlobalFunction } from '../../providers/global-function';

@IonicPage()
@Component({
  selector: 'page-pesan',
  templateUrl: 'pesan.html',
  providers: [DataService, GlobalFunction]
})
export class Pesan {

  pesanList: any[] = [];
  group: string;
  count: number;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    public storage: Storage,
  	public dataService: DataService,
    public globalFunction: GlobalFunction,
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

  loadData() {
    this.zone.run(()=> {
      this.globalFunction.showLoader();
      var endLoadData = false;
      this.storage.get('group')
          .then(group => {
            // this.group = group;
            this.storage.get('dataUser')
                .then(dataUser => {
                  this.storage.get('dataKelas')
                      .then(dataKelas => {

                        var id1, id2, list = true, getCount = false;
                        if(group === "guru") {
                          // id1 = dataUser.id_pegawai;
                          if(dataKelas.length !== 0) {
                            this.group = "WaliKelas";
                          } else {
                            this.group = group;
                          }
                        } else if(group === "siswa") {
                          // id1 = dataUser.id_siswa;
                          this.group = group;
                          id2 = dataKelas[0].wali_kelas;
                        }

                        id1 = dataUser.id_user;

                        this.dataService.getPesan(id1, id2, group, list, getCount)
                            .then(data => {
                               this.pesanList = [];
                               //console.log(data);
                               
                               if(data != "Tidak ada pesan") {
                                 for(var i in data) {
                                   var id, nama;

                                   if(group === "guru") {
                                     id = data[i].ip;
                                     nama =  data[i].nama_penerima;
                                   } else {
                                     id = data[i].id_pengirim;
                                     nama =  data[i].nama_pengirim;
                                   }

                                    // id = data[i].id_pengirim;
                                    // nama =  data[i].nama_pengirim;

                                   this.pesanList.push({
                                     id: id,
                                     nama: nama,
                                     ur: data[i].ur
                                   });

                                   // this.count = this.pesanList.length;
                                 }
                               } else {
                                 this.count = 0;
                               }

                               endLoadData = true;
                               
                            });
                      });
                })
            
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

  pesanSelected(pesan) {
    var data = {
      id: pesan.id,
      nama: pesan.nama
    };
    this.navCtrl.push('DetailPesan', {idPengirim1: data});
  }

  buatPesan() {
    this.navCtrl.push('BuatPesan'); 
  }

}
