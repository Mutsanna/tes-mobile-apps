import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { LoadingController, AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';

@Injectable()
export class GlobalFunction {

	public loader: any;
  public loaderActive: boolean = false;

  constructor(
    public http: Http,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
    ) 
  {}

  public showLoader() {
    this.loader = this.loadingCtrl.create({
      content: `<img src="img/loader8.gif" />`,
      spinner: 'hide',
    });

    if(this.loaderActive === false) {
      this.loader.present();
    }
    this.loaderActive = true;
  }

  public dismissLoader() {
    this.loader.dismiss();
    this.loaderActive = false;
  }

}
