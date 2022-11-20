import { Component } from '@angular/core';
import { FormSelector } from '@app/core/selectors';
import { Store } from '@ngrx/store';
import { StateModel } from '@models/state.model';

@Component({
  selector: 'app-loading-bar',
  templateUrl: './loading-bar.component.html',
  styleUrls: ['./loading-bar.component.scss'],
})
export class LoadingBarComponent {
  public loading: boolean;

  constructor(private readonly store: Store<StateModel>) {
    this.store
      .select(FormSelector.getLoading)
      .subscribe((state) => (this.loading = state.loading));
  }
}
