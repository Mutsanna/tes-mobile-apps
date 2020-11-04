import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { OneSignal } from '@ionic-native/onesignal';

import { DataService } from '../../providers/data-service';
import { GlobalFunction } from '../../providers/global-function';

@IonicPage()
@Component({
  selector: 'page-detail-pesan',
  templateUrl: 'detail-pesan.html',
  providers: [DataService, GlobalFunction, Content]
})
export class DetailPesan {

  pesanList: any[] = [];
  isi: string;
  idPengirim1: string;
  namaPengirim1: string;
  idPengirim2: string;
  namaPengirim2: string;
  @ViewChild(Content) content: Content;

  endLoadData: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public dataService: DataService,
    public globalFunction: GlobalFunction,
    public oneSignal: OneSignal,
    public zone: NgZone,
    public alertCtrl: AlertController
  ) { }

  loadData() {
    this.zone.run(() => {
      this.storage.get('group')
        .then(group => {
          this.storage.get('dataUser')
            .then(user => {
              this.idPengirim1 = this.navParams.get('idPengirim1').id;
              this.namaPengirim1 = this.navParams.get('idPengirim1').nama;
              this.namaPengirim2 = user.nama;

              var pos,
                list = false,
                getCount = false;

              // if(group === "guru") {
              //   this.idPengirim2 = user.id_pegawai;                  
              // } else {
              //   this.idPengirim2 = user.id_siswa;
              // }

              this.idPengirim2 = user.id_user;

              this.dataService.getPesan(this.idPengirim1, this.idPengirim2, group, list, getCount)
                .then(data => {

                  this.pesanList = [];

                  if (data != "Tidak ada pesan") {
                    for (var i in data) {
                      if (data[i].id_pengirim === this.idPengirim2) {
                        pos = null;
                      } else {
                        pos = true;
                      }

                      this.pesanList.push({
                        isi: data[i].isi_pesan,
                        pos: pos
                      });
                    }
                  }

                  this.endLoadData = true;
                  this.content.scrollTo(0, this.content.contentHeight);

                });
            });
        });
    });
  }

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
    this.globalFunction.showLoader();
    this.loadData();
    var i = 0;
    let interval = setInterval(() => {
      if (this.endLoadData === true) {
        this.globalFunction.dismissLoader();
        clearInterval(interval);
      }
      if (i === 20) {
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
            this.loadData();
          }
        }
      ]
    });
    confirm.present();
  }

  send() {
    let isiBody = {
      idPengirim: this.idPengirim2,
      namaPengirim: this.namaPengirim2,
      idPenerima: this.idPengirim1,
      namaPenerima: this.namaPengirim1,
      isiPesan: this.isi
    };

    if (this.isi === "") {
      this.isi = undefined;
    }

    if (this.isi === undefined) {
      this.isi = "";
    } else {
      this.dataService.postPesan(isiBody)
        .then(data => {

          // this.storage.get('idSekolah')
          //   .then(idSekolah => {
          //     var isi = "Pesan Baru",
          //       filter = [
          //         { "field": "tag", "key": "idUser", "relation": "=", "value": isiBody.idPenerima },
          //         { "operator": "AND" }, { "field": "tag", "key": "idSekolah", "relation": "=", "value": idSekolah }
          //       ];

          //     this.dataService.sendNotification(isi, filter)
          //       .then(notif => {
          //         //console.log(notif);
          //         this.loadData();
          //       });
          //   });
          this.storage.get('kodeSekolah')
            .then(kode_sekolah => {
              this.storage.get('yayasan')
                .then(yayasan => {
                  var isi = "Pesan Baru",
                    filter = [
                      { "field": "tag", "key": "idUser", "relation": "=", "value": isiBody.idPenerima },
                      { "operator": "AND" }, { "field": "tag", "key": "kodeSekolah", "relation": "=", "value": kode_sekolah },
                      { "operator": "AND" }, { "field": "tag", "key": "yayasan", "relation": "=", "value": yayasan }
                    ];

                  this.dataService.sendNotification(isi, filter)
                    .then(notif => {
                      // console.log(notif);
                      this.loadData();
                    });
                });
            });
        });
      this.isi = "";
    }
  }

  change() {
    // get elements
    var element = document.getElementById('messageInputBox');
    var textarea = element.getElementsByTagName('textarea')[0];

    // set default style for textarea
    textarea.style.minHeight = '0';
    textarea.style.height = '0';

    // limit size to 96 pixels (6 lines of text)
    var scroll_height = textarea.scrollHeight;
    if (scroll_height > 57)
      scroll_height = 57;

    // apply new style
    element.style.height = scroll_height + "px";
    textarea.style.minHeight = scroll_height + "px";
    textarea.style.height = scroll_height + "px";
  }

  change2() {
    // get elements
    var element = document.getElementById('messageInputBox');
    //var textarea = element.getElementsByTagName('textarea')[0];

    // set default style for textarea
    element.style.minHeight = '0';
    element.style.height = '0';

    // limit size to 96 pixels (6 lines of text)
    var scroll_height = element.scrollHeight;
    if (scroll_height > 57)
      scroll_height = 57;

    // apply new style
    //element.style.height = scroll_height + "px";
    element.style.minHeight = scroll_height + "px";
    element.style.height = scroll_height + "px";
  }

}
