import { Component } from '@angular/core';
import { StateModel, TokenModel } from '@app/models';
import { TokenSelector } from '@app/core/selectors';
import { Store } from '@ngrx/store';
import { UtilsHelper } from '@helpers/utils';
import { FormActions, TokenActions } from '@app/core/actions';

@Component({
  selector: 'app-token-list',
  templateUrl: './token-list.component.html',
  styleUrls: ['./token-list.component.scss'],
})
export class TokenListComponent {
  public tokens: TokenModel[];
  public searchQuery: string;
  public loading: boolean;

  constructor(
    private utilsHelper: UtilsHelper,
    private readonly store: Store<StateModel>
  ) {
    this.loading = true;
    this.store.select(TokenSelector.getAllTokens).subscribe((tokens) => {
      this.tokens = this.utilsHelper.sortByProp(tokens, 'selected');
      if (this.tokens && this.tokens.length > 0) {
        this.loading = false;
      }
    });
  }

  public async toggleToken(address: string) {
    this.store.dispatch(FormActions.setLoading({ loading: true }));

    const token = this.tokens.find((tk) => tk.address === address);
    if (token.selected) {
      this.store.dispatch(TokenActions.unselectToken(address));
      await this.utilsHelper.wait(1000);
    } else {
      this.store.dispatch(TokenActions.selectToken(address));
      await this.utilsHelper.wait(1000);
    }

    this.store.dispatch(FormActions.setLoading({ loading: false }));
  }
}
