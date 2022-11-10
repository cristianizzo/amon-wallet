import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssetsComponent } from '@pages/assets/component/assets.component';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { AssetsRoutingModule } from '@pages/assets/assets.routing';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderModule } from '@components/header/header.module';
import { TotalBalanceModule } from '@components/total-balance/totalBalance.module';
import { WalletAddressModule } from '@components/wallet-address/walletAddress.module';
import { WalletActionButtonsModule } from '@components/wallet-action-buttons/walletActionButtons.module';
import { TokensModule } from '@components/tokens/tokens.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    AssetsRoutingModule,
    TranslateModule,
    HeaderModule,
    TotalBalanceModule,
    WalletAddressModule,
    WalletActionButtonsModule,
    TokensModule,
  ],
  declarations: [AssetsComponent],
})
export class AssetsModule {}
