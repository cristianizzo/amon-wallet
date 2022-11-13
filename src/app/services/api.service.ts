import { EnvService } from '@services/config.service';
import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EnvModel } from '@app/models';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '@env/environment';

@Injectable()
export class APIService {
  public global: EnvModel;

  constructor(@Inject(EnvService) private config, private http: HttpClient) {
    if (!this.config) {
      throwError('Missing Env Variables');
    }

    this.global = this.config;
  }

  public get(type: string, path: string): Observable<any> {
    return this.http
      .get(`${this.getUri(type)}${path}`)
      .pipe(catchError(this.handleError));
  }

  public put(type: string, path: string, body: object = {}): Observable<any> {
    return this.http
      .put(`${this.getUri(type)}${path}`, body)
      .pipe(catchError(this.handleError));
  }

  public post(type: string, path: string, body: object = {}): Observable<any> {
    return this.http
      .post(`${this.getUri(type)}${path}`, body)
      .pipe(catchError(this.handleError));
  }

  public delete(
    type: string,
    path: string,
    body: object = {}
  ): Observable<any> {
    const httpOptions = { body };

    return this.http
      .delete(`${this.getUri(type)}${path}`, httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    const parsedError = error.error;
    return throwError(parsedError);
  }

  private getUri(type: string): string {
    switch (type) {
      case 'coingecko': {
        return environment.coinGeckoUri;
      }
    }
  }
}
