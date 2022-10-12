import { Pipe, PipeTransform } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import moment from '@helpers/moment';

const defaultDateFormat = 'dd MMM YYYY';

@Pipe({
  name: 'appLocaleDate',
})

export class LocaleDatePipe implements PipeTransform {

  constructor(
    private translateService: TranslateService
  ) {
  }

  public transform(value: any, pattern: string = defaultDateFormat): Observable<string> {

    if (!value || value && !moment(value).isValid()) {
      return;
    }

    return new Observable<string>(observer => {

      observer.next(this.getDatePipe().transform(value, pattern));

      this.translateService.onLangChange.subscribe((langChangeEvent: LangChangeEvent) => {
        observer.next(this.getDatePipe(langChangeEvent.lang).transform(value, pattern));
      });
    });
  }

  private getDatePipe(_?: string): DatePipe {

    const lang = (window.localStorage && window.localStorage.lang) ?
      window.localStorage.lang : this.translateService.currentLang;

    return new DatePipe(lang || this.translateService.getDefaultLang());
  }

}
