import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { FormActions, TokenActions } from '@app/core/actions';
import { TokenService } from '@services/token.service';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import logger from '@app/app.logger';
import {
  CurrencySelector,
  ChainSelector,
  WalletSelector,
} from '@core/selectors';
import { Store } from '@ngrx/store';
import { StateModel } from '@app/models';

const logContent = logger.logContent('core:effects:token');

@Injectable()
export class TokenEffects {
  initTokens$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TokenActions.initTokens),
      concatLatestFrom(() => [
        this.store.select(ChainSelector.getChain),
        this.store.select(CurrencySelector.getCurrency),
        this.store.select(WalletSelector.getWallet),
      ]),
      switchMap(([_, chain, currency, wallet]) =>
        this.tokenService
          .initTokens(chain, currency, wallet)
          .pipe(map((tokens) => TokenActions.updateStateTokens(tokens)))
      ),
      catchError((error) => {
        logger.error(
          logContent.add({
            info: `error init tokens`,
            error,
          })
        );
        return of(FormActions.formError(error));
      })
    )
  );

  addToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TokenActions.addToken),
      concatLatestFrom(() => [
        this.store.select(ChainSelector.getChain),
        this.store.select(CurrencySelector.getCurrency),
        this.store.select(WalletSelector.getWallet),
      ]),
      switchMap(([action, chain, currency, wallet]) =>
        this.tokenService.addToken(action.address, wallet, chain, currency)
      ),
      map((token) => TokenActions.addTokenToState(token)),
      catchError((error) => {
        logger.error(
          logContent.add({
            info: `error add token`,
            error,
          })
        );
        return of(FormActions.formError(error));
      })
    )
  );

  updateToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TokenActions.updateToken),
      concatLatestFrom(() => [
        this.store.select(ChainSelector.getChain),
        this.store.select(CurrencySelector.getCurrency),
        this.store.select(WalletSelector.getWallet),
      ]),
      switchMap(([action, chain, currency, wallet]) =>
        this.tokenService.updateToken(
          action.address,
          {
            name: action.name,
            symbol: action.symbol,
            decimals: action.decimals,
          },
          wallet,
          chain,
          currency
        )
      ),
      map((token) => TokenActions.updateTokenToState(token)),
      catchError((error) => {
        logger.error(
          logContent.add({
            info: `error update token`,
            error,
          })
        );
        return of(FormActions.formError(error));
      })
    )
  );

  selectToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TokenActions.selectToken),
      concatLatestFrom(() => [
        this.store.select(ChainSelector.getChain),
        this.store.select(CurrencySelector.getCurrency),
        this.store.select(WalletSelector.getWallet),
      ]),
      switchMap(([action, chain, currency, wallet]) =>
        this.tokenService.selectToken(action.address, wallet, chain, currency)
      ),
      map((token) => TokenActions.updateTokenToState(token)),
      catchError((error) => {
        logger.error(
          logContent.add({
            info: `error select token`,
            error,
          })
        );
        return of(FormActions.formError(error));
      })
    )
  );

  unselectToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TokenActions.unselectToken),
      concatLatestFrom(() => [this.store.select(ChainSelector.getChain)]),
      switchMap(([action, chain]) =>
        this.tokenService.unselectToken(action.address, chain)
      ),
      map((token) => TokenActions.updateTokenToState(token)),
      catchError((error) => {
        logger.error(
          logContent.add({
            info: `error unselect token`,
            error,
          })
        );
        return of(FormActions.formError(error));
      })
    )
  );

  constructor(
    private actions$: Actions,
    private tokenService: TokenService,
    private store: Store<StateModel>
  ) {}
}
