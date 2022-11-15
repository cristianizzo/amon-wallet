import { Component, EventEmitter, Output } from '@angular/core';
import {
  CurrencyModel,
  ProviderModel,
  StateModel,
  TokenModel,
  WalletModel,
} from '@app/models';
import {
  CurrencySelector,
  ProviderSelector,
  TokenSelector,
  WalletSelector,
} from '@app/core/selectors';
import { Store } from '@ngrx/store';
import { UtilsHelper } from '@helpers/utils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenActions } from '@app/core/actions';

@Component({
  selector: 'app-custom-token',
  templateUrl: './custom-token.component.html',
  styleUrls: ['./custom-token.component.scss'],
})
export class CustomTokenComponent {
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onClose = new EventEmitter<any>();
  public formObj: FormGroup;
  public currency: CurrencyModel;
  public provider: ProviderModel;
  public wallet: WalletModel;
  public tokens: TokenModel[];

  constructor(
    private utilsHelper: UtilsHelper,
    public formBuilder: FormBuilder,
    private readonly store: Store<StateModel>
  ) {
    this.initForm();
    this.store
      .select(ProviderSelector.getProvider)
      .subscribe((provider) => (this.provider = provider));

    this.store
      .select(CurrencySelector.getCurrency)
      .subscribe((currency) => (this.currency = currency));

    this.store
      .select(WalletSelector.getWallet)
      .subscribe((wallet) => (this.wallet = wallet));
  }

  public submit() {
    const rawForm = this.formObj.getRawValue();
    this.store.dispatch(
      TokenActions.addToken(
        rawForm.address,
        this.wallet,
        this.provider,
        this.currency
      )
    );

    this.store.select(TokenSelector.getSelectedTokens).subscribe((tokens) => {
      if (tokens.find((tk) => tk.address === rawForm.address)) {
        this.onClose.emit();
      }
    });
  }

  private initForm = () => {
    this.formObj = this.formBuilder.group({
      address: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.utilsHelper.regex.address),
        ]),
      ],
    });
  };
}
