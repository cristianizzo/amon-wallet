import { environment } from '@env/environment';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsHelper } from '@app/helpers/utils';
import { NavController } from '@ionic/angular';
import { matchValues } from '@helpers/validators/match.validator';
import { WalletModel } from '@app/models';
import { Router } from '@angular/router';
import { TempStorageService } from '@services/index.module';

@Component({
  selector: 'app-pick-password',
  templateUrl: 'pickPassword.component.html',
  styleUrls: ['pickPassword.component.scss'],
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
    private tempStorageService: TempStorageService,
  ) {
    this.initForm();
    this.step = 1;
  }

  ionViewDidLeave(): void {
    this.formObj.reset();
  }

  /**
   * submit function
   */
  public async submit() {
    const rawForm = this.formObj.getRawValue();
    this.tempStorageService.data = {
      secret: rawForm.password,
      walletName: environment.defaultWalletName
    };
    await this.router.navigate(['/seed-phrase']);
  }

  /**
   * Go to step function
   */
  public goToStep(step: number) {
    this.step = step;
  }

  /**
   * Disable submit button function
   */
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
