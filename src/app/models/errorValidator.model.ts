export class ErrorValidatorModel {
  validatorValue: {
    requiredPattern?: string;
    requiredLength?: number;
  };
  validatorName?: string;
  validatorField?: string;
}
