import {Component, Input} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';

const logContent = (data) =>
  Object.assign({service: 'component:summary'}, data);

@Component({
  selector: 'app-summary',
  templateUrl: 'summary.component.html',
  styleUrls: ['summary.component.scss'],
})
export class SummaryModalComponent {
  @Input() rawTx: any;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
  ) {
  }

  ionViewWillEnter() {
    this.rawTx = this.navParams.get('rawTx');
  }

  /**
   * continue Function
   */
  close(rawTx?: any) {
    this.modalCtrl.dismiss({rawTx}, null, 'summary-modal');
  }
}
