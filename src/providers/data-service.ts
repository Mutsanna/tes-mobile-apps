import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import 'rxjs/add/operator/map';

import { Storage } from '@ionic/storage';
import { infoSaldoModel, infoHistoryItemModel, infoHistoryModel, infoAccountModel, infoIuranModel } from '../model/financeModel';

@Injectable()
export class DataService {

  // ipAddress: any = "http://localhost:8080/MadaniSS_API/index.php/api/";
  // ipAddress: any = "http://192.168.1.4:8080/MadaniSS_API/index.php/api/";
  // ipAddress: any = "http://192.168.100.13:8080/MadaniSS_API/index.php/api/";
  // ipAddress: any = "http://madani-tech.com/MadaniSS_API/index.php/api/";
  // ipAddress: any = "http://hidayatullah.app.madani-tech.com/Depok/api/index.php/api/";
  // ipAddress: any = "http://192.168.1.2:8080/MadaniSS_Alkhawarizmi/index.php/api/";
  // ipAddress: any = "http://alkhawarizmi.madani-tech.com/index.php/api/";
  // ipAddress: any = "http://192.168.1.2:8080/MadaniSS_JOINAPI/index.php/api/";
  // ipAddress: any = "http://tektikal.co.id/icm.kendari/index.php/api/";
  // ipAddress: any = "http://localhost:8080/MadaniSS_Alkhawarizmi/index.php/api/";
  ipAddress: any = "https://IbnuAbbas.madani-tech.com/index.php/api/";
  // ipAddress: any = "http://ypis.qatrunnada.madani-tech.com/index.php/api/";
  // ipAddress: string;
  jwtHelper: JwtHelper = new JwtHelper();

  dataReport: any;
  dataAbsensi: any;
  dataInfoNilai: any;
  dataInformasi: any;
  dataRapot: any;
  dataRaport: any;
  dataPesan: any;
  dataSemester: any;
  dataSemesterUlangan: any;
  sendPesan: any;
  sendInformasi: any;
  dataSiswaInKelas: any;
  dataOneSignal: any;

  constructor(public http: Http, public storage: Storage) {
    // this.storage.get('ip')
    //     .then(ip => {
    //       this.ipAddress = "http://"+ ip +"/MadaniSS_API/index.php/api/";
    //     });
  }

  getDataFinance(idSiswa) {
    return new Promise(resolve => {
      this.storage.get('token').then(token => {
        var url = this.ipAddress + "C_Finance/check_saldo?id_siswa=" + idSiswa;

        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Authorization', token);

        let options = new RequestOptions({ headers: headers });

        this.http.get(url, options).map(res => res.json())
          .subscribe(data => {
            var result: any = data;
            resolve(result);
          });
      });
    });
  }

  getDataFinanceByNis(nis) {
    return new Promise((resolve, reject) => {
      this.storage.get('token').then(token => {
        var url = this.ipAddress + "C_Finance/check_saldo_v2?nis=" + nis;

        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Authorization', token);

        let options = new RequestOptions({ headers: headers });

        this.http.get(url, options).map(res => res.json())
          .subscribe(data => {
            var result: any = data;
            resolve(result);
          },
          () => {
            reject("Nomor Rekening Tidak Ditemukan")
          });
      });
    });
  }

  getDataFinanceMulti(nis: string) {
    return new Promise((resolve, reject) => {
      this.storage.get('token').then(token => {
        var url = this.ipAddress + "C_Finance/finance_info?nis=" + nis;

        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Authorization', token);

        let options = new RequestOptions({ headers: headers });

        this.http.get(url, options).map(res => res.json())
          .subscribe(data => {
            var result: any = data;
            resolve(result);
          },
          () => {
            reject("Nomor Rekening Tidak Ditemukan")
          });
      });
    });
  }

