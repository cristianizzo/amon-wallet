import { Component } from '@angular/core';
import { WalletSelector, CurrencySelector } from '@app/core/selectors';
import { Store } from '@ngrx/store';
import { StateModel } from '@models/state.model';
import { CurrencyModel, WalletModel } from '@app/models';

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

    this.store
      .select(WalletSelector.getWallets)
      .subscribe((wallets) => this.sumTotalBalance(wallets));

    this.store
      .select(CurrencySelector.getCurrency)
      .subscribe((currency) => (this.currency = currency));
  }

  private sumTotalBalance(wallets: WalletModel[]) {
    // TODO:
    console.log(wallets);
  }
}
