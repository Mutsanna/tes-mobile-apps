import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { DataService } from '../../providers/data-service';

@IonicPage()
@Component({
  selector: 'page-buat-pesan',
  templateUrl: 'buat-pesan.html',
  providers: [DataService]
})
export class BuatPesan {

  selectedKelas: string;
  cbKelas: any[] = [];
  cbView: string;
  idKelas: string;
  banyakKelas: boolean;

  siswaList: any[] = [];

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public dataService: DataService,
  	public app: App,
    public storage: Storage,
    public alertCtrl: AlertController
  ) 
  {}

  ionViewDidLoad() {
    this.dataKelas();
  }

  dataKelas() {
    this.storage.get('dataKelas')
        .then(dataKelas => {
          this.storage.get('dataUser')
              .then(dataUser => {
                var comboKelas;
                // waliKelas = dataUser.id_pegawai;
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

                this.loadView(comboKelas);
              });
        });
  }

  loadView(data) {
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

    this.dataService.getDataSiswaInKelas(this.idKelas)
    	.then(data => {
    		//console.log(data);
    		this.siswaList = [];
    		for(var i in data) {
    			this.siswaList.push({
    				nis: data[i].siswa_NIS,
    				namaSiswa: data[i].nama_siswa,
    				// idSiswa: data[i].id_siswa
            idSiswa: data[i].id_user
    			});
    		}
    	});
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
            this.loadView(select);
          }
        }
      ]
    });
    alert.present();
  }

  pesanSelected(id) {
    var data = {
      id: id.idSiswa,
      nama: id.namaSiswa
    };

    this.navCtrl.push('DetailPesan', {idPengirim1: data});
  }

}
