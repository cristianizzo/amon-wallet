import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AssetsComponent } from '@pages/assets/component/assets.component';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { AssetsRoutingModule } from '@pages/assets/assets.routing';
import { TranslateModule } from '@ngx-translate/core';
import { TotalBalanceModule } from '@components/total-balance/totalBalance.module';
import { WalletAddressModule } from '@components/wallet-address/walletAddress.module';
import { WalletActionButtonsModule } from '@components/wallet-action-buttons/walletActionButtons.module';
import { TokensModule } from '@components/tokens/tokens.module';
import { NgAmonDirectivesModule } from '@directives/index.module';
import { AccountModule } from '@components/account/account.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    AssetsRoutingModule,
    TranslateModule,
    TotalBalanceModule,
    WalletAddressModule,
    WalletActionButtonsModule,
    TokensModule,
    NgAmonDirectivesModule,
    ReactiveFormsModule,
    AccountModule,
  ],
  declarations: [AssetsComponent],
})
export class AssetsModule {}
