import { UtilsHelper } from '@helpers/utils';
import { ErrorModel, ErrorValidatorModel } from '@app/models';
import { Injectable } from '@angular/core';
import { LanguageService } from '@services/languages.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class ErrorService {

  // eslint-disable-next-line @typescript-eslint/naming-convention
  private ERRORS = {
    walletAlreadyExists: 'ERRORS.WALLET_ALREADY_EXISTS',
    failEncrypt: 'ERRORS.FAIL_ENCRYPT',
    failDecrypt: 'ERRORS.FAIL_DECRYPT',
    failVerifyEncryption: 'ERRORS.FAIL_VERIFY_ENCRYPTION',
    wrongPassword: 'ERRORS.WRONG_PASSWORD',
    walletName: 'ERRORS.WALLET_NAME',
    invalidSecret: 'ERRORS.INVALID_SECRET',
    seedPhrase: 'ERRORS.INVALID_SECRET',
    notFound: 'ERRORS.NOT_FOUND',

    wrongAmount: 'ERRORS.wrongAmount',
    wrongDecimals: 'ERRORS.wrongDecimals',
    minAmount: 'ERRORS.minAmount',
    maxAmount: 'ERRORS.maxAmount',
    insufficientBalance: 'ERRORS.insufficientBalance',
    notSupported: 'ERRORS.notSupported',
    unknownError: 'ERRORS.unknownError',
    regexPassword: 'ERRORS.regexPassword',
    regexPasswordStrong: 'ERRORS.regexPasswordStrong',
    regexAmount: 'ERRORS.regexAmount',
    regexString: 'ERRORS.regexString',
    regexNumber: 'ERRORS.regexNumber',
    regexAddress: 'ERRORS.regexAddress',
    regexInvalidPattern: 'ERRORS.regexInvalidPattern',
    doesMatchPassword: 'ERRORS.doesMatchPassword',
    required: 'ERRORS.required',
  };

  constructor(
    private utilsHelper: UtilsHelper,
    public langService: LanguageService
  ) {
  }

  /**
   * Handle Error function
   */
  public handleError(error: HttpErrorResponse): Observable<any> {
    return throwError(error);
  }

  /**
   * Parse Error function
   */
  public parseError(error: ErrorModel | any): any {

    if (error.message && this.ERRORS[error.message]) {
      return this.langService.getTranslate(this.ERRORS[error.message]);
    } else {
      return this.langService.getTranslate('ERRORS.unknownError');
    }
  }

  public matchErrorCode(error: ErrorModel | any, code: string): boolean {

    if (error && !error.code && error.error) {
      error = error.error;
    }

    return error && error.code && error.code === code;

  }

  /**
   * Get Error function
   */
  public getError(errorCode: string, args?: string): any {

    if (args) {
      return `${this.langService.getTranslate(
        (errorCode && this.ERRORS[errorCode] ? this.ERRORS[errorCode] : this.ERRORS.unknownError)
      )} ${args}`;
    }

    return `${this.langService.getTranslate(
      (errorCode && this.ERRORS[errorCode] ? this.ERRORS[errorCode] : this.ERRORS.unknownError)
    )}`;
  }

  /**
   * Get Error Form function
   */
  public getErrorForm(validator: ErrorValidatorModel) {

    // eslint-disable-next-line prefer-const
    let {validatorName, validatorValue, validatorField} = validator;

    if (validatorField && this.utilsHelper.stringHasValue(this.utilsHelper.regex[validatorField])) {
      validatorName = 'pattern';
      validatorValue = {requiredPattern: this.utilsHelper.regex[validatorField]};
    }

    const patternError = (pattern: string) => {
      switch (pattern) {

        case this.utilsHelper.regex.password:
          return this.getError('regexPassword');

        case this.utilsHelper.regex.passwordStrong:
          return this.getError('regexPasswordStrong');

        case this.utilsHelper.regex.amount:
          return this.getError('regexAmount');

        case this.utilsHelper.regex.string:
          return this.getError('regexString');

        case this.utilsHelper.regex.number:
          return this.getError('regexNumber');

        case this.utilsHelper.regex.address:
          return this.getError('regexAddress');

        default:
          return this.getError('regexInvalidPattern');
      }
    };

    const config = {
      newPasswordDifferentFromOld: this.getError('newPasswordDifferentFromOld'),
      doesMatchPassword: this.getError('doesMatchPassword'),
      required: this.getError('required'),
      minlength: (validatorValue) ? 'Must be at least ' + validatorValue.requiredLength + ' characters' : 'too short',
      address: this.getError('regexAddress'),
      insufficientBalance: this.getError('insufficientBalance'),
      minAmount: `${this.getError('minAmount')} ${validatorValue || ''}`,
      maxAmount: `${this.getError('maxAmount')} ${validatorValue || ''}`,
      amount: this.getError('regexAmount'),
      decimals: `${this.getError('wrongDecimals')} ${(validatorValue) ? ` ${validatorValue}` : ''}`,
      empty: '',
      pattern: patternError((validatorValue) ? validatorValue.requiredPattern : null)
    };

    return config[validatorName];

  }
}
