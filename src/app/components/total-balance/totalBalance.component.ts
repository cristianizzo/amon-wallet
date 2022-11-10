import { Component } from '@angular/core';
import { WalletSelector } from '@app/core/selectors';
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
    // TODO: currency
    this.showBalance = true;
    this.totalBalance = 34407.1;
    this.currency = {
      symbol: 'USD',
      name: 'US Dollar',
      native: '$',
    };

    this.store
      .select(WalletSelector.getWallets)
      .subscribe((wallets) => this.sumTotalBalance(wallets));
  }

  private sumTotalBalance(wallets: WalletModel[]) {
    // TODO:
    console.log(wallets);
  }
}
