import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DailyReport } from './daily-report';

@NgModule({
  declarations: [
    DailyReport,
  ],
  imports: [
    IonicPageModule.forChild(DailyReport),
  ],
  exports: [
    DailyReport
  ]
})
export class DailyReportModule {}
