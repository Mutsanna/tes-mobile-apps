import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  App,
  LoadingController,
  AlertController
} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AuthService } from '../../providers/auth-service';

@IonicPage()
@Component({
  selector: 'page-pilih-sekolah',
  templateUrl: 'pilih-sekolah.html',
  providers: [AuthService]
})
export class PilihSekolah {

  sekolahList: any[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public app: App,
    public authService: AuthService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public storage: Storage
  ) { }

  ionViewDidLoad() {
    this.getSekolah();
  }

  getSekolah() {
    this.authService.getDataSekolah()
      .then(data => {
        var list: any = data;
        list.forEach(x => {
          this.sekolahList.push({
            nama_sekolah: x.nama_sekolah,
            // logo_sekolah: "http://localhost:8080/MadaniSS_Alkhawarizmi/" + x.logo_sekolah,
            logo_sekolah: "https://IbnuAbbas.madani-tech.com/"+ x.logo_sekolah,
            // logo_sekolah: "http://azzikra.madani-tech.com/" + x.logo_sekolah,
            // logo_sekolah: "http://tektikal.co.id/icm.kendari/" + x.logo_sekolah,
            kode_sekolah: x.kode_sekolah,
            alamat: x.alamat,
            id_yayasan: x.id_yayasan,
            nama_yayasan: x.nama_yayasan
            //group_db: x.group_db
          });
        });
      });
  }

  sekolahSelected(sekolah) {
    var data_sekolah = {
      nama_sekolah: sekolah.nama_sekolah,
      kode_sekolah: sekolah.kode_sekolah,
      alamat: sekolah.alamat,
      yayasan: sekolah.id_yayasan,
      nama_yayasan: sekolah.nama_yayasan
      //group_db: sekolah.group_db
    };
    this.storage.set('group_sekolah', data_sekolah);
    this.app.getRootNav().setRoot("Login");
  }

}
