import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DataService } from '../../providers/data-service';

/**
 * Generated class for the NilaiDetailGeneralPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-nilai-detail-general',
  templateUrl: 'nilai-detail-general.html',
})
export class NilaiDetailGeneralPage {

  parameter: any;
  dataUser: any;
  nilaiList: any;
  jenisUlangan: any;
  isUlangan: boolean = false;
  jenisUlanganSelected: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: Storage,
    public dataService: DataService
  ) {
    this.parameter = this.navParams.get('param');
    console.log('paramt',this.parameter)
    this.nilaiList = [];
  }

  ionViewDidLoad() {
    if (this.parameter.tipe.tipe == "ulangan") {
      this.isUlangan = true;
      this.getJenisUlangan();
    } else {
      this.getUserData();
    }
  }

  async getUserData() {
    this.dataUser = await this.storage.get('dataUser');
    if (this.dataUser) {
      this.getNilaiList();
    }
  }

  async getJenisUlangan() {
    this.jenisUlangan = await this.dataService.getJenisUlangan();
    if (this.jenisUlangan && this.jenisUlangan.length > 0) {
      this.jenisUlanganSelected = this.jenisUlangan[0].id;
      this.getUserData();
    }
  }

  async getNilaiList() {
    this.nilaiList = await this.dataService.getNilaiGeneral(this.parameter.tipe.tipe, this.parameter.kelas.idKelas, this.dataUser.id_siswa, this.jenisUlanganSelected);
  }

}
