import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { StateModel } from '@models/state.model';
import { ChainModel, TokenModel, WalletModel } from '@app/models';
import { UtilsHelper } from '@helpers/utils';

@Component({
  selector: 'app-erc721-tokens',
  templateUrl: './erc721.component.html',
  styleUrls: ['./erc721.component.scss'],
})
export class Erc721Component implements OnChanges {
  @Input() chain: ChainModel;
  @Input() wallet: WalletModel;
  @Input() tokens: TokenModel[];
  public showBalance: boolean;
  public loading: boolean;

  constructor(
    private store: Store<StateModel>,
    private utilsHelper: UtilsHelper
  ) {
    this.loading = true;
    this.tokens = [];
    // TODO: move into the state
    this.showBalance = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.utilsHelper.objectHasValue(changes.wallet?.currentValue)) {
      this.loading = false;
    }
  }

  public goToToken(symbol: string) {
    console.log(symbol);
  }
}
