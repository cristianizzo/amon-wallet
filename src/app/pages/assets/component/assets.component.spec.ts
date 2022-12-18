import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { AssetsComponent } from './assets.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AssetsRoutingModule } from '@pages/assets/assets.routing';
import { TranslateModule } from '@ngx-translate/core';
import { TotalBalanceModule } from '@components/total-balance/totalBalance.module';
import { WalletAddressModule } from '@components/wallet-address/walletAddress.module';
import { WalletActionButtonsModule } from '@components/wallet-action-buttons/walletActionButtons.module';
import { TokensModule } from '@components/tokens/tokens.module';
import { NgAmonDirectivesModule } from '@directives/index.module';
import { AccountModule } from '@components/account/account.module';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '@app/app-routing.module';
import { NgAmonServicesModule } from '@services/index.module';
import { environment } from '@env/environment';
import { NgAmonHelpersModule } from '@helpers/index.module';
import { NgAmonPipesModule } from '@pipes/index.module';
import { NgAmonCoreModule } from '@core/index.module';
import { LoadingBarModule } from '@components/loading-bar/loading-bar.module';

describe('AssetsPage', () => {
  let component: AssetsComponent;
  let fixture: ComponentFixture<AssetsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AssetsComponent],
      imports: [
        CommonModule,
        FormsModule,
        ExploreContainerComponentModule,
        AssetsRoutingModule,
        TranslateModule,
        TotalBalanceModule,
        WalletAddressModule,
        WalletActionButtonsModule,
        TokensModule,
        ReactiveFormsModule,
        AccountModule,
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        NgAmonServicesModule.forRoot(environment),
        NgAmonHelpersModule,
        NgAmonPipesModule,
        NgAmonDirectivesModule,
        NgAmonCoreModule.forRoot(),
        LoadingBarModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
