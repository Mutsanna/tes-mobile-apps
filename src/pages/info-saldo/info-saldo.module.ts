import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InfoSaldoPage } from './info-saldo';
import { ThemeableBrowser } from '@ionic-native/themeable-browser'

@NgModule({
  declarations: [
    InfoSaldoPage,
  ],
  imports: [
    IonicPageModule.forChild(InfoSaldoPage),
  ],
  providers: [
    ThemeableBrowser
  ]
})
export class InfoSaldoPageModule {}
