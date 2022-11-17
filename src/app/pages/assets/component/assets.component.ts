import { Component } from '@angular/core';
import { Web3Services } from '@app/services/web3.service';
import { Store } from '@ngrx/store';
import { StateModel } from '@models/state.model';
import { NetworkSelector, WalletSelector } from '@app/core/selectors';
import { NetworkModel, WalletModel } from '@app/models';

enum AssetTypeEnum {
  tokens = 'tokens',
  nfts = 'nfts',
}

@Component({
  selector: 'app-assets',
  templateUrl: 'assets.component.html',
  styleUrls: ['assets.component.scss'],
})
export class AssetsComponent {
  public assetTypeEnum = AssetTypeEnum;
  public wallet: WalletModel;
  public network: NetworkModel;
  public selectedAssetType: string;

  constructor(
    private store: Store<StateModel>,
    private web3Services: Web3Services
  ) {
    this.selectedAssetType = this.assetTypeEnum.tokens;
    this.store
      .select(NetworkSelector.getNetwork)
      .subscribe((network) => (this.network = network));
    this.store
      .select(WalletSelector.getWallet)
      .subscribe((wallet) => (this.wallet = wallet));
    this.web3Services.getBlockNumber();
  }

  public onSelectAssetType = (asset: string) => {
    this.selectedAssetType = asset;
  };
}
