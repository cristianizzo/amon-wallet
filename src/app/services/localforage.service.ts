import { Injectable } from '@angular/core';
import { NgForage } from 'ngforage';

@Injectable()
export class LocalForageService {
  constructor(
    private readonly ngf: NgForage // private readonly cache: NgForageCache,
  ) {}

  public async getItem<T = any>(key: string): Promise<T | any> {
    return this.ngf.getItem<T>(key);
  }

  // public getCachedItem<T = any>(key: string): Promise<T | null> {
  //   return this.cache.getCached<T>(key).then((r: CachedItem<T>) => {
  //     if (!r.hasData || r.expired) {
  //       return null;
  //     }
  //
  //     return r.data;
  //   });
  // }

  public setItem<T = any>(key: string, data: T): Promise<T> {
    return this.ngf.setItem<T>(key, data);
  }

  // public removeItem<T = string>(key: string): Promise<void> {
  //   return this.ngf.removeItem(key);
  // }
}
