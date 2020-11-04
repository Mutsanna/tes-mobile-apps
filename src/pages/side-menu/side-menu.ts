import { Component } from '@angular/core';
import { 
	IonicPage, 
	NavController, 
	NavParams,
	App,
	AlertController,
  LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AuthService } from '../../providers/auth-service';

@IonicPage()
@Component({
  selector: 'page-side-menu',
  templateUrl: 'side-menu.html',
  providers: [AuthService]
})
export class SideMenu {

  rootPage: any = "Home";
  name: any;
  photo: any;

  pages: Array<{title: string, component: any}>;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public app: App,
  	public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public authService: AuthService
  ) 
  {

  	// this.pages = [
    //   { title: 'Profile', component: "ProfileUser" },
    //   { title: 'Change Password', component: "ChangePassword" },
    //   { title: 'Logout', component: "Login" }
    // ];
    this.storage.get('group').then(group => {
      if (group == "siswa") {
        this.pages = [
          { title: 'Profile', component: "ProfileUser" },
          { title: 'Finance', component: "FinancePage" },
          { title: 'Change Password', component: "ChangePassword" },
          { title: 'Logout', component: "Login" }
        ];
      } else {
        this.pages = [
          { title: 'Profile', component: "ProfileUser" },
          { title: 'Change Password', component: "ChangePassword" },
          { title: 'Logout', component: "Login" }
        ];
      }
    });

  }

  ionViewDidLoad() {
    this.photo = "img/Photo-Profile.png";
    this.storage.get('dataUser')
        .then(data => {
          this.name = data.nama;
          if(data.foto === "" || data.foto === null) {
            this.photo = "img/Photo-Profile.png";  
          } else {
            // this.photo = "http://madani-tech.com/MadaniSS/assets/upload/"+ data.foto;
            // this.photo = "http://hidayatullah.app.madani-tech.com/Depok/assets/upload/"+ data.foto;
            this.photo = "http://IbnuAbbas.madani-tech.com/assets/upload/"+ data.foto;
            // this.photo = "http://tektikal.co.id/icm.kendari/assets/upload/"+ data.foto;
            // this.photo = "http://localhost:8080/MadaniSS_Alkhawarizmi/assets/upload/"+ data.foto;
          }
        });
  }

  openPage(page) {
    
    if(page.component === "Login") {
      this.showConfirm();
    } else {
      // this.app.getRootNav().setRoot(page.component);
      this.navCtrl.push(page.component);
    }

  }

  showConfirm() {

    let loader = this.loadingCtrl.create({
      content: `<img src="img/loader8.gif" />`,
      spinner: 'hide',
      dismissOnPageChange: true
    })

    let confirm = this.alertCtrl.create({
      title: 'Are you sure?',
      message: '',
      buttons: [
        {
          text: 'No',
          handler: () => {
            
          }
        },
        {
          text: 'Yes',
          handler: () => {
            loader.present()
                  .then(() => {
                    this.authService.getLogout();
                    this.app.getRootNav().setRoot("Login");
                  });
            
          }
        }
      ]
    });

    confirm.present();

  }

}
