import { Component, OnInit } from '@angular/core';
import { CurrencyModel, StateModel } from '@app/models';
import { AlertController } from '@ionic/angular';
import { CurrencySelector } from '@app/core/selectors';
import { Store } from '@ngrx/store';
import { CurrencyActions } from '@core/actions';
import { LanguageProxy } from '@app/services/index.module';

@Component({
  selector: 'app-currency-selector',
  templateUrl: './currency-selector.component.html',
  styleUrls: ['./currency-selector.component.scss'],
})
export class CurrencySelectorComponent implements OnInit {
  public search: string;
  public currencies: CurrencyModel[];
  public selectedCurrency: CurrencyModel;

  constructor(
    private alertController: AlertController,
    private languageProxy: LanguageProxy,
    private store: Store<StateModel>
  ) {}

  async ngOnInit() {
    this.store
      .select(CurrencySelector.getCurrencies)
      .subscribe((currencies: CurrencyModel[]) => {
        this.currencies = currencies.filter((cu) => !cu.selected);
        this.selectedCurrency = currencies.find((cu) => cu.selected);
      });
  }

  /**
   * Ask Change Currency function
   */
  async askChangeCurrency(currency: CurrencyModel) {
    const { symbol } = currency;

    const alert = await this.alertController.create({
      mode: 'md',
      header: this.languageProxy.getTranslate('ALERT.HEADER.CURRENCY'),
      message: this.languageProxy.getTranslate('ALERT.MESSAGE.CURRENCY', {
        symbol,
      }),
      buttons: [
        {
          text: this.languageProxy.getTranslate('BUTTON.CANCEL'),
          role: 'cancel',
          handler: () => {},
        },
        {
          text: this.languageProxy.getTranslate('BUTTON.CONTINUE'),
          handler: () => {
            this.store.dispatch(CurrencyActions.switchCurrency(currency));
          },
        },
      ],
    });

    await alert.present();
  }
}
