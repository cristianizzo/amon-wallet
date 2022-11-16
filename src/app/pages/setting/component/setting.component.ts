import { environment } from '@env/environment';
import { Component, OnInit } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { CurrencyModel, StateModel } from '@app/models';
import { UtilsHelper } from '@helpers/utils';
import { Router } from '@angular/router';
import { LanguageService } from '@services/languages.service';
import * as packageJson from '../../../../../package.json';
import {
  CurrencySelector,
  LanguageSelector,
  ThemeSelector,
} from '@app/core/selectors';
import { Store } from '@ngrx/store';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { CurrencySelectorComponent } from '@components/currency-selector/currency-selector.component';

// @ts-ignore
const logContent = (data) => Object.assign({ service: 'setting' }, data);

@Component({
  selector: 'app-setting',
  templateUrl: 'setting.component.html',
  styleUrls: ['setting.component.scss'],
})
export class SettingComponent implements OnInit {
  public selectedLang: string;
  public selectedTheme: string;
  public isLocal: boolean;
  public version: string;
  public network: string;
  public currency: CurrencyModel;

  constructor(
    private langService: LanguageService,
    private utilsHelper: UtilsHelper,
    private router: Router,
    private store: Store<StateModel>,
    private modalCtrl: ModalController,
    public actionSheetController: ActionSheetController
  ) {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    this.version = packageJson['default'].version;
    this.network = environment.network;
    this.isLocal = environment.env === 'local';
  }

  ngOnInit() {
    // this may not update the values when changed
    this.utilsHelper.combine(
      [
        this.store.select(CurrencySelector.getCurrency),
        this.store.select(LanguageSelector.getLanguage),
        this.store.select(ThemeSelector.getTheme),
      ],
      ([currency, language, theme]) => {
        this.currency = currency;
        this.selectedLang = language.lang;
        this.selectedTheme = theme;
      }
    );
  }

  public async askChangeCurrency() {
    const currencyModal = await this.modalCtrl.create({
      id: 'change-currency',
      component: CurrencySelectorComponent,
      cssClass: 'modal-mini',
      backdropDismiss: true,
      componentProps: {},
    });

    currencyModal.onDidDismiss().then(async () => {
      // TODO should be updated from the subscribed one
      // this.currency = await this.appState.getNewState('appCurrency');
    });

    await currencyModal.present();
  }

  public async askChangeLanguage() {
    const buttons = [];
    environment.languages.map((lang) => {
      buttons.push({
        text: this.langService.getTranslate(`LANGUAGES.${lang.toUpperCase()}`),
        role: lang,
        handler: async () => {
          //TODO trigger switchLanguage action
        },
      });
    });

    buttons.push({
      text: this.langService.getTranslate('BUTTON.CANCEL'),
      icon: 'close',
      role: 'cancel',
      handler: () => {},
    });

    const actionSheet = await this.actionSheetController.create({
      header: this.langService.getTranslate(
        'PAGE.SETTING.ACTION_SHEET.SELECT_LANG'
      ),
      buttons,
      cssClass: ['blur-action-sheet'],
    });

    await actionSheet.present();
  }

  public async askChangeTheme() {
    const lightThemeLabel = this.langService.getTranslate(
      'PAGE.SETTING.THEME.LIGHT'
    );
    const darkThemeLabel = this.langService.getTranslate(
      'PAGE.SETTING.THEME.DARK'
    );

    const buttons = [
      {
        text:
          this.selectedTheme === 'dark'
            ? this.utilsHelper.capitalizeFirstLetter(lightThemeLabel)
            : this.utilsHelper.capitalizeFirstLetter(darkThemeLabel),
        role: this.selectedTheme === 'dark' ? 'light' : 'dark',
        handler: () => {
          // TODO trigger switchTheme action
        },
      },
      {
        text: this.langService.getTranslate('BUTTON.CANCEL'),
        icon: 'close',
        role: 'cancel',
        handler: () => {},
      },
    ];

    const actionSheet = await this.actionSheetController.create({
      header: this.langService.getTranslate(
        'PAGE.SETTING.ACTION_SHEET.SELECT_THEME'
      ),
      buttons,
      cssClass: ['blur-action-sheet'],
    });

    await actionSheet.present();
  }

  public askChangeSecret() {}

  /**
   * goToWebsite Function
   */
  async goToWebsite() {
    await Browser.open({ url: 'https://amon.tech' });
  }

  /**
   * goToWebsite Function
   */
  async goToWebsiteNews() {
    await Browser.open({ url: 'https://amon.tech/blog/amon-news' });
  }

  public getThemeTranslation() {
    if (this.selectedTheme === 'dark') {
      return this.langService.getTranslate('PAGE.SETTING.THEME.DARK');
    } else {
      return this.langService.getTranslate('PAGE.SETTING.THEME.LIGHT');
    }
  }

  /**
   * goBack Function
   */
  public goBack() {
    this.router.navigate(['/auth/assets']);
  }
}
