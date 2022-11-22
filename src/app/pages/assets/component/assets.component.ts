import { Component } from '@angular/core';
import { Web3Services } from '@app/services/web3.service';
import { Store } from '@ngrx/store';
import { StateModel } from '@models/state.model';
import {
  ChainSelector,
  TokenSelector,
  WalletSelector,
} from '@app/core/selectors';
import { ChainModel, TokenModel, WalletModel } from '@app/models';
import { Router } from '@angular/router';
import { UtilsHelper } from '@app/helpers/utils';

enum AssetTypeEnum {
  tokens = 'tokens',
  nfts = 'nfts',
}

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss'],
})
export class AssetsComponent {
  public assetTypeEnum = AssetTypeEnum;
  public wallet: WalletModel;
  public chain: ChainModel;
  public tokens: TokenModel[];
  public selectedAssetType: string;

  constructor(
    private store: Store<StateModel>,
    private web3Services: Web3Services,
    private router: Router,
    private utilsHelper: UtilsHelper
  ) {}

  async ionViewWillEnter() {
    this.selectedAssetType = this.assetTypeEnum.tokens;
    await this.utilsHelper.wait(500);
    this.store
      .select(ChainSelector.getChain)
      .subscribe((chain) => (this.chain = chain));
    this.store
      .select(WalletSelector.getWallet)
      .subscribe((wallet) => (this.wallet = wallet));
    this.store.select(TokenSelector.getSelectedTokens).subscribe((tokens) => {
      this.tokens = tokens;
    });
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
