import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { StateModel } from '@models/state.model';
import { ThemeSelector } from '@app/core/selectors';
import { WalletHelper } from '@helpers/wallet';

@Component({
  selector: 'app-welcome',
  templateUrl: 'welcome.component.html',
  styleUrls: ['welcome.component.scss'],
})
export class WelcomeComponent {
  public selectedTheme: string;

  constructor(
    private readonly store: Store<StateModel>,
    private walletHelper: WalletHelper
  ) {
    this.store
      .select(ThemeSelector.getTheme)
      .subscribe((theme) => (this.selectedTheme = theme));
  }

  /**
   * Ask Restore Wallet function
   */
  public async askRestoreWallet() {
    await this.walletHelper.askRestoreWallet({
      seed: true,
      json: true,
    });
  }
}
