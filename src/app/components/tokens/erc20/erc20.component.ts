import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { StateModel } from '@models/state.model';
import { ChainModel, TokenModel, WalletModel } from '@app/models';
import { Router } from '@angular/router';
import { UtilsHelper } from '@helpers/utils';
import { ChainSelector, TokenSelector, WalletSelector } from '@core/selectors';
import { getLoading } from '@core/selectors/token';

@Component({
  selector: 'app-erc20-tokens',
  templateUrl: './erc20.component.html',
  styleUrls: ['./erc20.component.scss'],
})
export class Erc20Component implements OnChanges {
  @Input() chain: ChainModel;
  @Input() wallet: WalletModel;
  @Input() tokens: TokenModel[];
  public showBalance: boolean;
  public loading: boolean;
  public loadingWalletBalance: boolean;
  public loadingTokenBalances: boolean;

  constructor(
    private store: Store<StateModel>,
    private router: Router,
    private utilsHelper: UtilsHelper
  ) {
    this.loading = true;
    this.loadingTokenBalances = true;
    this.tokens = [];
    // TODO: move into the state
    this.showBalance = true;
    this.store
      .select(TokenSelector.getLoading)
      .subscribe(({ loading, loadingBalances }) => {
        this.loadingTokenBalances = loadingBalances;
        this.loading = loading;
      });

    this.store
      .select(WalletSelector.getLoading)
      .subscribe(({ loadingBalance }) => {
        this.loadingWalletBalance = loadingBalance;
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.utilsHelper.objectHasValue(changes.wallet?.currentValue)) {
      // this.loading = false;
    }
  }

  public goToToken(symbol: string) {
    console.log(symbol);
  }
}
