import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as $ from 'jquery';

@IonicPage()
@Component({
  selector: 'page-detail-informasi',
  templateUrl: 'detail-informasi.html',
})
export class DetailInformasi {

  judulInformasi: any;
  isiInformasi: any;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams
  ) 
  {}

  ionViewDidLoad() {
  	var dataInformasi = this.navParams.get('info'),
        heightScreen = window.screen.height,
        //heightJudulInformasi = document.getElementById('judul_informasi').offsetHeight,
        heightHeader = document.getElementById('header').offsetHeight,
        heightMinus = 50 * 2,
        // height = heightScreen - heightJudulInformasi - heightHeader - heightMinus;
        height = heightScreen - heightHeader - heightMinus;

  	this.judulInformasi = dataInformasi.judulInformasi;
  	this.isiInformasi = dataInformasi.isiInformasi;
    // $('.isi-informasi').css('min-height', height);
    $('.table-users').css('min-height', height);
  }

}