  getFinanceHistory(startDate: string = null, endDate: string = null) {
    return new Promise((resolve, reject) => {
      this.storage.get('dataFinance').then((dataFinance: any) => {
        switch (dataFinance.provider.toUpperCase()) {
          case "USSI": {
            this.ussiGetHistory(dataFinance).then(result => {
              resolve(result)
            },
            err => {
              reject(err)
            })
            break
          }

          case "CBS": {
            if (startDate != null && endDate != null) {
              this.cbsGetHistory(dataFinance, startDate, endDate).then(result => {
                resolve(result)
              },
              err => {
                reject(err)
              })
            } else {
              reject("Start date & end date is missing.")
            }
            break
          }
        }
      });
    });
  }

  getFinanceIuran(): Promise<Array<infoIuranModel>> {
    return new Promise((resolve, reject) => {
      this.storage.get('dataFinance').then((dataFinance: any) => {
        switch(dataFinance.provider.toUpperCase()) {
          case "USSI": {
            this.ussiGetIuran(dataFinance).then(result => {
              resolve(result)
            },
            err => {
              reject(err)
            })
            break
          }

          case "CBS": {
            this.cbsGetIuran(dataFinance).then(result => {
              resolve(result)
            },
            err => {
              reject(err)
            })
            break
          }
        }
      });
    });
  }

  getFinanceSaldo(): Promise<infoSaldoModel> {
    return new Promise<infoSaldoModel> ((resolve, reject) => {
      this.storage.get('dataFinance').then((dataFinance: any) => {
        switch (dataFinance.provider.toUpperCase()) {
          case "USSI": {
            this.ussiCheckSaldo(dataFinance).then(result => {
              resolve(result)
            },
            err => {
              reject(err)
            })
            break;
          }
          case "CBS": {
            this.cbsCheckSaldo(dataFinance).then(result => {
              resolve(result)
            },
            err => {
              reject(err)
            })
            break;
          }
          default : {
            reject("Finance provider is not defined!")
          }
        }
      })
    })
  }

  private ussiCheckSaldo(dataFinance: any): Promise<infoSaldoModel> {
    return new Promise<infoSaldoModel>((resolve, reject) => {
      var url = dataFinance.url;
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      dataFinance.body['api_code'] = "50001";
      this.http.post(url, dataFinance.body).map(res => res.json())
        .subscribe(data => {
          if (data.hasOwnProperty('response_data') && data.response_data.length > 0) {
            var result: infoSaldoModel = new infoSaldoModel({
              noRekening: data.response_data[0].no_rekening,
              saldo: data.response_data[0].saldo_akhir,
              namaPemilik: ""
            });
            resolve(result);
          }
          else {
            reject("Info saldo tidak dapat ditampilkan.")
          }
        },
        err => {
          console.log(err)
          reject("Something went wrong.<br>Please try again later.")
        });
    })
  }

  private ussiGetIuran(dataFinance: any): Promise<Array<infoIuranModel>> {
    return new Promise<Array<infoIuranModel>>((resolve, reject) => {
      var url = dataFinance.url;
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      dataFinance.body['api_code'] = "50003";
      this.http.post(url, dataFinance.body).map(res => res.json())
        .subscribe(data => {
          if (data.response_code == "00") {
            resolve(data.response_data.map(item => {
              return new infoIuranModel({
                tagihan: item.tagihan,
                iuran: item.iuran,
                tunggakan: item.tunggakan,
                accNumber: item.sandi_kode,
                keterangan: item.deskripsi
              })
            }));
          }
          else {
            reject("Something went wrong.<br>Please try again later.")
          }
        },
        err => {
          console.log(err)
          reject("Something went wrong.<br>Please try again later.")
        });
    })
  }

