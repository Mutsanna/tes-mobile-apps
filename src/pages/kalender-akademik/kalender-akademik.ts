import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DataService } from '../../providers/data-service';
import { GlobalFunction } from '../../providers/global-function';
import * as moment from 'moment';

/**
 * Generated class for the KalenderAkademikPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-kalender-akademik',
  templateUrl: 'kalender-akademik.html',
})
export class KalenderAkademikPage {

  viewDate: string;
  viewSemester: string;
  selectedSemester: number = 0;
  dateInMonth: any[];
  days: any[] = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  bulanGanjil: any[] = [];
  bulanGenap: any[] = [];
  selectedDate: string;

  dataKalenderAkademik: any;
  dataSemester: any[];
  hariAktif: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public dataService: DataService,
    public globalFunction: GlobalFunction,
    public alertCtrl: AlertController
  ) { }

  ionViewDidLoad() {
    this.globalFunction.showLoader();
    this.dataService.getTahunAkademik().then((resultData: any) => {
      this.dataKalenderAkademik = resultData.kalender_akademik;
      let tahunAkademik = resultData.tahun_akademik;
      this.setMonthList(tahunAkademik);
      this.hariAktif = parseInt(tahunAkademik.jumlah_hari_aktif);
      this.dataSemester = [
        {
          semester: "ganjil",
          tglMulai: tahunAkademik.tanggal_mulai_ganjil,
          tglAkhir: tahunAkademik.tanggal_akhir_ganjil,
          bulan: this.bulanGanjil
        },
        {
          semester: "genap",
          tglMulai: tahunAkademik.tanggal_mulai_genap,
          tglAkhir: tahunAkademik.tanggal_akhir_genap,
          bulan: this.bulanGenap
        }
      ];

      let dateNow = new Date().toUTCString();
      let startDate = new Date(tahunAkademik.tanggal_mulai_ganjil).toUTCString();
      let endDate = new Date(tahunAkademik.tanggal_akhir_ganjil).toUTCString();

      if (Date.parse(dateNow) >= Date.parse(startDate) && Date.parse(dateNow) <= Date.parse(endDate)) {
        this.selectedSemester = 0;
      } else {
        this.selectedSemester = 1;
      }

      // let startMonth = this.dataSemester[this.selectedSemester].tglMulai;
      let date = new Date(new Date(dateNow).getFullYear(), new Date(dateNow).getMonth(), 1).toUTCString();

      this.show(date);
      this.globalFunction.dismissLoader();
    }, err => {
      this.globalFunction.dismissLoader();
    });
  }

  ionViewDidEnter() {
    
  }

  setMonthList(tahunAkademik) {
    this.bulanGanjil = [];
    let startGanjilMonth = new Date(tahunAkademik.tanggal_mulai_ganjil).getMonth();
    let endGanjilMonth = new Date(tahunAkademik.tanggal_akhir_ganjil).getMonth();
    let countMontGanjil = 0;

    if (startGanjilMonth > endGanjilMonth) {
      countMontGanjil = startGanjilMonth + endGanjilMonth;
    } else {
      countMontGanjil = endGanjilMonth - startGanjilMonth;
    }

    let getMonthGanjil = startGanjilMonth;
    let getYearGanjil = new Date(tahunAkademik.tanggal_mulai_ganjil).getFullYear();
    for (let i = 0; i <= countMontGanjil; i++) {
      if (getMonthGanjil > 11) {
        getMonthGanjil = getMonthGanjil - 12;
        getYearGanjil++;
      }

      let createDate = new Date(getYearGanjil, getMonthGanjil, 1);
      this.bulanGanjil.push(createDate);
      getMonthGanjil++;
    }

    this.bulanGenap = [];
    let startGenapMonth = new Date(tahunAkademik.tanggal_mulai_genap).getMonth();
    let endGenapMonth = new Date(tahunAkademik.tanggal_akhir_genap).getMonth();
    let countMontGenap = 0;

    if (startGenapMonth > endGenapMonth) {
      countMontGenap = startGenapMonth + endGenapMonth;
    } else {
      countMontGenap = endGenapMonth - startGenapMonth;
    }

    let getMonthGenap = startGenapMonth;
    let getYearGenap = new Date(tahunAkademik.tanggal_mulai_genap).getFullYear();
    for (let i = 0; i <= countMontGenap; i++) {
      if (getMonthGenap > 11) {
        getMonthGenap = getMonthGenap - 12;
        getYearGenap++;
      }

      let createDate = new Date(getYearGenap, getMonthGenap, 1);
      this.bulanGenap.push(createDate);
      getMonthGenap++;
    }
  }

  show(date) {

    this.viewSemester = (this.selectedSemester == 0) ? "Semester Ganjil" : "Semester Genap";
    this.viewDate = moment(date).format('MMMM, YYYY');

    let momentDate = moment(date);
    let momentTotalDays = momentDate.daysInMonth();
    let totalWeeks = Math.ceil(momentTotalDays / 7);
    let momentFirstDay = this.days[momentDate.format('e')];

    this.selectedDate = momentDate.toISOString();
    
    let week: any[] = [];
    let firstDateInsert: boolean = false;
    let initDate: number = 1;
    let lastDay: number = 0;

    for (let i = 0; i < totalWeeks; i++) {
      let day = [];
      for (let j = 0; j < 7; j++) {

        let dayOptions = {};
        dayOptions["idKalender"] = "";
        if (j == 0 || j > this.hariAktif) {
          dayOptions["class"] = "box-day weekend";
        } else {
          dayOptions["class"] = "box-day weekday";
        }

        if (!firstDateInsert) {
          if (this.days[j] == momentFirstDay) {
            firstDateInsert = true;
            dayOptions["date"] = initDate;
            lastDay = initDate;
            initDate++;
          } else {
            dayOptions["date"] = "";
          }
        } else {
          if (initDate <= momentTotalDays) {
            dayOptions["date"] = initDate;
            lastDay = initDate;
            initDate++;
          } else {
            dayOptions["date"] = "";
          }
        }

        if (dayOptions["date"] != "") {
          let dateString = momentDate.year().toString() + "-" + (momentDate.month() + 1).toString() + "-" + dayOptions["date"];
          let newDate = new Date(dateString).toUTCString();
          let createDate = moment(newDate).format("YYYY-MM-DD").toString();
          dayOptions["fullDate"] = createDate;

          if (this.dataKalenderAkademik.hasOwnProperty(createDate)) {
            dayOptions["class"] = dayOptions["class"] + " eventday";
            dayOptions["idKalender"] = this.dataKalenderAkademik[createDate].id_kalender;
            dayOptions["idKegiatan"] = this.dataKalenderAkademik[createDate].id_kegiatan;
            dayOptions["keterangan"] = this.dataKalenderAkademik[createDate].keterangan;
            dayOptions["namaKegiatan"] = this.dataKalenderAkademik[createDate].nama_kegiatan;
          }
        }

        day.push(dayOptions);
      }

      week.push(day);
    }

    if (lastDay != momentTotalDays) {
      let day = [];
      for (let i = 0; i < 7; i++) {
        let dayOptions = {};
        dayOptions["idKalender"] = "";
        if (i == 0 || i > this.hariAktif) {
          dayOptions["class"] = "box-day weekend";
        } else {
          dayOptions["class"] = "box-day weekday";
        }

        if (initDate <= momentTotalDays) {
          dayOptions["date"] = initDate;
          initDate++;
        } else {
          dayOptions["date"] = "";
        }

        if (dayOptions["date"] != "") {
          let dateString = momentDate.year().toString() + "-" + (momentDate.month() + 1).toString() + "-" + dayOptions["date"];
          let newDate = new Date(dateString).toUTCString();
          let createDate = moment(newDate).format("YYYY-MM-DD").toString();
          dayOptions["fullDate"] = createDate;

          if (this.dataKalenderAkademik.hasOwnProperty(createDate)) {
            dayOptions["class"] = dayOptions["class"] + " eventday";
            dayOptions["idKalender"] = this.dataKalenderAkademik[createDate].id_kalender;
            dayOptions["idKegiatan"] = this.dataKalenderAkademik[createDate].id_kegiatan;
            dayOptions["keterangan"] = this.dataKalenderAkademik[createDate].keterangan;
            dayOptions["namaKegiatan"] = this.dataKalenderAkademik[createDate].nama_kegiatan;
          }
        }

        day.push(dayOptions);
      }

      week.push(day);
    }
    this.dateInMonth = week;
  }

  selectSemester() {
    let alert = this.alertCtrl.create({
      title: "Pilih Semester",
      inputs: [
        {
          type: 'radio',
          label: "Semester Ganjil",
          checked: (this.selectedSemester == 0) ? true : false,
          value: "0"
        },
        {
          type: 'radio',
          label: "Semester Genap",
          checked: (this.selectedSemester == 1) ? true : false,
          value: "1"
        }
      ],
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

            this.selectedSemester = parseInt(data);
            let startMonth = this.dataSemester[this.selectedSemester];
            let date = new Date().toUTCString();

            let dateNow = new Date().toUTCString();
            let startDate = new Date(startMonth.tglMulai).toUTCString();
            let endDate = new Date(startMonth.tglAkhir).toUTCString();

            if (Date.parse(dateNow) >= Date.parse(startDate) && Date.parse(dateNow) <= Date.parse(endDate)) {
              date = new Date(new Date(dateNow).getFullYear(), new Date(dateNow).getMonth(), 1).toUTCString();
            } else {
              date = new Date(new Date(endDate).getFullYear(), new Date(endDate).getMonth(), 1).toUTCString();
            }

            this.show(date);

          }
        }
      ]
    });
    alert.present();
  }

  selectMonth() {
    let monthList = this.dataSemester[this.selectedSemester].bulan;
    let inputList = [];
    let currentMonth = moment(this.selectedDate).format('MMMM, YYYY');

    monthList.forEach(el => {
      let createDate = moment(el).format('MMMM, YYYY');
      inputList.push({
        type: "radio",
        label: createDate,
        checked: (createDate == currentMonth) ? true : false,
        value: el
      });
    });

    let alert = this.alertCtrl.create({
      title: "Pilih Bulan",
      inputs: inputList,
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
            let date = new Date(data).toUTCString();
            this.show(date);
          }
        }
      ]
    });
    alert.present();
  }

  nextMonth() {
    let currentMonth = moment(this.selectedDate);
    let addedMonth = currentMonth.add(1, 'M');
    let endMonth = this.dataSemester[this.selectedSemester].tglAkhir;
    if(Date.parse(addedMonth.toISOString()) <= Date.parse(endMonth)) {
      this.show(addedMonth)
    }
  }

  backMonth() {
    let currentMonth = moment(this.selectedDate);
    let addedMonth = currentMonth.add(-1, 'M');
    let startMonthTemp = this.dataSemester[this.selectedSemester].tglMulai;
    let startMonth = moment(startMonthTemp).add(-1, 'M');
    if(Date.parse(startMonth.toISOString()) < Date.parse(addedMonth.toISOString())) {
      this.show(addedMonth)
    }
  }

  goToTask(day) {
    if(day.date != "") {
      this.navCtrl.push("DetailKalenderPage", { param: day })
    }
  }

}
