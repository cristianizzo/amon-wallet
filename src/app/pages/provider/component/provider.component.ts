import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ProviderModel, StateModel } from '@app/models';
import { ProviderSelector } from '@app/core/selectors';
import { TokenActions } from '@app/core/actions';

@Component({
  selector: 'app-provider',
  templateUrl: 'provider.component.html',
  styleUrls: ['provider.component.scss'],
})
export class ProviderComponent {
  public providers: ProviderModel[];
  public search: string;

  constructor(
    private readonly store: Store<StateModel>,
    private router: Router
  ) {
    this.store
      .select(ProviderSelector.getProviders)
      .subscribe((providers) => (this.providers = providers));
  }

  public switchProvider(provider: ProviderModel) {
    console.log(provider);
    // this.store.dispatch(TokenActions.unselectToken(address));
  }

  public addProvider() {
    // TODO:
  }

  /**
   * goBack Function
   */
  public goBack() {
    this.router.navigate(['/auth/assets']);
  }
}
