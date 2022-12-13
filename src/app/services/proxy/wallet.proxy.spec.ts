import { TestBed } from '@angular/core/testing';
import { NgAmonHelpersModule } from '@app/helpers/index.module';
import { IonicModule } from '@ionic/angular';
import { WalletProxy } from '@services/proxy/wallet.proxy';
import { WalletService } from '@services/wallet.service';
import { Web3Services } from '@services/web3.service';
import { HDPathsHelper } from '@app/helpers/hdPaths';
import { NgAmonServicesModule } from '@services/index.module';
import { environment } from '@env/environment';

describe('Service: ProxyWallet', () => {
  let walletProxy: any;
  let web3Services: any;
  let hdPathsHelper: any;
  let walletServices: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        NgAmonHelpersModule,
        NgAmonServicesModule.forRoot(environment),
      ],
      providers: [WalletProxy],
    });

    walletProxy = TestBed.inject(WalletProxy);
    web3Services = TestBed.inject(Web3Services);
    walletServices = TestBed.inject(WalletService);
    hdPathsHelper = TestBed.inject(HDPathsHelper);
  });

  fit('getWalletWithDerivatePaths', async () => {
    const wallet = web3Services.getWallet({
      name: 'main',
      main: true,
      derivationPath: hdPathsHelper.getHdMainPath(),
    });

    await walletServices.saveWalletToStorage(wallet);
    const wallets = await walletProxy.getWalletWithDerivatePaths(0, 10);

    expect(wallets.length).toEqual(10);
    expect(wallets[0].basePath).toEqual('m/44\'/0\'/0\'/0/0');
    expect(wallets[1].basePath).toEqual('m/44\'/0\'/0\'/0/1');
    expect(wallets[2].basePath).toEqual('m/44\'/0\'/0\'/0/2');
    expect(wallets[3].basePath).toEqual('m/44\'/0\'/0\'/0/3');
    expect(wallets[4].basePath).toEqual('m/44\'/0\'/0\'/0/4');
    expect(wallets[5].basePath).toEqual('m/44\'/0\'/0\'/0/5');
    expect(wallets[6].basePath).toEqual('m/44\'/0\'/0\'/0/6');
    expect(wallets[7].basePath).toEqual('m/44\'/0\'/0\'/0/7');
    expect(wallets[8].basePath).toEqual('m/44\'/0\'/0\'/0/8');
    expect(wallets[9].basePath).toEqual('m/44\'/0\'/0\'/0/9');

    const wallets2 = await walletProxy.getWalletWithDerivatePaths(10, 2);
    expect(wallets2[0].basePath).toEqual('m/44\'/0\'/0\'/0/10');
    expect(wallets2[1].basePath).toEqual('m/44\'/0\'/0\'/0/11');

  });

  it('should add wallet', async () => {
    // const rawWallet = {
    //   main: true;
    //   connected?: boolean;
    //   name: string;
    //   address: string;
    //   balance?: string;
    //   tokens?: TokenModel[];
    //   phrase?: string;
    //   basePath?: string;
    //   privateKey?: string;
    //   walletType: string | WalletType;
    //   signerType: string | SignerType;
    //   isHardware: boolean;
    //   encrypted?: EncryptedDataModel;
    // }
    // const dbWallets = await walletProxy.getDerivatePath();
    // console.log(dbWallets);
  });

  it('should create', async () => {
    const dbWallets = await walletProxy.getDerivatePath();
    console.log(dbWallets);
  });
});