  private ussiGetHistory(dataFinance: any): Promise<infoHistoryModel> {
    return new Promise<infoHistoryModel>((resolve, reject) => {
      var url = dataFinance.url;
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      dataFinance.body['api_code'] = "50002";
      this.http.post(url, dataFinance.body).map(res => res.json())
        .subscribe(data => {
          var summaryData = {
            debet: 0,
            kredit: 0,
            saldo: 0
          };
          var historyList: Array<infoHistoryItemModel> = []
          if (data.hasOwnProperty('response_data')) {
            if (data.response_data.hasOwnProperty('detail')) {
              summaryData.saldo = data.response_data.saldo_akhir
              for(let i = 0; i < data.response_data.detail.length; i++) {
                let item = data.response_data.detail[i]
                let codeDate = "";
                if (item.my_kode_trans == 100) {
                  summaryData.kredit += item.pokok;
                  codeDate = "K " + item.tgl_trans;
                } else if (item.my_kode_trans == 200) {
                  summaryData.debet += item.pokok;
                  codeDate = "D " + item.tgl_trans;
                }
      
                historyList.push(new infoHistoryItemModel({
                  codeDate: codeDate,
                  nominal: item.pokok,
                  keterangan: item.keterangan
                }))
              };
            } else {
              for(let i = 0; i < data.response_data.length; i++) {
                let item = data.response_data[i]
                let codeDate = "";
                if (item.my_kode_trans == 100) {
                  summaryData.kredit += item.pokok;
                  summaryData.saldo += item.pokok;
                  codeDate = "K " + item.tgl_trans;
                } else if (item.my_kode_trans == 200) {
                  summaryData.debet += item.pokok;
                  summaryData.saldo -= item.pokok;
                  codeDate = "D " + item.tgl_trans;
                }
      
                historyList.push(new infoHistoryItemModel({
                  codeDate: codeDate,
                  nominal: item.pokok,
                  keterangan: item.keterangan
                }))
              };
            }
          }
          resolve(new infoHistoryModel({
            debet: summaryData.debet,
            kredit: summaryData.kredit,
            saldo: summaryData.saldo,
            historyItem: historyList,
            provider: dataFinance.provider
          }));
        },
        err => {
          console.log(err)
          reject("Something went wrong.<br>Please try again later.")
        });
    })
  }

  private cbsCheckSaldo(dataFinance: any): Promise<infoSaldoModel> {
    return new Promise<infoSaldoModel>((resolve, reject) => {
      dataFinance.data['api_code'] = "101002"; // kode aksi
      let url = dataFinance.url + "/" + dataFinance.data["api_code"];
      let headers = new Headers();
      let body = {
        "client_id": dataFinance.data["kode_lkm"],
        "account_number": dataFinance.data["no_rekening"]
      }
      headers.append('Content-Type', 'application/json')
      headers.append("Authorization", "Bearer " + dataFinance.token)

      let options = new RequestOptions({headers: headers})

      this.http.post(url, body, options).map(res => res.json())
        .subscribe(data => {
          var result: infoSaldoModel = new infoSaldoModel({
            noRekening: data.response_data.account_number,
            namaPemilik: data.response_data.customer_name,
            saldo: parseInt(data.response_data.balance)
          });
          resolve(result);
        },
        err => reject(err));
    })
  }

  private cbsGetIuran(dataFinance: any): Promise<Array<infoIuranModel>> {
    return new Promise<Array<infoIuranModel>>((resolve, reject) => {
      dataFinance.data["api_kode"] = "101005"
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Bearer ' + dataFinance.token);
      let options = new RequestOptions({headers: headers})

      var url: any = dataFinance.url + "/" + dataFinance.data["api_kode"];
      let dateNow = new Date()

      let body = {
        "date_transaction": dateNow.toISOString().substr(0, 10).split("-").join(""),
        "client_id": dataFinance.data["kode_lkm"],
        "customer_id": dataFinance.data["customer_id"]
      }
      this.http.post(url, body, options).map(res => res.json())
        .subscribe(data => {
          if (data.response_code == "00") {
            resolve(data.response_data.map(item => {
              return new infoIuranModel({
                tagihan: item.billing_info,
                iuran: item.total_paid,
                tunggakan: item.bill_arrear,
                accNumber: item.account_number,
                keterangan: item.billing_type
              })
            }));
          } else if (data.response_code == "01") {
            resolve([])
          }
          else {
            reject("Something went wrong.<br>Please try again later.")
          }
        },
        err => {
          console.log(err)
          reject("Something went wrong.<br>Please try again later.")
        });
    })
  }

