import { AfterViewInit, Component } from '@angular/core';
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
export class ImportTokenComponent implements AfterViewInit {
  public tabTypeEnum = TabTypeEnum;
  public selectedTabType: string;

  constructor(private modalCtrl: ModalController) {}

  ngAfterViewInit() {
    setTimeout((_) => {
      this.selectedTabType = this.tabTypeEnum.default;
    }, 0);
  }

  public onSelectTabType = (tab: string) => {
    this.selectedTabType = tab;
  };

  public async onClose() {
    return this.close();
  }

  /**
   * goBack Function
   */
  public async close() {
    await this.modalCtrl.dismiss(null, null, 'import-token');
  }
}
