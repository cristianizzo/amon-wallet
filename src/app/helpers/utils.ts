import { Injectable } from '@angular/core';
import { CurrencyModel, MenuModel, ProviderModel, WalletModel } from '@app/models';
import { CurrenciesJson, MenuJson, ProvidersJson } from '@assets/data';
import { chunk, sample, shuffle } from 'lodash';
import qs from 'qs';

@Injectable()
export class UtilsHelper {

  public regex = {
    amount: '^[0-9\.]*$',
    password: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$',
    passwordStrong: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[?.,=-£$%^*!@#$&*~]).{8,}$',
    address: '^[a-zA-Z0-9 ]*$',
    // eslint-disable-next-line id-blacklist
    number: '^[0-9]*$', // only numbers
    // eslint-disable-next-line id-blacklist
    string: '^[a-zA-Z ]*$',
  };

  public menuJson: MenuModel[] = MenuJson;
  public providersJson: ProviderModel[] = ProvidersJson;
  public currenciesJson: CurrencyModel[] = CurrenciesJson;

  public noop: () => 0;

  public async wait(ms: number): Promise<any> {

    return new Promise(res => setTimeout(res, ms));
  }

  public notNull(value: any): boolean {

    return (value && value !== undefined && value !== null);
  }

  public splitArrayIntoChunks(array: any, perChunk: number): any[] {
    return array.reduce((all, one, i) => {
      const ch = Math.floor(i / perChunk);
      all[ch] = [].concat((all[ch] || []), one);
      return all;
    }, []);
  }

  public phraseItems(phrases): { index: number; items: { name: string; valid: boolean, answer: boolean }[] }[] {

    return chunk(shuffle(phrases), 3).reduce((acc, _chunk) => {
      const randWord = sample(_chunk) || '';
      acc.push({
        index: phrases.findIndex((p) => p === randWord),
        items: _chunk.map((ck) => ({name: ck, valid: ck === randWord, answer: false})),
      });
      return acc;
    }, []);
  }

  public stringHasValue(value: string): boolean {

    if (!value) {
      return false;
    }

    try {
      return value && Object.prototype.toString.call(value) === '[object String]' && value.length > 0;
    } catch (error) {
      return false;
    }
  }

  public objectHasValue(value: any): boolean {

    try {

      return value && value === Object(value) && Object.keys(value).length > 0;

    } catch (e) {
      return false;
    }
  }

  public arrayHasValue(array: any): boolean {

    if (!array) {
      return false;
    }

    try {

      return array && Array.isArray(array) && array.length > 0;

    } catch (e) {
      return false;
    }
  }

  public isObject(value: any): boolean {

    try {
      return value === Object(value);
    } catch (_) {
      return false;
    }
  }

  public arrayOfNumber(num: number): number[] {
    return Array.from(Array(num), (_, x) => x);
  }

  public getLanguagePath(lang: string) {
    return `assets/img/flags/${lang.toLowerCase()}-flag.png`;
  }

  public loaderOption(duration?: null): any {

    return {
      message: '<ion-img src="/assets/img/loader.svg"></ion-img>',
      cssClass: 'amn-loader',
      translucent: true,
      showBackdrop: false,
      spinner: null,
      duration
    };
  }

  public sortWallets(state: WalletModel[]): WalletModel[] {
    if (state && state.length > 0) {
      return Object.assign([], state).sort((a, b) => Number(b.connected) - Number(a.connected));
    }
    return state;
  };

  public async async(fun) {
    try {
      const result = await fun();
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public cryptoPrecision(value?: string, decimal?: number): string {

    if (!decimal && decimal !== 0) {
      decimal = 8;
    }

    if (!value) {
      let s = '0.0';
      while (--decimal) {
        s += '0';
      }

      return s;
    }

    const op = value.split('.');

    if (op[1] && op[1].length < decimal) {

      const diff = (decimal - op[1].length);

      new Array(diff).fill(0).forEach(() => {
        op[1] += '0';
      });

      return this._parseBalance(op);

    } else if (op[1] && op[1].length > decimal) {

      op[1] = op[1].slice(0, -decimal);

      return this._parseBalance(op);

    } else if (op[0] && !op[1]) {

      let digits = '';

      new Array(decimal).fill(0).forEach(() => {
        digits += '0';
      });

      op.push(digits);

      return this._parseBalance(op);

    } else {

      return value;
    }

  }

  /**
   *
   * This generate an URI string to be used in links or QR-code
   *
   * @param {Object} params
   * @param {string} params.address
   * @param {?string} params.coinCode [ETH]
   * @param {?string} params.amount Amount requested, optional
   *
   * @return {string} URI as text
   */
  public qrCodeStringify({address, amount = 0}) {

    const prefix = 'ethereum';
    let uri = `${prefix}:`;
    uri += address;

    const options: any = {};

    if (amount) {
      options.amount = amount;
    }

    if (Object.keys(options).length > 0) {
      uri += '?';
      const query = qs.stringify(options);
      uri += query;
    }
    return uri;
  }

  private _parseBalance(value) {

    if (this.stringHasValue(value[1])) {
      return value.join().replace(',', '.');
    } else {
      return value[0];
    }
  }
}