  private cbsGetHistory(dataFinance: any, startDate: string, endDate: string): Promise<infoHistoryModel> {
    return new Promise<infoHistoryModel>((resolve, reject) => {
      dataFinance.data["api_code"] = "101003"
      let url = dataFinance.url + "/" + dataFinance.data["api_code"]
      let headers = new Headers();
      let body = {
        "account_number": dataFinance.data["no_rekening"],
        "client_id": dataFinance.data["kode_lkm"],
        "start_date": startDate,
        "end_date": endDate
      }
      headers.append('Content-Type', 'application/json')
      headers.append('Authorization', 'Bearer ' + dataFinance.token)
      let options = new RequestOptions({headers: headers})

      this.http.post(url, body, options).map(res => res.json())
        .subscribe(data => {
          var summaryData = {
            debet: 0,
            kredit: 0,
            saldo: 0
          };
          summaryData.saldo += parseInt(data.early_saving) //saldo sebelumnya
          var historyList: Array<infoHistoryItemModel> = []
          if (data.hasOwnProperty('response_data') && data.response_code == "00") {

            historyList.push(new infoHistoryItemModel({
              codeDate: "K",
              nominal: parseInt(data.early_saving),
              keterangan: "Saldo Sebelumnya"
            }))

            if (data.response_data.length > 0) {
              for(let i = 0; i < data.response_data.length; i++) {
                let item = data.response_data[i]
                let codeDate = "";
                let nominal = 0
                if (item.my_trans_code == 100) {
                  summaryData.kredit += item.credit;
                  summaryData.saldo += item.credit;
                  codeDate = "K " + item.transaction_date;
                  nominal = item.credit
                } else if (item.my_trans_code == 200) {
                  summaryData.debet += item.debet;
                  summaryData.saldo -= item.debet;
                  codeDate = "D " + item.transaction_date;
                  nominal = item.debet
                }
      
                historyList.push(new infoHistoryItemModel({
                  codeDate: codeDate,
                  nominal: nominal,
                  keterangan: item.description
                }))
              };
            }
          } else {
            reject("Something went wrong.<br>Please try again later.")
          }
          resolve(new infoHistoryModel({
            debet: summaryData.debet,
            kredit: summaryData.kredit,
            saldo: summaryData.saldo,
            historyItem: historyList,
            provider: dataFinance.provider
          }));
        },
        err => {
          console.log(err)
          reject("Something went wrong.<br>Please try again later.")
        });
    })
  }

  cbsAccountCheck(noRekening: string) {
    return new Promise((resolve, reject) => {
      this.storage.get("dataFinance").then(dataFinance => {
        dataFinance.data['api_code'] = "101004"; // kode aksi
        dataFinance.data['no_rekening'] = noRekening
        let url = dataFinance.url + "/" + dataFinance.data["api_code"];
        let headers = new Headers();
        let body = {
          "client_id": dataFinance.data["kode_lkm"],
          "account_number": dataFinance.data["no_rekening"]
        }
        headers.append('Content-Type', 'application/json')
        headers.append("Authorization", "Bearer " + dataFinance.token)
  
        let options = new RequestOptions({headers: headers})
  
        this.http.post(url, body, options).map(res => res.json())
          .subscribe(data => {
            if (data.response_code == "00") {
              var result: infoAccountModel = new infoAccountModel({
                noRekening: data.response_data.account_number,
                namaPemilik: data.response_data.customer_name,
                namaIbu: data.response_data.mothers_name,
                ttl: data.response_data.place_of_birth + ", " + data.response_data.date_of_birth,
                alamat: data.response_data.address,
                saldo: parseInt(data.response_data.balance)
              });
              resolve(result);
            }
            else {
              reject("Nomor rekening tidak ditemukan!")
            }
          },
          err => {
            console.log(err)
            reject("Something went wrong.<br>Please try again later.")
          });
      })
    })
  }

