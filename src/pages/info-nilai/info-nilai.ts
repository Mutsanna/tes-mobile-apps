import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Chart } from 'chart.js';
import * as $ from 'jquery';

import { DataService } from '../../providers/data-service';
import { GlobalFunction } from '../../providers/global-function';

@IonicPage()
@Component({
  selector: 'page-info-nilai',
  templateUrl: 'info-nilai.html',
})
export class InfoNilai {

  nis: string;
  name: string;
  class: string;
  date: string;
  lineChart: any;
  allData: any;
  dataLast: any;
  dataLastUlangan: any;
  semesterLast: string;
  semesterView: string;
  cbView: boolean;
  typeView: string;
  endLoadData: boolean = false;


  cbSemester: any[] = [];
  list: Array<{ matpel: string, nilai: string }>;
  listUlangan: any[] = [];

  namaMatpel: any[] = [];
  detailMatpetl: any[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public dataService: DataService,
    public globalFunction: GlobalFunction,
    public alertCtrl: AlertController
  ) { }

  ionViewWillEnter() {
    this.globalFunction.showLoader();
    this.dataSemester();
    var i = 0;
    let interval = setInterval(() => {
      if (this.endLoadData === true) {
        this.globalFunction.dismissLoader();
        clearInterval(interval);
      }
      if (i === 20) {
        this.globalFunction.dismissLoader();
        this.alertNotification();
        clearInterval(interval);
      }
      i++;
    }, 1000);
  }

  ionViewDidLoad() {

  }

  dataSemester() {
    this.dataService.getDataSemester()
      .then(semester => {
        var z = 0;
        var type_nilai;

        if (semester === "Tidak ada semester") {
          //this.cbView = null;
          this.typeView = "ulangan";
          type_nilai = "ulangan";
        } else {
          // this.cbView = true;
          this.typeView = "raport";
          type_nilai = "raport";
        }

        this.cbSemester = [];
        var value, lastData = semester.length - 1, checked;
        var idRaport;

        this.dataService.getDataSemesterUlangan()
          .then(dataUlangan => {

            if (semester === "Tidak ada semester" && dataUlangan === "Tidak ada ulangan") {
              this.cbView = null;
            } else {
              this.cbView = true;
            }

            if (dataUlangan !== "Tidak ada ulangan") {
              var lastDataUlangan = dataUlangan.length - 1;
              var val_ulangan;
              var id_semester;

              for (var j in dataUlangan) {
                this.dataLastUlangan = j;
                val_ulangan = {
                  id_cb: z,
                  id_semester: dataUlangan[j].id_semester,
                  semester: dataUlangan[j].nama_semester,
                  type: "ulangan"
                };

                if (this.dataLastUlangan === lastDataUlangan.toString()) {
                  id_semester = dataUlangan[j].id_semester;
                  if (semester === "Tidak ada semester") {
                    checked = true;
                  } else {
                    checked = false;
                  }
                } else {
                  checked = false;
                }

                this.cbSemester.push({
                  type: 'radio',
                  label: "Ulangan Harian Semester " + dataUlangan[j].nama_semester,
                  checked: checked,
                  value: val_ulangan
                });
                z++;
              }
            } else {
              this.typeView = "raport";
              type_nilai = "raport";
            }

            if (semester !== "Tidak ada semester") {
              for (var i in semester) {
                this.dataLast = i;
                value = {
                  id_cb: z,
                  id_raport: semester[i].id_raport,
                  id_raport_type: semester[i].id_raport_type,
                  id_semester: semester[i].id_semester,
                  type: "raport"
                };

                if (this.dataLast === lastData.toString()) {
                  checked = true;
                  idRaport = semester[i].id_raport;
                } else {
                  checked = false;
                }

                this.cbSemester.push({
                  type: 'radio',
                  label: semester[i].tingkat + " " + semester[i].jenjang + " : " + semester[i].raport_type_name + " " + semester[i].nama_semester,
                  checked: checked,
                  value: value
                });
                z++;
              }
            }

            this.dataService.getDataRaport(idRaport, type_nilai, id_semester)
              .then(data => {
                // console.log(data);
                var resData = {
                  data: data,
                  type: type_nilai
                };
                this.endLoadData = true;
                this.loadView(resData);
              });
          });
      });
  }

  loadView(data) {
    if (data.type === "raport") {
      this.dataUser(data.data);
      // this.dataNilai(data.data);
      this.dataTest(data.data);
      this.dataChart(data.data);
    } else {
      this.dataUserUlangan();
      this.dataNilaiUlangan(data.data);
    }
  }

  alertNotification() {
    let confirm = this.alertCtrl.create({
      title: 'Low internet connection',
      message: 'Reload?',
      buttons: [
        {
          text: 'No',
          handler: () => {

          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.ionViewWillEnter();
          }
        }
      ]
    });
    confirm.present();
  }

