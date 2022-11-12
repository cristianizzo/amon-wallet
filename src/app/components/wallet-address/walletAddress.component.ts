import { Component } from '@angular/core';
import { WalletSelector } from '@app/core/selectors';
import { Store } from '@ngrx/store';
import { StateModel } from '@models/state.model';
import { WalletModel } from '@app/models';
import { ToastService } from '@services/toast.service';

@Component({
  selector: 'app-wallet-address',
  templateUrl: './walletAddress.component.html',
  styleUrls: ['./walletAddress.component.scss'],
})
export class WalletAddressComponent {
  public payloadClipboard: string;
  public wallet: WalletModel;

  constructor(
    private store: Store<StateModel>,
    private toastService: ToastService
  ) {
    this.store.select(WalletSelector.getWallet).subscribe((wallet) => {
      this.wallet = wallet;
      if (wallet) {
        this.payloadClipboard = this.wallet.address;
      }
    });
  }

  /**
   * copied function
   */
  public copied(_: string) {
    this.toastService.responseSuccess('Copied');
  }

  /**
   * copied function
   */
  public parseAddress(address: string) {
    if (address) {
      return `${address.slice(0, 7)}...${address.slice(address.length - 5)}`;
    }
  }
}
