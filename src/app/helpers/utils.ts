import { Injectable } from '@angular/core';
import { CurrenciesJson, ProvidersJson } from '@assets/data';
import { chunk, sample, shuffle } from 'lodash';

@Injectable()
export class UtilsHelper {

  public regex = {
    password: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$',
    passwordStrong: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[?.,=-£$%^*!@#$&*~]).{8,}$',
  };

  public providersJson = ProvidersJson;
  public currenciesJson = CurrenciesJson;

  public noop: () => 0;

  public async wait(ms: number): Promise<any> {

    return new Promise(res => setTimeout(res, ms));
  }

  public notNull(value: any): boolean {

    return (value && value !== undefined && value !== null);
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
}

