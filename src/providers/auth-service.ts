import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import { Storage } from '@ionic/storage';
import { OneSignal } from '@ionic-native/onesignal';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  // ipAddress: any = "http://localhost:8080/MadaniSS_API/index.php/api/";
  // ipAddress: any = "http://192.168.1.4:8080/MadaniSS_API/index.php/api/";
  // ipAddress: any = "http://192.168.100.13:8080/MadaniSS_API/index.php/api/";
  // ipAddress: any = "http://madani-tech.com/MadaniSS_API/index.php/api/";
  // ipAddress: any = "http://hidayatullah.app.madani-tech.com/Depok/api/index.php/api/";
  // ipAddress: any = "http://192.168.1.2:8080/MadaniSS_JOINAPI/index.php/api/";
  // ipAddress: any = "http://tektikal.co.id/icm.kendari/index.php/api/";
  ipAddress: any = "https://IbnuAbbas.madani-tech.com/index.php/api/";
  // ipAddress: any = "http://ypis.qatrunnada.madani-tech.com/index.php/api/";
  // ipAddress: any = "http://localhost:8080/MadaniSS_Alkhawarizmi/index.php/api/";
  jwtHelper: JwtHelper = new JwtHelper();

  dataLogin: any;
  dataAuth: any;
  checkPassword: any;
  changePassword: any;

  constructor(public http: Http, public storage: Storage, public oneSignal: OneSignal) {
    
  }

  getDataSekolah() {
    return new Promise(resolve => {
      var url = this.ipAddress + "C_Pilih_Sekolah/all_sekolah";
      this.http.get(url)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        });
    });
  }

  getDataLogin(credential) {
  	if(this.dataLogin) {
  		return Promise.resolve(this.dataLogin);
  	}

  	return new Promise(resolve => {
  		this.http.get("json/data-siswa")
    			.map(res => res.json())
    			.subscribe(data => {
    				var nis = credential.nis;
    				var password = credential.password;

    				var dataFilter = data.data.filter(function(d) {
    					return d.nis === nis && d.password === password;
    				});
    				
    				if(dataFilter.length === 1) {
              var token = credential.nis + credential.password;
              var base64Token = btoa(token);

              this.storage.set('token', base64Token);
              this.storage.set('dataUser', dataFilter[0]);
  	  				this.dataLogin = true;

    				} else {
    					this.dataLogin = false;
    				}
    				
    				resolve(this.dataLogin);
    			}, err => {
    				console.log(err);
    			});
  	});
  }

  getDataLoginJWT(credential) {
    if(this.dataLogin) {
      return Promise.resolve(this.dataLogin);
    }

    return new Promise(resolve => {
      // this.ipAddress = "http://"+ credential.ip +"/MadaniSS_API/index.php/api/";
      var username = credential.nis,
          password = credential.password,
          sekolah = credential.sekolah,
          yayasan = credential.yayasan,
          url = this.ipAddress + "C_Auth/login";

      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');

      let options = new RequestOptions({headers: headers});
      var body = "username="+ username +"&password="+ password + 
                  "&kode_sekolah=" + sekolah + "&yayasan=" + yayasan + "&multiple=" + true;

      this.http.post(url, body, options)
          .map(res => res.json())
          .subscribe(data => {
            if(data.status === true) {
              var decodeToken = this.jwtHelper.decodeToken(data.token);
              // console.log(decodeToken);

              this.oneSignal.startInit('f74b990a-786d-40de-843e-f3b80f4a1b39', '544874095575');
              // this.oneSignal.deleteTag('idSekolah');
              this.oneSignal.deleteTag('kodeSekolah');
              this.oneSignal.deleteTag('yayasan');
              this.oneSignal.deleteTag('group');
              this.oneSignal.deleteTag('idUser');
              this.oneSignal.deleteTag('idKelas');

              // this.oneSignal.sendTag('idSekolah', credential.sekolah);
              this.oneSignal.sendTag('kodeSekolah', sekolah);
              this.oneSignal.sendTag('yayasan', yayasan);
              this.oneSignal.sendTag('group', decodeToken.group);
              this.oneSignal.sendTag('idUser', decodeToken.data_user.id_user);

              if(decodeToken.group === "siswa") {
                this.oneSignal.sendTag('idKelas', decodeToken.data_kelas[0].id_kelas);
                // this.oneSignal.sendTag('idUser', decodeToken.data_user.id_siswa);
              } else if(decodeToken.group === "guru") {
                this.oneSignal.sendTag('idKelas', 'many');
                // this.oneSignal.sendTag('idUser', decodeToken.data_user.id_pegawai);
              }

              this.oneSignal.endInit();

              this.storage.set('token', data.token);
              this.storage.set('dataUser', decodeToken.data_user);
              this.storage.set('dataKelas', decodeToken.data_kelas);
              this.storage.set('group', decodeToken.group);
              this.storage.set('decodeToken', decodeToken);
              // this.storage.set('ip', credential.ip);
              // this.storage.set('idSekolah', credential.sekolah);
              this.storage.set('kodeSekolah', sekolah);
              this.storage.set('yayasan', yayasan);

              this.dataLogin = true;
            } else {
              this.dataLogin = false;
            }
            
            resolve(this.dataLogin);
      });
    });
  }

  getCheckAuthJWT() {
    if(this.dataAuth) {
      return Promise.resolve(this.dataAuth);
    }

    return new Promise(resolve => {
      this.storage.get('token')
          .then(token => {
            this.storage.get('kodeSekolah')
                .then(kodeSekolah => {
                  this.storage.get('yayasan')
                      .then(yayasan => {
                        var data;

                        if(token !== null) {
                          data = {
                            exp: this.jwtHelper.isTokenExpired(token),
                            data: this.jwtHelper.decodeToken(token),
                            kodeSekolah: kodeSekolah,
                            yayasan: yayasan
                          }
                        } else {
                          data = {
                            exp: true
                          }
                        }
                        
                        this.dataAuth = data;
                        resolve(this.dataAuth);
                      });
                });
          });
    });
  }

  getCheckAuth() {
    if(this.dataAuth) {
      return Promise.resolve(this.dataAuth);
    }

    return new Promise(resolve => {
      this.storage.get('token')
          .then(val => {
            this.dataAuth = val;
            resolve(this.dataAuth);
          });
    });
  }

  getCheckPassword(password) {
    this.checkPassword = null;
    if(this.checkPassword) {
      return Promise.resolve(this.checkPassword);
    }

    return new Promise(resolve => {
      this.storage.get('token')
          .then(token => {
            var decodeToken = this.jwtHelper.decodeToken(token),
                username = decodeToken.data_user.username,
                url = this.ipAddress + "C_Change_Password/check?username="+ username +"&password="+ password;

            let headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded');
            headers.append('Authorization', token);

            let options = new RequestOptions({headers: headers});

            this.http.get(url, options)
                .map(res => res.json())
                .subscribe(data => {
                  this.checkPassword = data;
                  resolve(this.checkPassword);
                });
          });
    });
  }

  postChangePassword(password) {
    this.changePassword = null;
    if(this.changePassword) {
      return Promise.resolve(this.changePassword);
    }

    return new Promise(resolve => {
      this.storage.get('token')
          .then(token => {
            var decodeToken = this.jwtHelper.decodeToken(token),
                username = decodeToken.data_user.username,
                url = this.ipAddress + "C_Change_Password/change";

            let headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded');
            headers.append('Authorization', token);

            let options = new RequestOptions({headers: headers});
            var body = "username="+ username + "&password="+ password; 

            this.http.post(url, body ,options)
                .map(res => res.json())
                .subscribe(data => {
                  this.changePassword = data;
                  resolve(this.changePassword);
                });
          });
    });
  }

  getLogout() {
    // this.storage.remove('token');
    // this.storage.remove('dataUser');
    this.storage.set('token', null);
    this.storage.remove('dataUser');
    this.storage.remove('dataKelas');
    this.storage.remove('group');
    this.storage.remove('decodeToken');
    // this.storage.remove('ip');
    // this.storage.remove('idSekolah');
    this.storage.remove('kodeSekolah');
    this.storage.remove('yayasan');

    this.oneSignal.startInit('f74b990a-786d-40de-843e-f3b80f4a1b39', '544874095575');
    // this.oneSignal.deleteTag('idSekolah');
    this.oneSignal.deleteTag('kodeSekolah');
    this.oneSignal.deleteTag('yayasan');
    this.oneSignal.deleteTag('group');
    this.oneSignal.deleteTag('idUser');
    this.oneSignal.deleteTag('idKelas');
    this.oneSignal.endInit();
  }

}