  cbsTransferSaldo(pengirim: string, penerima: string, nominal: number, keterangan: string) {
    return new Promise((resolve, reject) => {
      this.cbsGenerateTrxId().then(trxInfo => {
        this.storage.get("dataFinance").then(dataFinance => {
          let dateNow = new Date()
          let time = (dateNow.getHours() < 10 ? "0" + dateNow.getHours() : dateNow.getHours()).toString() + ":" +
                     (dateNow.getMinutes() < 10 ? "0" + dateNow.getMinutes() : dateNow.getMinutes()).toString()
          let desc = keterangan != null && keterangan != "" ? keterangan : "Transfer dari No Rek " + pengirim + " ke No Rek Tujuan " + penerima
          
          dataFinance.data['api_code'] = "101001"; // kode aksi
          let url = dataFinance.url + "/" + dataFinance.data["api_code"];
          let headers = new Headers();
          let body = {
            "account_number": pengirim,
            "client_id": dataFinance.data["kode_lkm"],
            "trx_ref_id": trxInfo["trx_ref_id"],
            "trx_number": trxInfo["trx_no"],
            "date_transaction": dateNow.toISOString().substr(0, 10).split("-").join(""),
            "hour_transaction": time,
            "trx_amount": nominal,
            "trans_code": "204",
            "ip_add": dataFinance.url,
            "trx_description": desc,
            "account_number_vs": penerima,
            "my_trans_code": "200"
          }
          headers.append('Content-Type', 'application/json')
          headers.append("Authorization", "Bearer " + dataFinance.token)
    
          let options = new RequestOptions({headers: headers})
    
          this.http.post(url, body, options).map(res => res.json())
            .subscribe(data => {
              if (data.response_code == "00") {
                resolve(data.response_data);
              }
              else {
                reject("Something went wrong.<br> Please try again later.")
              }
            },
            err => {
              console.log(err)
              reject("Something went wrong.<br>Please try again later.")
            });
        })
      })
    })
  }

  private cbsGenerateTrxId() {
    return new Promise((resolve, reject) => {
      this.storage.get("dataFinance").then(dataFinance => {
        dataFinance.data['api_code'] = "201001"; // kode aksi
        let url = dataFinance.url + "/" + dataFinance.data["api_code"];
        let headers = new Headers();
        let body = {
          "client_id": dataFinance.data["kode_lkm"],
          "date_transaction": new Date().toISOString().substr(0, 10).split("-").join("")
        }
        headers.append('Content-Type', 'application/json')
        headers.append("Authorization", "Bearer " + dataFinance.token)
  
        let options = new RequestOptions({headers: headers})
  
        this.http.post(url, body, options).map(res => res.json())
          .subscribe(data => {
            if (data.response_code == "00") {
              resolve(data.response_data);
            }
            else {
              reject("Something went wrong.<br> Please try again later.")
            }
          },
          err => {
            console.log(err)
            reject("Something went wrong.<br>Please try again later.")
          });
      })
    })
  }

  getNilaiGeneral(tipe, kelasId, siswaId, jenis) {
    return new Promise(resolve => {
      this.storage.get('token').then(token => {
        var url = this.ipAddress + "C_Nilai/nilai_general?tipe=" + tipe + "&kelas_id=" + kelasId + "&siswa_id=" + siswaId + "&jenis=" + jenis;

        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Authorization', token);

        let options = new RequestOptions({ headers: headers });

        this.http.get(url, options)
          .map(res => res.json())
          .subscribe(data => {
            var result: any = data;
            resolve(result);
          });
      });
    });
  }

  getJenisUlangan() {
    return new Promise(resolve => {
      this.storage.get('token').then(token => {
        var url = this.ipAddress + "C_Nilai/jenis_ulangan";

        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Authorization', token);

        let options = new RequestOptions({ headers: headers });

        this.http.get(url, options)
          .map(res => res.json())
          .subscribe(data => {
            var result: any = data;
            resolve(result);
          });
      });
    });
  }

  getKelasSiswaAll(NIS) {
    return new Promise(resolve => {
      this.storage.get('token').then(token => {
        var url = this.ipAddress + "C_Kelas/kelas_siswa_all?NIS=" + NIS;

        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Authorization', token);

        let options = new RequestOptions({ headers: headers });

        this.http.get(url, options)
          .map(res => res.json())
          .subscribe(data => {
            var result: any = data;
            resolve(result);
          });
      });
    });
  }

