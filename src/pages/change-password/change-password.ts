import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
  providers: [AuthService]
})
export class ChangePassword {

  currentPassword: string = "";
  newPassword: string = "";
  confirmPassword: string = "";

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public authService: AuthService,
  	public alertCtrl: AlertController
  ) 
  {}

  ionViewDidLoad() {
    
  }

  change() {
  	this.authService.getCheckPassword(this.currentPassword)
  		.then(check => {
  			if(this.currentPassword.length <= 0 || this.newPassword.length <= 0 || this.confirmPassword.length <= 0) {
  				var pesan = "Insert current password, new password, and confirm password";
  				this.showAlert(pesan);
  			} else {
  				if(check === false) {
	  				var pesan = "Current password is incorrect";
	  				this.showAlert(pesan);
	  			} else {
	  				if(this.newPassword !== this.confirmPassword) {
		  				var pesan = "New password and confirm password does not match";
	  					this.showAlert(pesan);
		  			} else {
		  				this.authService.postChangePassword(this.newPassword)
		  					.then(res => {
		  						if(res === true) {
		  							var pesan = "Password has been changed";
	  								this.showAlert(pesan);		
		  						}	
		  					});
		  			}
	  			}
  			}
  		});
  }

  showAlert(pesan) {
  	this.currentPassword = "";
  	this.newPassword = "";
  	this.confirmPassword = "";

  	let alert = this.alertCtrl.create({
        // title: 'Change Password Failed',
        subTitle: pesan,
        buttons: ['Ok']
    });
    alert.present();
  }

}
