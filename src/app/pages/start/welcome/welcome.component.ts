import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { StateModel } from '@models/state.model';
import { ThemeSelector } from '@app/core/selectors';
import { LanguageService } from '@app/services/languages.service';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: 'welcome.component.html',
  styleUrls: ['welcome.component.scss'],
})
export class WelcomeComponent {

  public selectedTheme: string;

  constructor(
    private readonly store: Store<StateModel>,
    private langService: LanguageService,
    private actionSheetController: ActionSheetController,
    private router: Router,
  ) {
    this.store.select(ThemeSelector.getTheme).subscribe((theme) => this.selectedTheme = theme);
  }

  /**
   * Ask Restore Wallet function
   */
  public async askRestoreWallet() {
    const buttons = [
      {
        text: this.langService.getTranslate('BUTTON.RECOVER_PHRASE'),
        role: 'recovery-phrase',
        cssClass: 'recovery-phrase',
        handler: () => this.router.navigate(['/import-wallet/recovery-phrase']),
      },
      {
        text: this.langService.getTranslate('BUTTON.PRIVATE_KEY'),
        role: 'private-key',
        cssClass: 'private-key',
        handler: () => this.router.navigate(['/import-wallet/private-key']),
      },
      {
        text: this.langService.getTranslate('BUTTON.JSON_FILE'),
        role: 'json-file',
        cssClass: 'json-file',
        handler: () => this.router.navigate(['/import-wallet/json-file']),
      },
      {
        text: this.langService.getTranslate('BUTTON.CANCEL'),
        icon: 'close',
        role: 'cancel',
        handler: () => {
        }
      }
    ];

    const actionSheet = await this.actionSheetController.create({
      header: this.langService.getTranslate('ACTION_SHEET.IMPORT_ACCOUNT'),
      buttons,
    });

    await actionSheet.present();

  }
}
