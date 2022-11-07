// import {Injectable} from '@angular/core';
// import {APIService} from '@services/api';
// import {CoinGeckoToken, WalletModel} from '@app/models';
// import {Observable} from 'rxjs';
// import {map} from 'rxjs/operators';
// import {UtilsHelper} from '@helpers/utils';
// // import logger from '@app/app.logger';
//
// const logContent = (data) => Object.assign({service: 'service:wallet'}, data);
//
// @Injectable()
// export class WalletService {
//
//   tokens: CoinGeckoToken[] = [];
//
//   constructor(
//     private apiService: APIService,
//     private utilsHelper: UtilsHelper
//   ) {
//   }
//
//   public getAll(): Observable<WalletModel[]> {
//     return this.apiService.get('/wallet')
//       .pipe(
//         map(wallets => wallets.map(w => this._parseAddress(w))));
//   }
//
//   public getTokens(rawPayment: PaymentFormModal): Observable<any> {
//
//     return this.apiService.post(`/wallet/${rawPayment.walletId}/send`, rawPayment);
//   }
//
// }
