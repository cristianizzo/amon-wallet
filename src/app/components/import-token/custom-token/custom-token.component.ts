import { Component, EventEmitter, Output } from '@angular/core';
import { StateModel, TokenModel } from '@app/models';
import { TokenSelector } from '@app/core/selectors';
import { Store } from '@ngrx/store';
import { UtilsHelper } from '@helpers/utils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormActions, TokenActions } from '@app/core/actions';

@Component({
  selector: 'app-custom-token',
  templateUrl: './custom-token.component.html',
  styleUrls: ['./custom-token.component.scss'],
})
export class CustomTokenComponent {
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onClose = new EventEmitter<any>();
  public formObj: FormGroup;
  public tokens: TokenModel[];

  constructor(
    private utilsHelper: UtilsHelper,
    public formBuilder: FormBuilder,
    private readonly store: Store<StateModel>
  ) {
    this.initForm();
  }

  public submit() {
    const rawForm = this.formObj.getRawValue();

    this.store.dispatch(FormActions.setLoading({ loading: true }));
    this.store.dispatch(TokenActions.addToken(rawForm.address));

    this.store.select(TokenSelector.getSelectedTokens).subscribe((tokens) => {
      if (tokens.find((tk) => tk.address === rawForm.address)) {
        this.store.dispatch(FormActions.setLoading({ loading: false }));
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
