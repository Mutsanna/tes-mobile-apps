import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DataService } from '../../providers/data-service';

/**
 * Generated class for the NilaiKelasListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-nilai-kelas-list',
  templateUrl: 'nilai-kelas-list.html',
})
export class NilaiKelasListPage {

  kelasList: any[] = [];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: Storage,
    private dataService: DataService
  ) {
  }

  ionViewDidLoad() {
    this.getKelasList();
  }

  getKelasList() {
    this.storage.get('dataUser').then((dataUser: any) => {
      this.dataService.getKelasSiswaAll(dataUser.username).then((dKelas: any[]) => {
        dKelas.forEach(item => {
          this.kelasList.push({
            idKelas: item.id_kelas,
            tingkat: "Kelas " + item.tingkat + " " + ((item.jurusan) ? item.jurusan : ""),
            namaKelas: item.nama_kelas
          });
        });
      });
    });
  }

  gotoTipeNilai(kelas) {
    this.navCtrl.push('NilaiTipePage', { param: kelas })
  }

}
