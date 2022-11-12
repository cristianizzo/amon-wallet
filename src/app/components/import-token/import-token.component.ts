import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

enum TabTypeEnum {
  default = 'default',
  custom = 'custom',
}

@Component({
  selector: 'app-import-token',
  templateUrl: './import-token.component.html',
  styleUrls: ['./import-token.component.scss'],
})
export class ImportTokenComponent {
  public tabTypeEnum = TabTypeEnum;
  public selectedTabType: string;

  constructor(private modalCtrl: ModalController) {
    this.selectedTabType = this.tabTypeEnum.default;
  }

  public onSelectTabType = (tab: string) => {
    this.selectedTabType = tab;
  };

  /**
   * goBack Function
   */
  public async close() {
    await this.modalCtrl.dismiss(null, null, 'import-token');
  }
}
