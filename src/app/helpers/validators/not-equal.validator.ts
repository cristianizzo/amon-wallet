import { Directive, Input } from '@angular/core';
import {
  FormGroup,
  NG_VALIDATORS,
  Validator,
  ValidatorFn,
} from '@angular/forms';

export const notEqual =
  (firstControlName: string, secondControlName: string): ValidatorFn =>
  (formGroup: FormGroup): { [key: string]: any } | null => {
    const firstControl = formGroup.controls[firstControlName];
    const secondControl = formGroup.controls[secondControlName];

    if (firstControl && secondControl) {
      return firstControl.value === secondControl.value
        ? { equal: true }
        : null;
    }

    return null;
  };

/*
 * apply in template <form matchControls="firstControlName,secondControlName">
 * listen for match error <div *ngIf="formGroupName.errors?.match">
 * */
@Directive({
  selector: '[appNotEqual]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: NotEqualValidator, multi: true },
  ],
})
export class NotEqualValidator implements Validator {
  @Input() matchControls: string;

  constructor() {}

  validate(control: FormGroup): { [key: string]: any } | null {
    const controlsArray = this.matchControls.split(',');
    return this.matchControls
      ? notEqual(controlsArray[0], controlsArray[1])(control)
      : null;
  }
}