  getKelasGuruActive(idUser) {
    return new Promise(resolve => {
      this.storage.get('token').then(token => {
        var url = this.ipAddress + "C_Kelas/kelas_guru_active?id_user=" + idUser;

        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Authorization', token);

        let options = new RequestOptions({ headers: headers });

        this.http.get(url, options)
          .map(res => res.json())
          .subscribe(data => {
            var result: any = data;
            resolve(result);
          });
      });
    });
  }

  getKelasSiswaActive(NIS) {
    return new Promise(resolve => {
      this.storage.get('token').then(token => {
        var url = this.ipAddress + "C_Kelas/kelas_siswa_active?NIS=" + NIS;

        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Authorization', token);

        let options = new RequestOptions({ headers: headers });

        this.http.get(url, options)
          .map(res => res.json())
          .subscribe(data => {
            var result: any = data;
            resolve(result);
          });
      });
    });
  }

  sendNotification(content, filter) {
    this.dataOneSignal = null;
    if(this.dataOneSignal) {
      return Promise.resolve(this.dataOneSignal);
    }

    var url = "https://onesignal.com/api/v1/notifications",
      app_id = "f74b990a-786d-40de-843e-f3b80f4a1b39",
      authorization = "Basic NGY3ODAxYmEtYjQ4YS00YjkyLTgzNzgtNTkzZGUzZmE2YWI3";

      // var filters = [
      //         {"field": "tag", "key": "group", "relation": "=", "value": "siswa"}
      //       ];

    let headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');
    headers.append('Authorization', authorization);

    let options = new RequestOptions({headers: headers});
    var body = {
      app_id: app_id,
      contents: { en: content },
      filters: filter
    };

    return new Promise(resolve => {
      this.http.post(url, body, options)
        .map(res => res.json())
        .subscribe(data => {
          this.dataOneSignal = data;
          resolve(this.dataOneSignal);
        });
    });
  }

  getDataAbsensi() {
    this.dataAbsensi = null;
    if(this.dataAbsensi) {
      return Promise.resolve(this.dataAbsensi);
    }

    return new Promise(resolve => {
      this.storage.get('token')
          .then(token => {
            var decodeToken = this.jwtHelper.decodeToken(token),
                idKartu = decodeToken.data_user.id_kartu;

            var url = this.ipAddress + "C_Absen/absen?idKartu="+ idKartu;

            let headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded');
            headers.append('Authorization', token);

            let options = new RequestOptions({headers: headers});

            this.http.get(url, options)
                .map(res => res.json())
                .subscribe(data => {
                  this.dataAbsensi = data;
                  resolve(this.dataAbsensi);
                });
          });
    });
  }

  getDataSemesterUlangan() {
    this.dataSemesterUlangan = null;
    if(this.dataSemesterUlangan) {
      return Promise.resolve(this.dataSemesterUlangan);
    }

    return new Promise(resolve => {
      this.storage.get('token')
          .then(token => {
            var decodeToken = this.jwtHelper.decodeToken(token);
            var id_kelas = decodeToken.data_kelas[0].id_kelas,
                id_siswa = decodeToken.data_user.id_siswa;

            var url = this.ipAddress + "C_Semester/ulangan?idKelas="+ id_kelas + "&idSiswa="+ id_siswa;

            let headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded');
            headers.append('Authorization', token);

            let options = new RequestOptions({headers: headers});

            this.http.get(url, options)
                .map(res => res.json())
                .subscribe(data => {
                  this.dataSemesterUlangan = data;
                  // this.dataSemesterUlangan = {
                  //   data: data,
                  //   id_kelas: id_kelas,
                  //   id_siswa: id_siswa
                  // };
                  resolve(this.dataSemesterUlangan);
                });
          });
    });
  }

  getDataSemester() {
    this.dataSemester = null;
    if(this.dataSemester) {
      return Promise.resolve(this.dataSemester);
    }

    return new Promise(resolve => {
      this.storage.get('token')
          .then(token => {
            var decodeToken = this.jwtHelper.decodeToken(token),
                siswaNIS = decodeToken.data_user.username;

            var url = this.ipAddress + "C_Semester/semester?siswaNIS="+ siswaNIS;

            let headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded');
            headers.append('Authorization', token);

            let options = new RequestOptions({headers: headers});

            this.http.get(url, options)
                .map(res => res.json())
                .subscribe(data => {
                  this.dataSemester = data;
                  resolve(this.dataSemester);
                });
          });
    });
  }

