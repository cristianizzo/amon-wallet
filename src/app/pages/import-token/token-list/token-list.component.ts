import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { StateModel, TokenModel } from '@app/models';
import { Store } from '@ngrx/store';
import { UtilsHelper } from '@helpers/utils';
import { TokenActions } from '@core/actions';

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
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.tokens && this.utilsHelper.arrayHasValue(changes.tokens.currentValue)) {
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
