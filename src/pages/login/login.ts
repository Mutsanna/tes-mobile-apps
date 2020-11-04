import { Component } from '@angular/core';
import { 
	IonicPage, 
	NavController, 
	NavParams,
	App,
  LoadingController, 
  AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AuthService } from '../../providers/auth-service';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [AuthService]
})
export class Login {
  
  nis: any;
  password: any;
  viewSekolah: string = "Pilih Sekolah";
  valueSekolah: string = "-";
  cbSekolah: any[] = [];
  dataSekolah: any[] = [];
  namaSekolah: string;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public app: App,
    public authService: AuthService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public storage: Storage
  ) 
  {}

  ionViewDidLoad() {
    
  }

  ionViewDidEnter() {
    //this.getSekolah();
    this.storage.get('group_sekolah').then(group_sekolah => {
      if(group_sekolah) {
        this.namaSekolah = group_sekolah.nama_sekolah;
      }
    });
  }

  getSekolah() {
    this.authService.getDataSekolah()
      .then(data => {
        this.cbSekolah = [];
        var list: any = data;
        list.forEach(x => {
          this.cbSekolah.push({
            type: 'radio',
            label: x.nama_sekolah,
            value: x.group_db,
            checked: false
          });

          this.dataSekolah.push(x);
        });
      });
  }

  showRadio() {
    let alert = this.alertCtrl.create({
      title: "Pilih Sekolah",
      inputs: this.cbSekolah,
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
            var data_filter = this.dataSekolah.filter(x => {
              return x.group_db == data;
            });
            //console.log(data);
            this.viewSekolah = data_filter[0].nama_sekolah;
            this.valueSekolah = data;
          }
        }
      ]
    });
    
    alert.present();
  }

  loginJWT() {
    this.storage.get('group_sekolah').then(group_sekolah => {
      let credential = {
        nis: this.nis,
        password: this.password,
        sekolah: group_sekolah ? group_sekolah.kode_sekolah : "developer",
        yayasan: group_sekolah ? group_sekolah.yayasan : "developer"
        //sekolah: group_sekolah.group_db
      };
  
      let loader = this.loadingCtrl.create({
        content: `<img src="img/loader8.gif" />`,
        spinner: 'hide',
        dismissOnPageChange: true
      });
  
      var successLogin = false;
      var i = 0;
      let interval = setInterval(()=> {
        if(i === 20) {
          loader.dismiss();
          let alerts = this.alertCtrl.create({
            title: 'Login Failed',
            subTitle: 'Timed out',
            buttons: ['Ok']
          });
          alerts.present();
          clearInterval(interval);
        }
        i++;
      }, 1000);
  
      loader.present().then(()=> {
        this.authService.getDataLoginJWT(credential)
            .then(res => {
              var result = res;
  
              if(result === true) {
                clearInterval(interval);
                this.app.getRootNav().setRoot('SideMenu');
                successLogin = true;
              } else {
                clearInterval(interval);
                loader.dismiss();
                let alert = this.alertCtrl.create({
                  title: 'Login Failed',
                  subTitle: 'NIS or Password is incorrect',
                  buttons: ['Ok']
                });
                alert.present();
              }
            });
      });
    });

    // this.authService.getDataLoginJWT(credential)
    //     .then(res => {
    //       var result = res;

    //       // let loader = this.loadingCtrl.create({
    //       //   content: 'Please wait...',
    //       //   dismissOnPageChange: true
    //       // });

    //       loader.present()
    //             .then(() => {

    //               if(result === true) {
    //                 this.app.getRootNav().setRoot('SideMenu');
    //               } else {
    //                 loader.dismiss();
    //                 let alert = this.alertCtrl.create({
    //                   title: 'Login Failed',
    //                   subTitle: 'NIS or Password is incorrect',
    //                   buttons: ['Ok']
    //                 });
    //                 alert.present();
    //               }

    //             });
    //     }, err => {
    //       console.log("err");
    //     });
  }

  login() {
    let credential = {
      nis: this.nis,
      password: this.password
    };

    this.authService.getDataLogin(credential)
        .then(res => {
          var result = res;

          let loader = this.loadingCtrl.create({
            content: 'Please wait...',
            dismissOnPageChange: true
          });

          loader.present()
                .then(() => {

                  if(result === true) {
                    this.app.getRootNav().setRoot('SideMenu');
                  } else {
                    loader.dismiss();
                    let alert = this.alertCtrl.create({
                      title: 'Login Failed',
                      subTitle: 'NIS or Password is incorrect',
                      buttons: ['Ok']
                    });
                    alert.present();
                  }

                });

        }, err => {
          console.log(err);
        });
  	
  }

  pilihSekolah() {
    this.storage.remove('group_sekolah');
    this.app.getRootNav().setRoot("PilihSekolah");
  }

}
