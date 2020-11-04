import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from '../providers/auth-service';
import { OneSignal } from '@ionic-native/onesignal';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html',
  providers: [AuthService]
})
export class MyApp {
  rootPage: any;

  constructor(
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    public authService: AuthService,
    oneSignal: OneSignal,
    public storage: Storage
  ) 
  {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.authService.getCheckAuthJWT()
          .then(data => {

            oneSignal.startInit('f74b990a-786d-40de-843e-f3b80f4a1b39', '544874095575');
            // // oneSignal.deleteTag('idSekolah');
            oneSignal.deleteTag('kodeSekolah');
            oneSignal.deleteTag('yayasan');
            oneSignal.deleteTag('group');
            oneSignal.deleteTag('idUser');
            oneSignal.deleteTag('idKelas');

            if(data.exp === false) {

              // // oneSignal.sendTag('idSekolah', data.idSekolah);
              oneSignal.sendTag('kodeSekolah', data.kodeSekolah);
              oneSignal.sendTag('yayasan', data.yayasan);
              oneSignal.sendTag('group', data.data.group);
              oneSignal.sendTag('idUser', data.data.data_user.id_user);

              if(data.data.group === "siswa") {
                oneSignal.sendTag('idKelas', data.data.data_kelas[0].id_kelas);
                // // oneSignal.sendTag('idUser', data.data.data_user.id_siswa);
              } else if(data.data.group === "guru") {
                oneSignal.sendTag('idKelas', 'many');
                // // oneSignal.sendTag('idUser', data.data.data_user.id_pegawai);
              }
              // // console.log(data);

              // if(data.idSekolah === "developer") {
              //   oneSignal.sendTag('idSekolah', data.idSekolah);
              //   this.rootPage = "SideMenu";
              // } else {
              //   this.rootPage = "Login";
              // }
              this.rootPage = "SideMenu";
            } else {
              // this.rootPage = "Login"; 
              this.storage.get('group_sekolah')
                .then(group_sekolah => {
                  //console.log(group_db);
                  if(!group_sekolah) {
                    this.rootPage = "PilihSekolah";        
                  } else {
                    this.rootPage = "Login";
                  }
                });
            }
            //this.rootPage = "PilihSekolah";

            oneSignal.endInit(); 

          }, err => {
            console.log(err);
          });
    });
  }
}

