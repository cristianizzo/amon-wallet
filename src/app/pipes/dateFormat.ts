import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import moment from '@helpers/moment';

@Pipe({
  name: 'dateFormatPipe',
})

export class DateFormatPipe implements PipeTransform {
  constructor(private translateService: TranslateService) {
  }

  public transform(value: string, mini: boolean = false) {

    const newValue = moment(value).valueOf();

    const dif = Math.floor(((Date.now() - newValue) / 1000) / 86400);

    if (dif <= 1) { // use (dif < 30) days to allow days/weeks
      return this.convertToNiceDate(value);
    } else {
      const datePipe = new DatePipe(this.translateService.currentLang || this.translateService.getDefaultLang());

      if (mini) {
        value = datePipe.transform(value, 'dd MMM yyyy');

      } else {
        value = datePipe.transform(value, 'HH:mm - E, dd MMM yyyy');
      }

      return value;
    }
  }

  private convertToNiceDate(time: string) {

    const date = new Date(time);
    const diff = (((new Date()).getTime() - date.getTime()) / 1000);
    const dayDiff = Math.floor(diff / 86400);

    if (isNaN(dayDiff) || dayDiff < 0 || dayDiff >= 31) {
      return '';
    }

    return dayDiff === 0 && (
        diff < 60 && 'Just now' ||
        diff < 120 && '1 min ago' ||
        diff < 3600 && Math.floor(diff / 60) + ' min ago' ||
        diff < 7200 && '1 hour ago' ||
        diff < 86400 && Math.floor(diff / 3600) + ' hours ago') ||
      dayDiff === 1 && 'Yesterday' ||
      dayDiff < 7 && dayDiff + ' days ago' || // disabled
      dayDiff < 31 && Math.ceil(dayDiff / 7) + ' week(s) ago'; // disabled
  }
}