  getDataRaport(idRaport, type, idSemester) {
    this.dataRaport = null;
    if(this.dataRaport) {
      return Promise.resolve(this.dataRaport);
    }

    return new Promise(resolve => {
      this.storage.get('token')
          .then(token => {
            var decodeToken = this.jwtHelper.decodeToken(token),
                idKelas = decodeToken.data_kelas[0].id_kelas,
                idSiswa = decodeToken.data_user.id_siswa;

            // var url = this.ipAddress + "C_Nilai/nilai?idKelas="+ idKelas +"&idSiswa="+ idSiswa +"&idSemester="+ idSemester  +"&idRaportType="+ idRaportType;
            // var url = this.ipAddress + "C_Nilai/nilai?idRaport="+ idRaport;
            var url;

            if(type === "raport") {
              url = this.ipAddress + "C_Nilai/nilai?idRaport="+ idRaport;
            } else {
              url = this.ipAddress + "C_Nilai/ulangan?idKelas="+ idKelas +"&idSiswa="+ idSiswa +"&idSemester="+ idSemester;
            }

            let headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded');
            headers.append('Authorization', token);

            let options = new RequestOptions({headers: headers});

            this.http.get(url, options)
                .map(res => res.json())
                .subscribe(data => {
                  this.dataRaport = data;
                  resolve(this.dataRaport);
                });
          });
    });
  }

  getDataInformasi(update, idInformasi) {
    this.dataInformasi = null;
    if(this.dataInformasi) {
      return Promise.resolve(this.dataInformasi);
    }

    return new Promise(resolve => {
      this.storage.get('token')
          .then(token => {
            var decodeToken = this.jwtHelper.decodeToken(token),
                group = decodeToken.group,
                idSiswa,
                idPegawai,
                idKelas,
                url;

            if(group === "siswa") {
              idKelas = decodeToken.data_kelas[0].id_kelas;
              idSiswa = decodeToken.data_user.id_siswa;
              if(update === true) {  
                url = this.ipAddress + "C_Informasi/informasi?idKelas="+ idKelas +"&idSiswa="+ idSiswa +"&group="+ group +"&idInformasi="+ idInformasi;   
              } else {
                url = this.ipAddress + "C_Informasi/informasi?idKelas="+ idKelas +"&idSiswa="+ idSiswa +"&group="+ group;
              }
            } else if(group === "guru") {
              idPegawai = decodeToken.data_user.id_pegawai;
              if(update === true) {
                url = this.ipAddress + "C_Informasi/informasi?group="+ group +"&idPegawai="+ idPegawai +"&idInformasi="+ idInformasi;   
              } else {
                url = this.ipAddress + "C_Informasi/informasi?idPegawai="+ idPegawai +"&group="+ group;  
              }
            }

            let headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded');
            headers.append('Authorization', token);

            let options = new RequestOptions({headers: headers});
            this.http.get(url, options)
                .map(res => res.json())
                .subscribe(data => {
                  if(data !== "Tidak ada informasi") {
                    this.dataInformasi = data;  
                  } else {
                    this.dataInformasi = 0;
                  }
                  resolve(this.dataInformasi);
                });
          });
    });
  }

  postInformasi(isiBody) {
    this.sendInformasi = null;
    if(this.sendInformasi) {
      return Promise.resolve(this.sendInformasi);
    }

    return new Promise(resolve => {
      this.storage.get('token')
          .then(token => {
            var judul = isiBody.judul,
                isi = isiBody.isi,
                idKelas = isiBody.idKelas,
                idPengirim = isiBody.idPengirim,
                url = this.ipAddress + "C_Informasi/informasi";

            let headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded');
            headers.append('Authorization', token);

            let options = new RequestOptions({headers: headers});
            var body = "idKelas="+ idKelas + "&idPengirim="+ idPengirim +"&judul="+ judul +"&isi="+ isi; 

            this.http.post(url, body, options)
                .map(res => res.json())
                .subscribe(data => {
                  this.sendInformasi = data;
                  resolve(this.sendInformasi);
                });
          });
    });
  }

