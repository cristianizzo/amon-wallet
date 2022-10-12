import { Directive, Input } from '@angular/core';
import { FormGroup, NG_VALIDATORS, Validator, ValidatorFn } from '@angular/forms';

export const matchValues = (firstControlName: string, secondControlName: string): ValidatorFn =>
  (formGroup: FormGroup): { [key: string]: any } | null => {

    const firstControl = formGroup.controls[firstControlName];
    const secondControl = formGroup.controls[secondControlName];

    if (firstControl && secondControl) {
      return firstControl.value === secondControl.value ? null : {match: true};
    }

    return null;
  };

/*
* apply in template <form matchControls="firstControlName,secondControlName">
* listen for match error <div *ngIf="formGroupName.errors?.match">
* */
@Directive({
  selector: '[appMatchControls]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: MatchFormControlsDirective, multi: true}
  ]
})
export class MatchFormControlsDirective implements Validator {
  @Input() matchControls: string;

  constructor() {
  }

  validate(control: FormGroup): { [key: string]: any } | null {

    const controlsArray = this.matchControls.split(',');
    return this.matchControls ? matchValues(controlsArray[0], controlsArray[1])(control) : null;
  }

}
