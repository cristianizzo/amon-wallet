import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsHelper } from '@app/helpers/utils';
import { NavController } from '@ionic/angular';
import { matchValues } from '@helpers/validators/match.validator';
import { WalletModel } from '@app/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pick-password',
  templateUrl: 'pickPassword.index.html',
  styleUrls: ['pickPassword.style.scss'],
})
export class PickPasswordComponent {

  public step: number;
  public wallet: WalletModel;
  public formObj: FormGroup;
  public regexPasswordValidation: any = this.utilsHelper.regex.password;

  constructor(
    private router: Router,
    public navController: NavController,
    private formBuilder: FormBuilder,
    private utilsHelper: UtilsHelper,
  ) {
    this.initForm();
    this.step = 1;
  }

  async ionViewWillEnter() {
  }

  public async submit() {
    this.router.navigateByUrl('/recovery-phrase');
  }

  /**
   * Go to step function
   */
  public goToStep(step: number) {
    this.step = step;
  }

  public disableSubmitButton(): boolean {

    if (this.step === 1) {
      return this.formObj.controls.password.invalid;
    } else {
      return this.formObj.invalid;
    }
  }

  /**
   * back function
   */
  public async back() {
    if (this.step === 2) {
      this.goToStep(1);
      return;
    }
    this.formObj.reset();
    await this.navController.navigateForward('/welcome');
  }

  /**
   * initForm function
   */
  private initForm() {
    this.formObj = this.formBuilder.group({
      password: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.pattern(this.utilsHelper.regex.password),
        Validators.minLength(8), Validators.maxLength(36)
      ])),
      confirmPassword: new FormControl(null, Validators.compose([
        Validators.required,
      ]))
    }, {
      validators: [matchValues('password', 'confirmPassword')]
    });
  }
}
