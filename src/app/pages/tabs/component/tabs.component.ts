import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { UtilsHelper } from '@app/helpers/utils';
import { MenuModel } from '@app/models';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.component.html',
  styleUrls: ['tabs.component.scss'],
})
export class TabsComponent {
  public menu: MenuModel[];
  public selectedTab: string;
  public hiddenTabs: boolean;
  public pathHidden = ['/auth/setting', '/auth/deposit'];

  constructor(private utilsHelper: UtilsHelper, public router: Router) {
    this.menu = this.utilsHelper.menuJson;
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((_: NavigationEnd) => {
        this.hiddenTabs = this.pathHidden.some(
          (r) => this.router.routerState.snapshot.url.indexOf(r) >= 0
        );
      });
  }

  /**
   * switched function
   */
  switched(event: any) {
    this.selectedTab = event.tab;
    if (event.tab === 'exchange') {
      this.router.navigate(['/auth/exchange']);
    } else if (event.tab === 'nfts') {
      this.router.navigate(['/auth/nfts']);
    }
  }

  /**
   * isActive function
   */
  isActive(tab: string) {
    return this.selectedTab === tab;
  }
}
