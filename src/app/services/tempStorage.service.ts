import { Injectable } from '@angular/core';

@Injectable()
export class TempStorageService {
  private _data;

  get data() {
    return this._data;
  }

  set data(item: any) {
    this._data = item;
  }
}
