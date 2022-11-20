import { Component } from '@angular/core';
import { CurrencySelector } from '@app/core/selectors';
import { Store } from '@ngrx/store';
import { StateModel } from '@models/state.model';
import { CurrencyModel, WalletModel } from '@app/models';
import { WalletProxy } from '@services/proxy/wallet.proxy';

@Component({
  selector: 'app-total-balance',
  templateUrl: './totalBalance.component.html',
  styleUrls: ['./totalBalance.component.scss'],
})
export class TotalBalanceComponent {
  public showBalance: boolean;
  public totalBalance: number;
  public currency: CurrencyModel;
  public wallets: WalletModel[];

  constructor(
    private store: Store<StateModel>,
    private walletProxy: WalletProxy
  ) {
    // TODO: show balance, totalBalance
    this.showBalance = true;
    this.totalBalance = 34407.1;
  }

  async ionViewWillEnter() {
    this.store
      .select(CurrencySelector.getCurrency)
      .subscribe((currency) => (this.currency = currency));
    this.wallets = await this.walletProxy.getAllWallets();
    this.sumTotalBalance();
  }

  private sumTotalBalance() {
    // TODO:
  }
}
