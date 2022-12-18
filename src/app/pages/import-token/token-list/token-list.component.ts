import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { StateModel, TokenModel } from '@app/models';
import { Store } from '@ngrx/store';
import { UtilsHelper } from '@helpers/utils';
import { TokenActions } from '@core/actions';
import { TokenSelector } from '@core/selectors';

@Component({
  selector: 'app-token-list',
  templateUrl: './token-list.component.html',
  styleUrls: ['./token-list.component.scss'],
})
export class TokenListComponent implements OnChanges {
  @Input() tokens: TokenModel[];
  @Input() selectedTokens: TokenModel[];

  public searchQuery: string;
  public loading: boolean;

  constructor(
    private utilsHelper: UtilsHelper,
    private store: Store<StateModel>
  ) {
    this.loading = true;
    this.store.select(TokenSelector.getLoading).subscribe(({ loading }) => {
      this.loading = loading;
      this.loading = false;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedTokens) {
      return;
    }

    this.loading = true;
    if (
      changes.tokens &&
      this.utilsHelper.arrayHasValue(changes.tokens.currentValue)
    ) {
      this.loading = false;
    }
  }

  public async toggleToken(address: string) {
    const token = this.selectedTokens.find((tk) => tk.address === address);
    if (token && token.selected) {
      this.store.dispatch(TokenActions.unselectToken(address));
    } else {
      this.store.dispatch(TokenActions.selectToken(address));
    }
  }
}
