import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ChainSelector, TokenSelector, WalletSelector } from '@core/selectors';
import { FormActions, TokenActions } from '@app/core/actions';
import { TokenProxy } from '@services/proxy/token.proxy';
import { Store } from '@ngrx/store';
import { StateModel } from '@app/models';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import logger from '@app/app.logger';

const logContent = logger.logContent('core:effects:token');

@Injectable()
export class TokenEffects {
  initTokens$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TokenActions.initTokens),
      concatLatestFrom(() => [
        this.store.select(ChainSelector.getChain),
        this.store.select(WalletSelector.getWallet),
      ]),
      exhaustMap(([_, chain, wallet]) =>
        this.tokenProxy
          .initTokens(chain, wallet)
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

  getAllTokens$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TokenActions.getAllTokens),
      tap(() => [this.store.dispatch(TokenActions.setLoading(true, false))]),
      concatLatestFrom(() => [this.store.select(ChainSelector.getChain)]),
      exhaustMap(([_, chain]) => this.tokenProxy.getAllTokens(chain)),
      map((tokens) => TokenActions.getAllTokensSuccess(tokens)),
      tap(() => [this.store.dispatch(TokenActions.setLoading(false, false))]),
      catchError((error) => {
        logger.error(
          logContent.add({
            info: `error get all tokens`,
            error,
          })
        );
        return of(FormActions.formError(error));
      })
    )
  );

  loadBalances$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TokenActions.loadBalances),
      tap(() => [this.store.dispatch(TokenActions.setLoading(false, true))]),
      concatLatestFrom(() => [
        this.store.select(WalletSelector.getWallet),
        this.store.select(TokenSelector.getSelectedTokens),
      ]),
      exhaustMap(([_, wallet, tokens]) =>
        this.tokenProxy.loadBalances(tokens, wallet)
      ),
      map((tokens) => TokenActions.updateStateTokens(tokens)),
      tap(() => [this.store.dispatch(TokenActions.setLoading(false, false))])
    )
  );

  addToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TokenActions.addToken),
      tap(() =>
        this.store.dispatch(
          FormActions.formStart({ topLoading: true, loading: true })
        )
      ),
      concatLatestFrom(() => [
        this.store.select(ChainSelector.getChain),
        this.store.select(WalletSelector.getWallet),
      ]),
      exhaustMap(([action, chain, wallet]) =>
        this.tokenProxy.addToken(action.address, wallet, chain)
      ),
      map((token) => TokenActions.addTokenToState(token)),
      tap(() => this.store.dispatch(FormActions.formEnd())),
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
      tap(() =>
        this.store.dispatch(FormActions.formStart({ topLoading: true }))
      ),
      concatLatestFrom(() => [
        this.store.select(ChainSelector.getChain),
        this.store.select(WalletSelector.getWallet),
      ]),
      exhaustMap(([action, chain, wallet]) =>
        this.tokenProxy.updateToken(
          action.address,
          {
            name: action.name,
            symbol: action.symbol,
            decimals: action.decimals,
          },
          wallet,
          chain
        )
      ),
      map((token) => TokenActions.updateTokenToState(token)),
      tap(() => this.store.dispatch(FormActions.formEnd())),
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
      tap(() => [
        this.store.dispatch(FormActions.formStart({ topLoading: true })),
      ]),
      concatLatestFrom(() => [
        this.store.select(ChainSelector.getChain),
        this.store.select(WalletSelector.getWallet),
      ]),
      exhaustMap(([action, chain, wallet]) =>
        this.tokenProxy.selectToken(action.address, wallet, chain)
      ),
      map((token) => TokenActions.addTokenToState(token)),
      tap(() => [this.store.dispatch(FormActions.formEnd())]),
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
      tap(() =>
        this.store.dispatch(FormActions.formStart({ topLoading: true }))
      ),
      concatLatestFrom(() => [this.store.select(ChainSelector.getChain)]),
      exhaustMap(([action, chain]) =>
        this.tokenProxy.unselectToken(action.address, chain)
      ),
      map((token) => TokenActions.removeTokenToState(token)),
      tap(() => this.store.dispatch(FormActions.formEnd())),
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
    private tokenProxy: TokenProxy,
    private store: Store<StateModel>
  ) {}
}
