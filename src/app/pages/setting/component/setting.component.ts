import { environment } from '@env/environment';
import { Component, OnInit } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { CurrencyModel, StateModel } from '@app/models';
import { UtilsHelper } from '@helpers/utils';
import { Router } from '@angular/router';
import { LanguageService } from '@services/languages.service';
import * as packageJson from '../../../../../package.json';
import { CurrencySelector } from '@app/core/selectors';
import { Store } from '@ngrx/store';
import { ModalController } from '@ionic/angular';
import { CurrencySelectorComponent } from '@components/currency-selector/currency-selector.component';

// @ts-ignore
const logContent = (data) => Object.assign({ service: 'setting' }, data);

@Component({
  selector: 'app-setting',
  templateUrl: 'setting.component.html',
  styleUrls: ['setting.component.scss'],
})
export class SettingComponent implements OnInit{
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
  ) {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    this.version = packageJson['default'].version;
    this.network = environment.network;
    this.isLocal = environment.env === 'local';
  }

  ngOnInit() {
    this.store
      .select(CurrencySelector.getCurrency)
      .subscribe((currency) => (this.currency = currency));
  }

  ionViewWillEnter(): void {}

  ionViewDidLeave(): void {}

  public async askChangeCurrency() {
    const currencyModal = await this.modalCtrl.create({
      id: 'change-currency',
      component: CurrencySelectorComponent,
      cssClass: 'modal-mini',
      backdropDismiss: true,
      componentProps: {}
    });

    currencyModal.onDidDismiss().then(async () => {
      // TODO should be updated from the subscribed one
      // this.currency = await this.appState.getNewState('appCurrency');
    });

    await currencyModal.present();
  }

  public askChangeLanguage() {
    // const buttons = [];
    // environment.languages.map(lang => {
    //   buttons.push({
    //     text: this.langService.getTranslate(`LANGUAGES.${lang}`),
    //     role: lang,
    //     handler: async () => {
    //       this.langService.setLanguage(lang);
    //       this.getLanguage();
    //       await this.updateUser({
    //         language: lang.toUpperCase()
    //       });
    //     }
    //   });
    // });
    //
    // buttons.push({
    //   text: this.langService.getTranslate('BUTTON.cancel'),
    //   icon: 'close',
    //   role: 'cancel',
    //   handler: () => {
    //   }
    // });
    //
    // const actionSheet = await this.actionSheetController.create({
    //   header: this.langService.getTranslate('PAGE.SETTING.ACTION_SHEET.SELECT_LANG'),
    //   buttons,
    //   cssClass: ['blur-action-sheet']
    // });
    //
    // await actionSheet.present();
  }

  public askChangeTheme() {
    // const lightThemeLabel = this.langService.getTranslate('PAGE.SETTING.THEME.LIGHT');
    // const darkThemeLabel = this.langService.getTranslate('PAGE.SETTING.THEME.DARK');
    //
    // const buttons = [
    //   {
    // eslint-disable-next-line max-len
    //     text: (this.selectedTheme === 'dark') ? this.utilsHelper.capitalizeFirstLetter(lightThemeLabel) : this.utilsHelper.capitalizeFirstLetter(darkThemeLabel),
    //     role: (this.selectedTheme === 'dark') ? 'light' : 'dark',
    //     handler: () => {
    //       this.themeService.saveTheme((this.selectedTheme === 'dark') ? 'light' : 'dark');
    //       this.getTheme();
    //       this.changeStatusBar();
    //     }
    //   },
    //   {
    //     text: this.langService.getTranslate('BUTTON.cancel'),
    //     icon: 'close',
    //     role: 'cancel',
    //     handler: () => {
    //     }
    //   }
    // ];
    //
    // const actionSheet = await this.actionSheetController.create({
    //   header: this.langService.getTranslate('PAGE.SETTING.ACTION_SHEET.SELECT_THEME'),
    //   buttons,
    //   cssClass: ['blur-action-sheet']
    // });
    //
    // await actionSheet.present();
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
