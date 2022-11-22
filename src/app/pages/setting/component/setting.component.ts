import { environment } from '@env/environment';
import { Component, OnInit } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { CurrencyModel, LanguageModel, StateModel } from '@app/models';
import { UtilsHelper } from '@helpers/utils';
import { Router } from '@angular/router';
import * as packageJson from '../../../../../package.json';
import {
  CurrencySelector,
  LanguageSelector,
  ThemeSelector,
} from '@app/core/selectors';
import { Store } from '@ngrx/store';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { CurrencySelectorComponent } from '@components/currency-selector/currency-selector.component';
import { from, Observable } from 'rxjs';
import { LanguageActions, ThemeActions } from '@core/actions';
import { take } from 'rxjs/operators';
import { ChangePasswordComponent } from '@components/change-password/change-password.component';
import { LanguageProxy } from '@services/proxy/languages.proxy';

// @ts-ignore
const logContent = (data) => Object.assign({ service: 'setting' }, data);

@Component({
  selector: 'app-setting',
  templateUrl: 'setting.component.html',
  styleUrls: ['setting.component.scss'],
})
export class SettingComponent implements OnInit {
  public isLocal: boolean;
  public version: string;
  public network: string;
  public currency$: Observable<CurrencyModel>;
  public language: LanguageModel;
  public languages: LanguageModel[];
  public theme$: Observable<string>;

  constructor(
    public languageProxy: LanguageProxy,
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
    this.currency$ = this.store.select(CurrencySelector.getCurrency);
    this.store
      .select(LanguageSelector.getLanguage)
      .subscribe((lang) => (this.language = lang));
    this.languages = this.languageProxy.getAllLanguages();
    this.theme$ = this.store.select(ThemeSelector.getTheme);
  }

  public async askChangeCurrency() {
    const currencyModal = await this.modalCtrl.create({
      id: 'change-currency',
      component: CurrencySelectorComponent,
      cssClass: 'modal-mini',
      backdropDismiss: true,
      canDismiss: true,
      componentProps: {},
    });

    await currencyModal.present();
  }

  public async askChangeLanguage() {
    const buttons = [];

    this.languages
      .filter((l) => l.lang !== this.language?.lang)
      .map((language) => {
        buttons.push({
          text: this.languageProxy.getTranslate(language.label),
          role: language.lang,
          handler: async () => {
            this.store.dispatch(LanguageActions.switchLanguage(language));
          },
        });
      });

    buttons.push({
      text: this.languageProxy.getTranslate('BUTTON.CANCEL'),
      icon: 'close',
      role: 'cancel',
      handler: () => {},
    });

    const actionSheet = await this.actionSheetController.create({
      header: this.languageProxy.getTranslate(
        'PAGE.SETTING.ACTION_SHEET.SELECT_LANG'
      ),
      buttons,
      cssClass: ['blur-action-sheet'],
    });

    await actionSheet.present();
  }

  public async askChangeTheme() {
    const lightThemeLabel = this.languageProxy.getTranslate(
      'PAGE.SETTING.THEME.LIGHT'
    );
    const darkThemeLabel = this.languageProxy.getTranslate(
      'PAGE.SETTING.THEME.DARK'
    );

    this.theme$.pipe(take(1)).subscribe(async (theme) => {
      const buttons = [
        {
          text:
            theme === 'dark'
              ? this.utilsHelper.capitalizeFirstLetter(lightThemeLabel)
              : this.utilsHelper.capitalizeFirstLetter(darkThemeLabel),
          role: theme === 'dark' ? 'light' : 'dark',
          handler: () => {
            this.store.dispatch(
              ThemeActions.switchTheme(theme === 'dark' ? 'light' : 'dark')
            );
          },
        },
        {
          text: this.languageProxy.getTranslate('BUTTON.CANCEL'),
          icon: 'close',
          role: 'cancel',
          handler: () => {},
        },
      ];

      const actionSheet = await this.actionSheetController.create({
        header: this.languageProxy.getTranslate(
          'PAGE.SETTING.ACTION_SHEET.SELECT_THEME'
        ),
        buttons,
        cssClass: ['blur-action-sheet'],
      });

      await actionSheet.present();
    });
  }

  /**
   * ask change secret function
   */
  async askChangeSecret() {
    const changePasswordModal = await this.modalCtrl.create({
      id: 'change-password',
      component: ChangePasswordComponent,
      backdropDismiss: true,
      canDismiss: true,
      componentProps: {},
    });

    await changePasswordModal.present();
  }

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

  public getThemeTranslation(theme) {
    if (theme === 'dark') {
      return this.languageProxy.getTranslate('PAGE.SETTING.THEME.DARK');
    } else {
      return this.languageProxy.getTranslate('PAGE.SETTING.THEME.LIGHT');
    }
  }

  /**
   * goBack Function
   */
  public goBack() {
    this.router.navigate(['/auth/assets']);
  }
}
