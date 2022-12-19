import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
const logContent = (data) =>
  Object.assign({ service: 'component:summary' }, data);

@Component({
  selector: 'app-summary',
  templateUrl: 'summary.component.html',
  styleUrls: ['summary.component.scss'],
})
export class SummaryModalComponent {
  constructor(private modalCtrl: ModalController) {}

  /**
   * continue Function
   */
  close() {
    this.modalCtrl.dismiss({}, null, 'summary-modal');
  }
}
