import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-profile-user',
  templateUrl: 'profile-user.html',
})
export class ProfileUser {
  
  group: string;

  NISN: string;
  NIS: string;
  namaSiswa: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  agama: string;
  golonganDarah: string;
  alamat: string;
  kota: string;
  noTelp: string;
  namaOrangTua: string;
  telpOrangTua: string;
  tahunMasuk: string;

  NUPTK: string;
  statusKawin: string;
  jenisPegawai: string;
  jabatan: string;
  golongan: string;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    public storage: Storage
  ) 
  {}

  ionViewDidLoad() {
  	this.storage.get('group')
  		.then(group => {
  			this.group = group;
  			this.storage.get('dataUser')
		    	.then(datauser => {
		    		//console.log(datauser);
		    		this.NISN = datauser.NISN;
		    		this.NIS = datauser.username;
		    		this.namaSiswa = datauser.nama;
		    		this.tempatLahir = datauser.tempat_lahir;
		    		this.tanggalLahir = datauser.tanggal_lahir;
		    		this.jenisKelamin = datauser.jenis_kelamin;
		    		this.agama = datauser.agama;
		    		this.golonganDarah = datauser.golongan_darah;
		    		this.alamat = datauser.alamat;
		    		this.kota = datauser.kota;
		    		this.noTelp = datauser.no_telp;
		    		this.namaOrangTua = datauser.nama_orang_tua;
		    		this.telpOrangTua = datauser.telp_orang_tua;
		    		this.tahunMasuk = datauser.tahun_masuk;

		    		this.NUPTK = datauser.NUPTK;
		    		this.statusKawin = datauser.status_kawin;
		    		this.jenisPegawai = datauser.jenis_pegawai;
		    		this.jabatan = datauser.jabatan;
		    		this.golongan = datauser.golongan;
		    	});
  		});
  }

}
