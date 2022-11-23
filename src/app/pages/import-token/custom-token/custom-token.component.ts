import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
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
export class CustomTokenComponent implements OnChanges {
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onClose = new EventEmitter<any>();
  @Input() tokens: TokenModel[];

  public formObj: FormGroup;
  public allTokens: TokenModel[];
  public step: number;

  constructor(
    private utilsHelper: UtilsHelper,
    public formBuilder: FormBuilder,
    private readonly store: Store<StateModel>
  ) {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.tokens && this.utilsHelper.arrayHasValue(changes.tokens.currentValue)) {
      this.store.select(TokenSelector.getAllTokens).subscribe((tokens) => {
        this.allTokens = tokens;
      });
      this.goToStep(1);
    }
  }

  /**
   * Go to step function
   */
  public goToStep(step: number) {
    if (this.step !== step) {
      if (this.step === 2) {
        this.updateTokenFormValidation();
      } else {
        this.clearTokenFormValidation();
      }

      this.step = step;
    }
  }

  public askSubmit() {
    const rawForm = this.formObj.getRawValue();
    const existingToken = this.allTokens.find(
      (tk) => tk.address === rawForm.address
    );
    if (existingToken) {
      this.goToStep(2);
      this.fillTokenInfo(existingToken);
    } else {
      this.submit();
    }
  }

  public async submit() {
    const rawForm = this.formObj.getRawValue();

    this.store.dispatch(TokenActions.addToken(rawForm.address));
    this.store.select(TokenSelector.getSelectedTokens).subscribe((tokens) => {
      const token = tokens.find((tk) => tk.address === rawForm.address);
      if (token) {
        this.goToStep(2);
        this.fillTokenInfo(token);
      }
    });
  }

  public updateToken() {
    const rawForm = this.formObj.getRawValue();

    this.store.dispatch(FormActions.setLoading({ loading: true }));
    this.store.dispatch(
      TokenActions.updateToken(rawForm.address, {
        symbol: rawForm.symbol,
        name: rawForm.name,
        decimals: rawForm.decimals,
      })
    );

    this.store.select(TokenSelector.getSelectedTokens).subscribe((tokens) => {
      if (tokens.find((tk) => tk.address === rawForm.address)) {
        this.onClose.emit();
        this.goToStep(1);
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
      name: [''],
      symbol: [''],
      decimals: [''],
    });
  };

  private updateTokenFormValidation() {
    this.formObj
      .get('name')
      .setValidators([Validators.required, Validators.minLength(3)]);

    this.formObj
      .get('symbol')
      .setValidators([Validators.required, Validators.minLength(2)]);

    this.formObj.get('decimals').setValidators([Validators.required]);
  }

  private clearTokenFormValidation() {
    this.formObj.get('name').clearValidators();
    this.formObj.get('symbol').clearValidators();
    this.formObj.get('decimals').clearValidators();
  }

  private fillTokenInfo(token: TokenModel) {
    this.formObj.controls.name.setValue(token.name);
    this.formObj.controls.symbol.setValue(token.symbol);
    this.formObj.controls.decimals.setValue(token.decimals);
    this.formObj.updateValueAndValidity();
  }
}
