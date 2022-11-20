import { Component } from '@angular/core';
import { Web3Services } from '@app/services/web3.service';
import { Store } from '@ngrx/store';
import { StateModel } from '@models/state.model';
import { ChainSelector, WalletSelector } from '@app/core/selectors';
import { ChainModel, WalletModel } from '@app/models';
import { Router } from '@angular/router';

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
  public chain: ChainModel;
  public selectedAssetType: string;

  constructor(
    private store: Store<StateModel>,
    private web3Services: Web3Services,
    private router: Router
  ) {
    this.selectedAssetType = this.assetTypeEnum.tokens;
    this.store
      .select(ChainSelector.getChain)
      .subscribe((chain) => (this.chain = chain));
    this.store
      .select(WalletSelector.getWallet)
      .subscribe((wallet) => (this.wallet = wallet));
    this.web3Services.getBlockNumber();
  }

  public onSelectAssetType = (asset: string) => {
    this.selectedAssetType = asset;
  };

  public goToSetting() {
    this.router.navigate(['/auth/setting']);
  }

  public goToChain() {
    this.router.navigate(['/auth/chains']);
  }
}
