import { Component } from '@angular/core';
import { Web3Services } from '@app/services/web3.service';
import { Store } from '@ngrx/store';
import { StateModel } from '@models/state.model';
import {
  ProviderSelector,
  ThemeSelector,
  WalletSelector,
} from '@app/core/selectors';
import { ProviderModel, WalletModel } from '@app/models';

@Component({
  selector: 'app-assets',
  templateUrl: 'assets.component.html',
  styleUrls: ['assets.component.scss'],
})
export class AssetsComponent {
  public selectedTheme: string;
  public wallet: WalletModel;
  public provider: ProviderModel;

  constructor(
    private store: Store<StateModel>,
    private web3Services: Web3Services
  ) {
    this.store
      .select(ProviderSelector.getProvider)
      .subscribe((provider) => (this.provider = provider));
    this.store
      .select(ThemeSelector.getTheme)
      .subscribe((theme) => (this.selectedTheme = theme));
    this.store
      .select(WalletSelector.getWallet)
      .subscribe((wallet) => (this.wallet = wallet));
    this.web3Services.getBlockNumber();
  }

  /**
   * getCoinIcon function
   */
  public getIcon(icon: string): string {
    if (this.selectedTheme === 'dark') {
      return `${icon}-dark`;
    }

    return icon;
  }

  public goBack() {}
}
