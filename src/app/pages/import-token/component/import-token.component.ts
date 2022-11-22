import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TokenActions } from '@app/core/actions';
import { Store } from '@ngrx/store';
import { StateModel, TokenModel } from '@app/models';
import { TokenSelector } from '@app/core/selectors';
import { UtilsHelper } from '@helpers/utils';

enum TabTypeEnum {
  list = 'list',
  custom = 'custom',
}

@Component({
  selector: 'app-import-token',
  templateUrl: './import-token.component.html',
  styleUrls: ['./import-token.component.scss'],
})
export class ImportTokenComponent {
  public tokens: TokenModel[];
  public selectedTokens: TokenModel[];
  public tabTypeEnum = TabTypeEnum;
  public selectedTabType: string;

  constructor(
    private utilsHelper: UtilsHelper,
    private router: Router,
    private store: Store<StateModel>
  ) {
    this.selectedTabType = this.tabTypeEnum.list;
  }

  async ionViewWillEnter() {
    await this.utilsHelper.wait(500);
    this.store.dispatch(TokenActions.getAllTokens());
    this.store.select(TokenSelector.getAllTokens).subscribe((tokens) => {
      this.tokens = tokens;
    });
    this.store.select(TokenSelector.getSelectedTokens).subscribe((tokens) => {
      this.selectedTokens = tokens;
    });
  }

  ionViewWillLeave() {
    this.store.dispatch(TokenActions.resetTokens());
  }

  public onSelectTabType = (tab: string) => {
    if (tab) {
      this.selectedTabType = tab;
    } else {
      this.selectedTabType = this.tabTypeEnum.list;
    }
  };

  /**
   * goBack Function
   */
  public async close() {
    this.router.navigate(['/auth/assets']);
  }
}
