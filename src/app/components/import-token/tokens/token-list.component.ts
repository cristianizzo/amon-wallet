import { Component } from '@angular/core';
import { StateModel, TokenModel } from '@app/models';
import { TokenSelector } from '@app/core/selectors';
import { Store } from '@ngrx/store';
import { UtilsHelper } from '@helpers/utils';
import { TokenActions } from '@app/core/actions';

@Component({
  selector: 'app-token-list',
  templateUrl: './token-list.component.html',
  styleUrls: ['./token-list.component.scss'],
})
export class TokenListComponent {
  public tokens: TokenModel[];
  public searchQuery: string;

  constructor(
    private utilsHelper: UtilsHelper,
    private readonly store: Store<StateModel>
  ) {
    this.store.select(TokenSelector.getAllTokens).subscribe((tokens) => {
      this.tokens = this.utilsHelper.sortByProp(tokens, 'selected');
    });
  }

  public toggleToken(address: string) {
    const token = this.tokens.find((tk) => tk.address === address);
    if (token.selected) {
      this.store.dispatch(TokenActions.unselectToken(address));
    } else {
      this.store.dispatch(TokenActions.selectToken(address));
    }
  }
}