  getDataSiswaInKelas(idKelas) {
    this.dataSiswaInKelas = null;
    if(this.dataSiswaInKelas) {
      return Promise.resolve(this.dataSiswaInKelas);
    }

    return new Promise(resolve => {
      this.storage.get('token')
          .then(token => {
            var url = this.ipAddress + "C_Kelas/kelas?idKelas="+ idKelas;

            let headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded');
            headers.append('Authorization', token);

            let options = new RequestOptions({headers: headers});

            this.http.get(url, options)
                .map(res => res.json())
                .subscribe(data => {
                  if(data !== "Tidak ada siswa") {
                    this.dataSiswaInKelas = data;  
                  } else {
                    this.dataSiswaInKelas = 0;
                  }
                  resolve(this.dataSiswaInKelas);
                });
          });
    });
  }

  postPesan(isiBody) {
    this.sendPesan = null;
    if(this.sendPesan) {
      return Promise.resolve(this.sendPesan);
    }

    return new Promise(resolve => {
      this.storage.get('token')
          .then(token => {
            var idPengirim = isiBody.idPengirim,
                namaPengirim = isiBody.namaPengirim,
                idPenerima = isiBody.idPenerima,
                namaPenerima = isiBody.namaPenerima,
                isiPesan = isiBody.isiPesan,
                url = this.ipAddress + "C_Pesan/pesan";
                

            let headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded');
            headers.append('Authorization', token);

            let options = new RequestOptions({headers: headers});
            var body = "idPengirim="+ idPengirim + "&namaPengirim="+ namaPengirim +"&idPenerima="+ idPenerima +"&namaPenerima="+ namaPenerima +
                        "&isiPesan="+ isiPesan;

            this.http.post(url, body, options)
                .map(res => res.json())
                .subscribe(data => {
                  this.sendPesan = data;
                  resolve(this.sendPesan);
                });
          });
    });
  }

  getPesan(idPengirim1, idPengirim2, group, list, getCount) {
    this.dataPesan = null;
    if(this.dataPesan) {
      return Promise.resolve(this.dataPesan);
    }

    return new Promise(resolve => {
      this.storage.get('token')
          .then(token => {
            var url;

            if(list === false) {
              url = this.ipAddress + "C_Pesan/pesan?idPengirim1="+ idPengirim1 +"&idPengirim2="+ idPengirim2 +"&getCount="+ getCount;              
            } else {
              url = this.ipAddress + "C_Pesan/pesan?idPengirim1="+ idPengirim1 +"&group="+ group +"&getCount="+ getCount +"&idPengirim2="+ idPengirim2;
            }

            let headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded');
            headers.append('Authorization', token);

            let options = new RequestOptions({headers: headers});

            this.http.get(url, options)
                .map(res => res.json())
                .subscribe(data => {
                  this.dataPesan = data;
                  resolve(this.dataPesan);
                });
          });
    });
  }

  getTahunAkademik() {
    return new Promise(async (resolve) => {
      let token = await this.storage.get('token');
      // let dataKelas = await this.storage.get('dataKelas');
      // let idTahunAkademik = dataKelas[0].id_tahun_akademik;

      // var url = this.ipAddress + "C_Kalender_Akademik/tahun_akademik?idTahunAkademik=" + idTahunAkademik;
      var url = this.ipAddress + "C_Kalender_Akademik/tahun_akademik";

      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      headers.append('Authorization', token);

      let options = new RequestOptions({ headers: headers });

      this.http.get(url, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        });
    });
  }

  getKegiatan() {
    return new Promise(async (resolve) => {
      let token = await this.storage.get('token');

      var url = this.ipAddress + "C_Kalender_Akademik/kegiatan";

      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      headers.append('Authorization', token);

      let options = new RequestOptions({ headers: headers });

      this.http.get(url, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        });
    });
  }
}
