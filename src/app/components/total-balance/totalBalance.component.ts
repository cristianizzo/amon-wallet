import { Component } from '@angular/core';
import { CurrencySelector, WalletSelector } from '@app/core/selectors';
import { Store } from '@ngrx/store';
import { StateModel } from '@models/state.model';
import { CurrencyModel, WalletModel } from '@app/models';
import { WalletActions } from '@core/actions';

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

  constructor(private store: Store<StateModel>) {
    // TODO: show balance, totalBalance
    this.showBalance = true;
    this.totalBalance = 34407.1;
  }

  async ionViewWillEnter() {
    this.store.dispatch(WalletActions.getAllWallets());
    this.store
      .select(WalletSelector.getAllWallets)
      .subscribe((wallets) => (this.wallets = wallets));
    this.store
      .select(CurrencySelector.getCurrency)
      .subscribe((currency) => (this.currency = currency));
    this.sumTotalBalance();
  }

  private sumTotalBalance() {
    // TODO:
  }
}
