import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SideMenu } from './side-menu';

@NgModule({
  declarations: [
    SideMenu,
  ],
  imports: [
    IonicPageModule.forChild(SideMenu),
  ],
  exports: [
    SideMenu
  ]
})
export class SideMenuModule {}
