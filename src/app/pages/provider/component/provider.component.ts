import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  CurrencyModel,
  ProviderModel,
  StateModel,
  WalletModel,
} from '@app/models';
import {
  CurrencySelector,
  ProviderSelector,
  WalletSelector,
} from '@app/core/selectors';
import { ProviderActions } from '@app/core/actions';

@Component({
  selector: 'app-provider',
  templateUrl: 'provider.component.html',
  styleUrls: ['provider.component.scss'],
})
export class ProviderComponent {
  public provider: ProviderModel;
  public providers: ProviderModel[];
  public currency: CurrencyModel;
  public wallet: WalletModel;
  public search: string;
  public testnetNetworks: boolean;

  constructor(
    private readonly store: Store<StateModel>,
    private router: Router
  ) {
    this.store
      .select(ProviderSelector.getProviders)
      .subscribe((providers) => (this.providers = providers));

    this.store.select(ProviderSelector.getProvider).subscribe((provider) => {
      this.provider = provider;
      this.initTestNetworks();
    });

    this.store
      .select(CurrencySelector.getCurrency)
      .subscribe((currency) => (this.currency = currency));

    this.store
      .select(WalletSelector.getWallet)
      .subscribe((wallet) => (this.wallet = wallet));
  }

  public switchProvider(provider: ProviderModel) {
    this.store.dispatch(
      ProviderActions.switchProvider(provider, this.currency, this.wallet)
    );

    this.store.select(ProviderSelector.getProvider).subscribe((newProvider) => {
      if (newProvider.id === provider.id) {
        this.goBack();
      }
    });
  }

  public toggleTestNetworks() {
    this.testnetNetworks = !this.testnetNetworks;
  }

  public addProvider() {
    // TODO:
  }

  /**
   * goBack Function
   */
  public goBack() {
    this.router.navigate(['/auth/assets']);
  }

  private initTestNetworks() {
    const show = !!(this.provider && this.provider.testnet);
    if (this.testnetNetworks !== show) {
      this.testnetNetworks = show;
    }
  }
}
