import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { LanguageService } from '@services/languages.service';

@Injectable()

export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private languageService: LanguageService,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot) {

    if (
      route.routeConfig.path === ''
    ) {

      if (this.languageService.isSelected()) {
        this.router.navigate(['/welcome']);
        return false;
      }
      return true;
    }
  }
}
