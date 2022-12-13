import { Injectable } from '@angular/core';
import { WalletModel } from '@app/models';

interface HDPathModel {
  m: string;
  purpose: string;
  coinType: string;
  account?: string;
  change?: string;
  index?: string;
}

const initHdPath = {
  m: undefined,
  purpose: undefined,
  coinType: undefined,
  account: undefined,
  change: undefined,
  index: undefined,
};

@Injectable()
export class HDPathsHelper {
  path = {
    m: 'm',
    purpose: '44', // 44'
    coinType: '0', // 0'
    account: '0', // 0'
    change: '0',
    index: '0',
  };

  constructor() {}

  _getPathIndex(basePath: string): string {
    const pathArray = basePath.split('/');
    const nextIndex = Number(pathArray[pathArray.length - 1]) + 1;
    pathArray[pathArray.length - 1] = nextIndex.toString();

    return pathArray.join().replace(/,/g, '/');
  }

  pathToObject(basePath: string): HDPathModel | any {
    const pathArray = basePath.split('/');
    return pathArray.reduce((acc, value, i) => {
      acc[Object.keys(this.path)[i]] = value.replace(/'/g, '');
      return acc;
    }, {});
  }

  getNextPath(dbWallets: WalletModel[]) {
    const mainWallet = dbWallets.find((w) => w.main);

    let nextPath = null;
    let basePath = mainWallet.basePath;

    while (!nextPath) {
      basePath = this._getPathIndex(basePath);
      const wallet = dbWallets.find((w) => w.basePath === basePath);

      if (!wallet) {
        nextPath = basePath;
      }
    }

    return nextPath;
  }

  getHdMainPath({
    m,
    purpose,
    coinType,
    account,
    change,
    index,
  }: HDPathModel = initHdPath) {
    const paths = this.getHdIndexPaths(
      {
        m,
        purpose,
        coinType,
        account,
        change,
        index,
      },
      0,
      10
    );

    return paths[0];
  }

  getHdIndexPaths(
    { m, purpose, coinType, account, change, index }: HDPathModel = initHdPath,
    offset = 0,
    limit = 10
  ) {
    if (offset > 0) {
      limit = offset + 10;
    }

    const derivatePaths = Array.from(Array(limit).keys())
      .slice(offset)
      .reduce((acc, ii) => {
        const path = this.composePath({
          m,
          purpose,
          coinType,
          account: account ? account : ii.toString(),
          change: change ? change : ii.toString(),
          index: index ? index : ii.toString(),
        });
        acc.push(path);
        return acc;
      }, []);

    return derivatePaths;
  }

  public composePath({
    m,
    purpose,
    coinType,
    account,
    change,
    index,
  }: HDPathModel = initHdPath) {
    const fullPath = Object.keys(this.path).reduce((acc, key, ii) => {
      let separator = '/';
      if (ii === Object.keys(this.path).length - 1) {
        separator = '';
      }

      let section = this.path[key];

      if (key === 'm' && m) {
        section = m;
      }

      if (key === 'purpose' && purpose) {
        section = purpose;
      }

      if (key === 'coinType' && coinType) {
        section = coinType;
      }

      if (key === 'account' && account) {
        section = account;
      }

      if (key === 'change' && change) {
        section = change;
      }

      if (key === 'index' && index) {
        section = index;
      }

      if (ii === 1 || ii === 2 || ii === 3) {
        section += `'`;
      }

      acc += section + separator;

      return acc;
    }, '');

    return fullPath;
  }
}
