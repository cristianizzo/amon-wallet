import { TestBed } from '@angular/core/testing';
import { HDPathsHelper } from '@app/helpers/hdPaths';
import { IonicModule } from '@ionic/angular';

describe('Helpers: hdPaths', () => {
  let hdPathsHelper: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot()],
      providers: [HDPathsHelper],
    });

    hdPathsHelper = TestBed.inject(HDPathsHelper);
  });

  it('pathToObject', () => {
    const basePath = `m/44'/0'/0'/0/0`;
    const pathObject = hdPathsHelper.pathToObject(basePath);
    expect(pathObject).toEqual({
      m: 'm',
      purpose: '44',
      coinType: '0',
      account: '0',
      change: '0',
      index: '0',
    });
  });

  it('getNextPath', () => {
    const wallets = [{ basePath: `m/44'/0'/0'/0/0`, main: true }];
    let hdPath = hdPathsHelper.getNextPath(wallets);
    expect(hdPath).toEqual(`m/44'/0'/0'/0/1`);

    wallets.push({ basePath: `m/44'/0'/0'/0/1`, main: false });
    wallets.push({ basePath: `m/44'/0'/0'/0/2`, main: false });

    hdPath = hdPathsHelper.getNextPath(wallets);
    expect(hdPath).toEqual(`m/44'/0'/0'/0/3`);
  });

  it('getHdMainPath', () => {
    const hdPath = hdPathsHelper.getHdMainPath({});
    expect(hdPath).toEqual(`m/44'/0'/0'/0/0`);
  });

  it('getHdIndexPaths - pagination by 10', () => {
    let hdPaths = hdPathsHelper.getHdIndexPaths({});
    expect(hdPaths.length).toEqual(10);

    Array.from(Array(10).keys()).map((index) => {
      expect(hdPaths[index]).toEqual(`m/44'/0'/${index}'/${index}/${index}`);
    });

    hdPaths = hdPathsHelper.getHdIndexPaths({}, 10);
    expect(hdPaths.length).toEqual(10);

    Array.from(Array(10).keys()).map((index) => {
      expect(hdPaths[index]).toEqual(
        `m/44'/0'/${index + 10}'/${index + 10}/${index + 10}`
      );
    });

    hdPaths = hdPathsHelper.getHdIndexPaths({ account: '0' }, 10);
    expect(hdPaths.length).toEqual(10);

    Array.from(Array(10).keys()).map((index) => {
      expect(hdPaths[index]).toEqual(`m/44'/0'/0'/${index + 10}/${index + 10}`);
    });

    hdPaths = hdPathsHelper.getHdIndexPaths({ change: '0' }, 10);
    expect(hdPaths.length).toEqual(10);

    Array.from(Array(10).keys()).map((index) => {
      expect(hdPaths[index]).toEqual(`m/44'/0'/${index + 10}'/0/${index + 10}`);
    });

    hdPaths = hdPathsHelper.getHdIndexPaths({ index: '0' }, 10);
    expect(hdPaths.length).toEqual(10);

    Array.from(Array(10).keys()).map((index) => {
      expect(hdPaths[index]).toEqual(`m/44'/0'/${index + 10}'/${index + 10}/0`);
    });
  });

  it('composePath', async () => {
    let path = hdPathsHelper.composePath({});
    expect(path).toEqual(`m/44'/0'/0'/0/0`);

    path = hdPathsHelper.composePath({ m: 'x' });
    expect(path).toEqual(`x/44'/0'/0'/0/0`);

    path = hdPathsHelper.composePath({ m: 'x', purpose: '20' });
    expect(path).toEqual(`x/20'/0'/0'/0/0`);

    path = hdPathsHelper.composePath({ m: 'x', purpose: '20', coinType: '12' });
    expect(path).toEqual(`x/20'/12'/0'/0/0`);

    path = hdPathsHelper.composePath({
      m: 'x',
      purpose: '20',
      coinType: '12',
      account: '01',
    });
    expect(path).toEqual(`x/20'/12'/01'/0/0`);

    path = hdPathsHelper.composePath({
      m: 'x',
      purpose: '20',
      coinType: '12',
      account: '01',
      change: '1',
    });
    expect(path).toEqual(`x/20'/12'/01'/1/0`);

    path = hdPathsHelper.composePath({
      m: 'x',
      purpose: '20',
      coinType: '12',
      account: '01',
      change: '1',
      index: '10',
    });
    expect(path).toEqual(`x/20'/12'/01'/1/10`);

    path = hdPathsHelper.composePath({
      m: 'm',
      purpose: '44',
      coinType: '0',
      account: '0',
      change: '0',
      index: '4',
    });
    expect(path).toEqual(`m/44'/0'/0'/0/4`);
  });
});
