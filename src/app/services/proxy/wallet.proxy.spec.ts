import { TestBed, waitForAsync } from '@angular/core/testing';
import { NgAmonHelpersModule } from '@app/helpers/index.module';
import { IonicModule } from '@ionic/angular';
import { WalletProxy } from '@services/proxy/wallet.proxy';
import { ChainProxy } from '@services/proxy/chain.proxy';
import { WalletService } from '@services/wallet.service';
import { Web3Services } from '@services/web3.service';
import { HDPathsHelper } from '@app/helpers/hdPaths';
import { NgAmonServicesModule } from '@services/index.module';
import { environment } from '@env/environment';

describe('Service: ProxyWallet', () => {
  let chainProxy: any;
  let walletProxy: any;
  let web3Services: any;
  let hdPathsHelper: any;
  let walletServices: any;
  let originalTimeout: any;

  beforeEach(waitForAsync(async () => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        NgAmonHelpersModule,
        NgAmonServicesModule.forRoot(environment),
      ],
      providers: [
        WalletProxy,
        ChainProxy,
        Web3Services,
        WalletService,
        HDPathsHelper,
      ],
    });

    chainProxy = TestBed.inject(ChainProxy);
    walletProxy = TestBed.inject(WalletProxy);
    web3Services = TestBed.inject(Web3Services);
    walletServices = TestBed.inject(WalletService);
    hdPathsHelper = TestBed.inject(HDPathsHelper);
    await chainProxy.initChain().toPromise();
  }));

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('getWalletWithDerivatePaths', async () => {
    const wallet = web3Services.getWallet({
      name: 'main',
      main: true,
      derivationPath: hdPathsHelper.getHdMainPath(),
    });

    await walletServices.saveWalletToStorage(wallet);
    const wallets = await walletProxy.getWalletWithDerivatePaths(0, 2);

    expect(wallets.length).toEqual(2);
    expect(wallets[0].basePath).toEqual(`m/44'/60'/0'/0/0`);
    expect(wallets[1].basePath).toEqual(`m/44'/60'/0'/0/1`);

    const wallets2 = await walletProxy.getWalletWithDerivatePaths(10, 2);
    expect(wallets2[0].basePath).toEqual(`m/44'/60'/0'/0/10`);
    expect(wallets2[1].basePath).toEqual(`m/44'/60'/0'/0/11`);
  });

  // it('should add wallet', async () => {
  //   // const rawWallet = {
  //   //   main: true;
  //   //   connected?: boolean;
  //   //   name: string;
  //   //   address: string;
  //   //   balance?: string;
  //   //   tokens?: TokenModel[];
  //   //   phrase?: string;
  //   //   basePath?: string;
  //   //   privateKey?: string;
  //   //   walletType: string | WalletType;
  //   //   signerType: string | SignerType;
  //   //   isHardware: boolean;
  //   //   encrypted?: EncryptedDataModel;
  //   // }
  //   // const dbWallets = await walletProxy.getDerivatePath();
  //   // console.log(dbWallets);
  // });

  // it('should create', async () => {
  //   const dbWallets = await walletProxy.getDerivatePath();
  //   console.log(dbWallets);
  // });
});
