import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  CurrencyModel,
  NetworkModel,
  StateModel,
  WalletModel,
} from '@app/models';
import { NetworkSelector } from '@app/core/selectors';
import { FormActions, NetworkActions } from '@app/core/actions';
import { UtilsHelper } from '@helpers/utils';

@Component({
  selector: 'app-networks',
  templateUrl: 'networks.component.html',
  styleUrls: ['networks.component.scss'],
})
export class NetworksComponent {
  public network: NetworkModel;
  public networks: NetworkModel[];
  public currency: CurrencyModel;
  public wallet: WalletModel;
  public search: string;
  public testnetNetworks: boolean;

  constructor(
    private readonly store: Store<StateModel>,
    private router: Router,
    private utilsHelper: UtilsHelper
  ) {
    this.store
      .select(NetworkSelector.getNetworks)
      .subscribe((networks) => (this.networks = networks));

    this.store.select(NetworkSelector.getNetwork).subscribe((network) => {
      this.network = network;
      this.initTestNetworks();
    });
  }

  public async switchNetwork(network: NetworkModel) {
    this.store.dispatch(FormActions.setLoading({ loading: true }));
    this.store.dispatch(NetworkActions.switchNetwork(network));
    await this.utilsHelper.wait(3000);

    this.store.select(NetworkSelector.getNetwork).subscribe((newNetwork) => {
      this.store.dispatch(FormActions.setLoading({ loading: false }));
      if (newNetwork.id === network.id) {
        this.goBack();
      }
    });
  }

  public toggleTestNetworks() {
    this.testnetNetworks = !this.testnetNetworks;
  }

  public addNetwork() {
    // TODO:
  }

  /**
   * goBack Function
   */
  public goBack() {
    this.router.navigate(['/auth/assets']);
  }

  private initTestNetworks() {
    const show = !!(this.network && this.network.testnet);
    if (this.testnetNetworks !== show) {
      this.testnetNetworks = show;
    }
  }
}
