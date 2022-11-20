import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  ChainModel,
  CurrencyModel,
  StateModel,
  WalletModel,
} from '@app/models';
import { ChainSelector } from '@app/core/selectors';
import { ChainActions, FormActions } from '@app/core/actions';
import { UtilsHelper } from '@helpers/utils';
import { ChainProxy } from '@app/services/index.module';
import * as _ from 'lodash';

@Component({
  selector: 'app-chains',
  templateUrl: 'chains.component.html',
  styleUrls: ['chains.component.scss'],
})
export class ChainsComponent {
  public selectedChain: ChainModel;
  public chains: ChainModel[];
  public currency: CurrencyModel;
  public wallet: WalletModel;
  public search: string;
  public testnetChains: boolean;

  constructor(
    private readonly store: Store<StateModel>,
    private router: Router,
    private utilsHelper: UtilsHelper,
    private chainProxy: ChainProxy
  ) {}

  async ionViewWillEnter() {
    this.chains = await this.chainProxy.getAllChains();
    this.store.select(ChainSelector.getChain).subscribe((chain) => {
      this.selectedChain = chain;
    });
  }

  public async switchChain(chain: ChainModel) {
    this.store.dispatch(FormActions.setLoading({ loading: true }));
    this.store.dispatch(ChainActions.switchChain(chain));
    await this.utilsHelper.wait(3000);

    this.store.select(ChainSelector.getChain).subscribe((newChain) => {
      this.store.dispatch(FormActions.setLoading({ loading: false }));
      if (_.isEqual(this.selectedChain, newChain)) {
        this.goBack();
      }
    });
  }

  public isSelectedChain(chain: ChainModel): boolean {
    let isSelected = false;
    if (this.selectedChain) {
      isSelected = _.isEqual(this.selectedChain, chain);
    }

    return isSelected;
  }

  public toggleTestChains() {
    this.testnetChains = !this.testnetChains;
  }

  public isChecked() {
    if (this.selectedChain) {
      return this.testnetChains || this.selectedChain.testnet;
    }
  }

  public addChain() {
    // TODO:
  }

  /**
   * goBack Function
   */
  public goBack() {
    this.router.navigate(['/auth/assets']);
  }
}
