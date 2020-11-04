import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the NilaiTipePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-nilai-tipe',
  templateUrl: 'nilai-tipe.html',
})
export class NilaiTipePage {

  kelas: any;
  nilaiTipeList: any[] = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
  ) {
    this.kelas = this.navParams.get('param');
    this.nilaiTipeList = [
      { tipe: "ulangan", label: "Nilai Ulangan" },
      { tipe: "tugas", label: "Nilai Tugas" },
      { tipe: "praktik", label: "Nilai Praktik" },
      { tipe: "portofolio", label: "Nilai Portofolio" },
      // { tipe: "raport", label: "Nilai Raport" }
    ];
  }

  ionViewDidLoad() {
    
  }

  gotoNilai(item) {
    let param = {
      kelas: this.kelas,
      tipe: item
    };
    if (item.tipe != "raport") {
      this.navCtrl.push("NilaiDetailGeneralPage", { param: param });
    } else {
      this.navCtrl.push("", { param: param });
    }
  }

}
