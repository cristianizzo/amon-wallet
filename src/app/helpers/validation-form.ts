import { Component, Injectable, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { ErrorService } from '@services/error.service';
import { UtilsHelper } from '@helpers/utils';
import * as web3 from 'ethers';

@Injectable()
@Component({
  selector: 'app-form-validation',
  template: ` <div class="animated fadeIn" *ngIf="getErrorMessage() !== null">
    {{ getErrorMessage() }}
  </div>`,
})

// eslint-disable-next-line @angular-eslint/component-class-suffix
export class FormValidationHelper {
  @Input() control: AbstractControl;
  @Input() field: string;

  constructor(
    private utilsHelper: UtilsHelper,
    private errorService: ErrorService,
  ) {}

  /**
   * mnemonic function
   */
  public mnemonic(ac: FormControl): { [key: string]: boolean } | null {
    if (this.utilsHelper.stringHasValue(ac.value)) {
      const words = ac.value.match(/\b(\w+)\b/g);

      if (words && words.length >= 12) {
        return null;
      }

      return { seedPhrase: true };
    }

    return null;
  }

  public privateKey(ac: FormControl): { [key: string]: boolean} | boolean {
      try {
        new web3.Wallet(ac.value);
        return null;
      }
      catch (e) {
        return { privateKey: true };
      }
  }


  /**
   * MatchPassword function
   */
  public matchPassword(ac: FormControl): { [key: string]: boolean } | null {
    if (ac.parent && ac.parent.controls) {
      const controls: any = ac.parent.controls;
      const oldPassword = controls.oldPassword && controls.oldPassword.value;
      const newPassword = controls.newPassword.value;
      const confirmPassword = ac.value;

      if (oldPassword && oldPassword === newPassword) {
        return { newPasswordDifferentFromOld: true };
      } else if (newPassword !== confirmPassword) {
        return { doesMatchPassword: true };
      }
      return null;
    }
  }

  /**
   * getErrorMessage function
   */
  getErrorMessage() {
    if (this.control && this.control.errors && this.control.value) {
      for (const propertyName in this.control.errors) {
        if (
          this.control.errors.hasOwnProperty(propertyName) &&
          this.control.touched
        ) {
          return this.errorService.getErrorForm({
            validatorName: propertyName,
            validatorValue: this.control.errors[propertyName],
            validatorField: this.field,
          });
        }
      }
    }
    return null;
  }
}
