import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { StateModel } from '@models/state.model';
import { ThemeSelector } from '@app/core/selectors';
import { ActionSheetController } from '@ionic/angular';
import { WalletModule } from '@app/modules/wallet.module';

@Component({
  selector: 'app-welcome',
  templateUrl: 'welcome.component.html',
  styleUrls: ['welcome.component.scss'],
})
export class WelcomeComponent {
  public selectedTheme: string;

  constructor(
    private readonly store: Store<StateModel>,
    private actionSheetController: ActionSheetController,
    private walletModule: WalletModule
  ) {
    this.store
      .select(ThemeSelector.getTheme)
      .subscribe((theme) => (this.selectedTheme = theme));
  }

  public async askRestoreWallet() {
    await this.walletModule.askRestoreWallet();
  }
}
