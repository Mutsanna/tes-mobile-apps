import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DataService } from '../../providers/data-service';

/**
 * Generated class for the DetailKalenderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detail-kalender',
  templateUrl: 'detail-kalender.html',
})
export class DetailKalenderPage {

  detail: any;
  group: string;
  isEdit: boolean = false;
  kegiatanList: any[] = [];
  idKegiatan: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: Storage,
    public dataService: DataService,
    public alertCtrl: AlertController
  ) {
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    let param = this.navParams.get("param");
    this.detail = param;

    // this.storage.get('group')
    //   .then(group => {
    //     this.storage.get('dataKelas')
    //       .then(dataKelas => {
    //         if (group === "guru") {
    //           if (dataKelas.length !== 0) {
    //             this.group = "WaliKelas";
    //           } else {
    //             this.group = group;
    //           }
    //         } else if (group === "siswa") {
    //           this.group = group;
    //         }
    //       });
    //   });

    this.group = "WaliKelas";
  }

  async buatKegiatan() {
    this.isEdit = true;
    this.kegiatanList = [];
    this.idKegiatan = null;
    let getKegiatan: any = await this.dataService.getKegiatan();
    getKegiatan.forEach(item => {
      if (this.detail.hasOwnProperty('idKegiatan')) {
        if (this.detail.idKegiatan == item.id_kegiatan) {
          this.idKegiatan = item.id_kegiatan;
        }
      }
      this.kegiatanList.push({
        label: item.nama_kegiatan,
        value: item.id_kegiatan
      });
    });
  }

  cancelKegiatan() {
    this.isEdit = false;
  }

}
