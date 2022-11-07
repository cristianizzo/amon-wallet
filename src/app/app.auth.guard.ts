import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { LanguageService } from '@services/languages.service';
import { WalletService } from '@services/wallet.service';
import { map } from 'rxjs/operators';
import { TempStorageService } from '@services/tempStorage.service';

@Injectable()

export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private languageService: LanguageService,
    private walletService: WalletService,
    private tempStorageService: TempStorageService,
  ) {
  }

  public canActivate(route: ActivatedRouteSnapshot) {
    return this.walletService.hasWallet().pipe(
      map(isInit => this.authRouter(isInit, route)),
    );
  }

  private authRouter(isInit: boolean, route: ActivatedRouteSnapshot): boolean {

    if (['', 'welcome', 'pick-password'].includes(route.routeConfig.path)) {
      if (isInit) {
        this.router.navigate(['/auth/assets']);
        return false;
      }
    } else if (['seed-phrase'].includes(route.routeConfig.path)) {

      if (!this.tempStorageService.data) {
        this.router.navigate(['/welcome']);
        return false;
      }

      return true;

    } else if (['auth'].includes(route.routeConfig.path)) {

      if (!this.languageService.isSelected()) {
        this.router.navigate(['/']);
        return true;
      } else if (!isInit) {
        this.router.navigate(['/welcome']);
        return false;
      }
    }

    if (
      route.routeConfig.path === ''
    ) {
      if (this.languageService.isSelected()) {
        this.router.navigate(['/welcome']);
        return false;
      }

      return true;
    }

    return true;
  }
}
