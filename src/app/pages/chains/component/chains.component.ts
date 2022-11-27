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
import { ChainActions } from '@app/core/actions';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chains',
  templateUrl: 'chains.component.html',
  styleUrls: ['chains.component.scss'],
})
export class ChainsComponent {
  public connectedChain: ChainModel;
  public chains$: Observable<ChainModel[]>;
  public currency: CurrencyModel;
  public wallet: WalletModel;
  public search: string;
  public testnetChains: boolean;

  constructor(
    private readonly store: Store<StateModel>,
    private router: Router
  ) {}

  async ionViewWillEnter() {
    this.store.select(ChainSelector.getChain).subscribe((chain) => {
      this.connectedChain = chain;
      this.store.dispatch(ChainActions.getAllChains());
      this.chains$ = this.store.select(ChainSelector.getAllChains);
    });
  }

  ionViewWillLeave() {
    this.store.dispatch(ChainActions.resetChains());
  }

  public async switchChain(chain: ChainModel) {
    this.store.dispatch(ChainActions.switchChain(chain));

    this.store.select(ChainSelector.getChain).subscribe((newChain) => {
      if (_.isEqual(this.connectedChain, newChain)) {
        this.goBack();
      }
    });
  }

  public toggleTestChains() {
    this.testnetChains = !this.testnetChains;
  }

  public isChecked() {
    if (this.connectedChain) {
      return this.testnetChains || this.connectedChain.testnet;
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
