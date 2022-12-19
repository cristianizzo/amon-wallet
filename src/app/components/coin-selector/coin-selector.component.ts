import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  ChainModel,
  CoinShapeModel,
  TokenModel,
  WalletModel,
} from '@app/models';
import { UtilsHelper } from '@helpers/utils';
import { ThemeService } from '@services/theme.service';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-coin-selector',
  templateUrl: './coin-selector.component.html',
  styleUrls: ['./coin-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: CoinSelectorComponent,
    },
  ],
})
export class CoinSelectorComponent implements AfterViewInit, OnChanges {
  @Input() wallet: WalletModel;
  @Input() chain: ChainModel;
  @Input() tokens: TokenModel[];
  @Input() public shape: CoinShapeModel;
  @Output() switchCoinWallet: EventEmitter<string> = new EventEmitter<string>();
  public shapes = CoinShapeModel;
  public selectedTheme: string;
  private _selectedWallet: string;

  private touched = false;
  private disabled = false;

  constructor(
    private themeService: ThemeService,
    private utilsHelper: UtilsHelper
  ) {
    this.themeService.theme.subscribe((theme) => (this.selectedTheme = theme));
  }

  public get selectedWallet(): string {
    return this._selectedWallet;
  }

  ngAfterViewInit() {
    setTimeout((_) => {
      this._init();
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes &&
      changes.chain &&
      changes.chain.previousValue !== undefined &&
      changes.wallet &&
      changes.wallet.previousValue !== undefined
    ) {
      setTimeout((_) => {
        this._init();
      }, 0);
    }
  }

  _init() {
    console.log(this.chain);
    console.log(this.wallet);
    console.log(this.tokens);
    // this.wallets = this.walletService.mergeStaticAndServerWalletsByType(
    //   this.type,
    //   this.walletService.getStaticWalletsByType(this.type),
    //   this.wallets
    // );
    // this._selectedWallet = this.utilsHelper.getDefaultWallet(
    //   this.wallets,
    //   this.coinCode,
    //   this.type
    // );
    // this.switchToken.emit(this._selectedWallet);
  }

  /**
   * getCoinIcon function
   */
  getCoinIcon(coinCode: string): string {
    if (coinCode) {
      if (this.selectedTheme === 'dark') {
        return `${coinCode}-white`;
      }

      return `${coinCode}-blue`;
    }
  }

  onChange = (_chain) => {};

  onTouched = () => {};

  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  writeValue(_selectedCoin: string): void {
    // this.coinCode = selectedCoin;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  onCoinSelected = (selectedCoin: string) => {
    this.markAsTouched();
    if (!this.disabled) {
      // this.coinCode = selectedCoin;
      this.onChange(selectedCoin);
    }
  };

  /**
   * show wallets modal function
   */
  showWalletsModal = async () => {
    // this.modalHelper
    //   .openWalletsModal(this.wallets, ['coin.code', 'coin.name'], this.coinCode)
    //   .then((data) => {
    //     if (data && data.data) {
    //       this.onCoinSelected(data.data.coin.code);
    //       this._selectedWallet = data.data;
    //       this.switchToken.emit(this._selectedWallet);
    //     }
    //   });
  };
}
