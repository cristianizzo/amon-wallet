import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { StateModel } from '@models/state.model';
import { ChainModel, TokenModel, WalletModel } from '@app/models';
import { Router } from '@angular/router';
import { UtilsHelper } from '@helpers/utils';

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

  constructor(
    private store: Store<StateModel>,
    private router: Router,
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
