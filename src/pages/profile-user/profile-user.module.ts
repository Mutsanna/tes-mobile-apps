import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileUser } from './profile-user';

@NgModule({
  declarations: [
    ProfileUser,
  ],
  imports: [
    IonicPageModule.forChild(ProfileUser),
  ],
  exports: [
    ProfileUser
  ]
})
export class ProfileUserModule {}