  selectSemester() {
    let alert = this.alertCtrl.create({
      title: "Pilih Semester",
      inputs: this.cbSemester,
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

            var select = this.cbSemester,
              idRaport = data.id_raport;
            var id_semester = data.id_semester;
            this.typeView = data.type;

            for (var i in select) {
              // if (select[i].value.id_raport === data.id_raport) {
              if (select[i].value.id_cb === data.id_cb) {
                select[i].checked = true;
                // idRaport = select[i].value.id_raport;
                // this.typeView = select[i].value.type;
              } else {
                select[i].checked = false;
              }
            }

            this.dataService.getDataRaport(idRaport, this.typeView, id_semester)
              .then(data => {
                var resData = {
                  data: data,
                  type: this.typeView
                };
                this.loadView(resData);
              });
          }
        }
      ]
    });
    alert.present();
  }

  dataUser(data) {
    this.storage.get('dataUser')
      .then(dataUser => {
        this.nis = dataUser.username;
        this.name = dataUser.nama;
        this.storage.get('dataKelas')
          .then(dataKelas => {
            if (data !== "Tidak ada nilai") {
              this.class = data.tingkat + " " + data.jenjang;  //+" "+ data.nama_kelas;
              this.semesterView = data.raport_type + " " + data.nama_semester;
            } else {
              this.class = dataKelas[0].tingkat + " " + dataKelas[0].jenjang;  //+" "+ data.nama_kelas;
              this.semesterView = null;
            }
          });
      });
  }

  dataUserUlangan() {
    this.storage.get('dataUser')
      .then(dataUser => {
        this.nis = dataUser.username;
        this.name = dataUser.nama;
        this.storage.get('dataKelas')
          .then(dataKelas => {
            this.class = dataKelas[0].tingkat + " " + dataKelas[0].jenjang;  //+" "+ data.nama_kelas;
            this.semesterView = "Nilai Ulangan Harian";
          });
      });
  }

  dataNilai(data) {
    // this.list = [];

    // for (var i in data.nama_mapel) {
    //   this.list.push({
    //     matpel: data.nama_mapel[i],
    //     nilai: data.nilai_mapel[i]
    //   });
    // }
  }

  dataTest(data) {
    this.list = [];

    for (var i in data.nama_mapel) {
      this.list.push({
        matpel: data.nama_mapel[i],
        nilai: data.nilai_mapel[i]
      });
    }
  }

  dataNilaiUlangan(data) {

    function convertDate(dateString) {
      var p = dateString.split(/\D/g)
      return [p[2], p[1], p[0]].join("-")
    }

    var detail = [];
    var matpel = [];
    var checkMapel = "";
    var dataFilter;

    var data_temp = [];
    var data_filter = [];

    //console.log(data);

    this.namaMatpel = data.mapel;
    this.dataNilai = data.nilai_mapel;

    for (var i in data) {
      checkMapel = data[i].nama_mapel;

      var data_array_filter = data_temp.filter(function (x) {
        return x === checkMapel;
      });

      if (data_array_filter.length === 0) {
        data_temp.push(checkMapel);
        data_filter = data.filter(function (x) {
          return x.nama_mapel === checkMapel;
        });

        detail = [];
        for (var j in data_filter) {
          detail.push({
            nilai: data_filter[j].nilai,
            tanggal: convertDate(data_filter[j].tanggal_ulangan),
            ulangan_ke: data_filter[j].ulangan_ke
          });
        }

        matpel.push({
          matpel: checkMapel,
          detail: detail
        });
      }

    }

    this.listUlangan = matpel;
  }

  dataChart(data) {

    if (data !== "Tidak ada nilai") {
      var labels = data.nama_mapel_substr,
        nilai = data.nilai_mapel;

      //$('#line_chart').empty();
      //$('#chart_pos').append("<canvas id='line_chart'></canvas>");

      this.lineChart = new Chart(document.getElementById("line_chart"), {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: "Grafik Nilai " + data.raport_type + " " + data.nama_semester,
              fill: false,
              lineTension: 0.1,
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: "rgba(75,192,192,1)",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba(75,192,192,1)",
              pointHoverBorderColor: "rgba(220,220,220,1)",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: nilai,
              spanGaps: false,
            }
          ]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                max: 10
              }
            }]
          },
          animation: {
            onComplete: function () {
              var chartInstance = this.chart;
              var ctx = chartInstance.ctx;
              var height = chartInstance.controller.boxes[0].bottom;
              ctx.textAlign = "center";
              Chart.helpers.each(this.data.datasets.forEach(function (dataset, i) {
                var meta = chartInstance.controller.getDatasetMeta(i);
                Chart.helpers.each(meta.data.forEach(function (bar, index) {
                  ctx.fillText(dataset.data[index], bar._model.x, height - ((height - bar._model.y) / 2));
                }), this)
              }), this);
            }
          },
          tooltips: {
            enabled: false
          }
        }
      });

    }

  }

}
