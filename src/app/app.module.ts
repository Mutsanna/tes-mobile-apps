import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule} from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { OneSignal } from '@ionic-native/onesignal';

import { MyApp } from './app.component';
import { AuthService } from '../providers/auth-service';
import { DataService } from '../providers/data-service';
import { GlobalFunction } from '../providers/global-function';

import { BuatInformasiModal } from '../pages/buat-informasi/buat-informasi';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@NgModule({
  declarations: [
    MyApp,
    BuatInformasiModal
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      scrollPadding: false,
      scrollAssist: true
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    BuatInformasiModal
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    DataService,
    GlobalFunction,
    OneSignal,
    // QRScanner,
    BarcodeScanner,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
