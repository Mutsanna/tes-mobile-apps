import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController, ModalController, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { DataService } from '../../providers/data-service';

@IonicPage()
@Component({
  selector: 'page-buat-informasi',
  templateUrl: 'buat-informasi.html',
  providers: [DataService]
})
export class BuatInformasi {

  judul: string;
  isi: string;
  selectedKelas: string;
  cbKelas: any[] = [];
  cbView: string;
  idKelas: string;
  banyakKelas: boolean;
  idPengirim: string;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public dataService: DataService,
  	public app: App,
    public storage: Storage,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController
  ) 
  {}

  ionViewDidLoad() {
    this.dataKelas();
  }

  broadcast() {
  	let body = {
  		judul: this.judul,
  		isi: this.isi,
      idKelas: this.idKelas,
      idPengirim: this.idPengirim,
      kelasView: this.cbView
  	};

    let confirmModal = this.modalCtrl.create(BuatInformasiModal, { dataParamModal: body });
    confirmModal.onDidDismiss(data => {
      if(data === true) {
        this.judul = "";
        this.isi = "";

        this.dataService.postInformasi(body)
            .then(data => {
              if(data === true) {
                // this.storage.get('idSekolah')
                //     .then(idSekolah => {
                //       var isi = "Informasi Baru",
                //           filter = [
                //             {"field": "tag", "key": "idKelas", "relation": "=", "value": this.idKelas},
                //             {"operator": "AND"}, {"field": "tag", "key": "idSekolah", "relation": "=", "value": idSekolah}
                //           ];

                //       this.dataService.sendNotification(isi, filter)
                //           .then(notif => {
                //             // console.log(notif);
                //             this.app.goBack();
                //           });
                //     });
                this.storage.get('kodeSekolah')
                    .then(kode_sekolah => {
                      this.storage.get('yayasan')
                        .then(yayasan => {
                          var isi = "Informasi Baru",
                              filter = [
                                {"field": "tag", "key": "idKelas", "relation": "=", "value": this.idKelas},
                                {"operator": "AND"}, {"field": "tag", "key": "kodeSekolah", "relation": "=", "value": kode_sekolah},
                                {"operator": "AND"}, {"field": "tag", "key": "yayasan", "relation": "=", "value": yayasan}
                              ];

                          this.dataService.sendNotification(isi, filter)
                              .then(notif => {
                                // console.log(notif);
                                this.app.goBack();
                              });
                            });
                    });
              }
              
            });
      }
    });
    confirmModal.present();
  }

  dataKelas() {
    this.storage.get('dataKelas')
        .then(dataKelas => {
          this.storage.get('dataUser')
              .then(dataUser => {
                var comboKelas,
                idPengirim = dataUser.id_pegawai;
                comboKelas = [];
                

                var checked, kelas, idKelas;
                for(var i in dataKelas) {
                  kelas = dataKelas[i].nama_kelas;
                  idKelas = dataKelas[i].id_kelas;

                  if(i === "0") {
                    checked = true;
                  } else {
                    checked = false;
                  }

                  comboKelas.push({
                    type: 'radio',
                    label: kelas,
                    checked: checked,
                    value: idKelas
                  });
                }

                this.loadView(comboKelas, idPengirim);
              });
        });
  }

  loadView(data, idPengirim) {
    this.idPengirim = idPengirim;
    this.cbKelas = [];
    this.cbKelas = data;
    if(this.cbKelas.length > 1) {
      this.banyakKelas = true;
    } else {
      this.banyakKelas = null;
    }

    for(var i in this.cbKelas) {
      if(this.cbKelas[i].checked === true) {
        this.cbView = this.cbKelas[i].label;
        this.idKelas = this.cbKelas[i].value;
      };
    }
  }

  selectKelas() {
    let alert = this.alertCtrl.create({
      title: "Pilih Kelas",
      inputs: this.cbKelas,
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          handler: data => {
                  
          }
        },
        {
          text: 'Ok',
          handler: data => {
            var select = this.cbKelas;
                  
            for(var i in select) {
              if(select[i].value === data) {
                select[i].checked = true;
              } else {
                select[i].checked = false;
              }
            }
            this.loadView(select, this.idPengirim);
          }
        }
      ]
    });
    alert.present();
  }

}

@Component({
  selector: 'page-buat-informasi',
  template: '<ion-header><ion-navbar><ion-title>Konfirmasi Informasi</ion-title></ion-navbar></ion-header>'+
            '<ion-content class="background-content">'+
              '<ion-row>'+
                '<ion-col>'+
                  '<ion-list inset>'+
                    '<ion-item>'+
                      '<ion-label stacked>'+
                        'Untuk Kelas'+
                      '</ion-label>'+
                      '<ion-input  type="text" placeholder="{{ kelas }}" readonly></ion-input>'+
                    '</ion-item>'+
                    '<ion-item>'+
                      '<ion-label stacked>'+
                        'Judul'+
                      '</ion-label>'+
                      '<ion-input  type="text" placeholder="{{ judul }}" readonly></ion-input>'+
                    '</ion-item>'+
                    '<ion-item>'+
                      '<ion-label stacked>'+
                        'Isi'+
                      '</ion-label>'+
                      '<ion-textarea placeholder="{{ isi }}" rows="10" readonly></ion-textarea>'+
                    '</ion-item>'+
                  '</ion-list>'+
                '</ion-col>'+
              '</ion-row>'+
              '<button ion-button class="dismiss-cancel" icon-left (click)="dismissCancel()"><ion-icon name="close"></ion-icon>Cancel</button>'+
              '<button ion-button class="dismiss-send" icon-left (click)="dismissSend()"><ion-icon name="send"></ion-icon>Broadcast</button>'+
            '</ion-content>'
})
export class BuatInformasiModal {
  
  kelas: string;
  judul: string;
  isi: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public dataService: DataService,
    public viewCtrl: ViewController
  ) 
  {}

  ionViewDidLoad() {
    // console.log(this.navParams.get('dataParamModal'));
    var paramData = this.navParams.get('dataParamModal');
    this.kelas = paramData.kelasView;
    this.judul = paramData.judul;
    this.isi = paramData.isi;
  }

  dismissCancel() {
    this.viewCtrl.dismiss(false);
  }

  dismissSend() {
    this.viewCtrl.dismiss(true);
  }
}