import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ModalController,
  NavController,
  IonBackButtonDelegate,
  LoadingController,
  AlertController,
} from '@ionic/angular';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UtilsHelper } from '@helpers/utils';
import { Subscription } from 'rxjs';
import { matchValues } from '@helpers/validators/match.validator';
import { notEqual } from '@helpers/validators/not-equal.validator';
import { ToastService } from '@services/toast.service';
import { LanguageService } from '@services/languages.service';
import { ErrorService } from '@services/error.service';

const logContent = (data) =>
  Object.assign({ service: 'app:setting:change-password' }, data);

@Component({
  selector: 'app-setting-change-password',
  templateUrl: 'change-password.component.html',
  styleUrls: ['change-password.component.scss'],
})
export class ChangePasswordComponent {
  @ViewChild(IonBackButtonDelegate, { static: false })
  backButtonDelegate: IonBackButtonDelegate;
  public subscriptions: Subscription[] = [];
  public formObj: FormGroup;
  public loading: boolean;
  public keyboardOn: boolean;
  public regexPasswordValidation: any = this.utilsHelper.regex.password;

  constructor(
    public errorService: ErrorService,
    public utilsHelper: UtilsHelper,
    public route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public navController: NavController,
    private modalCtrl: ModalController,
    public toastService: ToastService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private langService: LanguageService
  ) {
    this.initForm();
  }

  ionViewWillEnter(): void {
    if (this.backButtonDelegate) {
      this.backButtonDelegate.onClick = () => this.continue();
    }
  }

  ionViewDidLeave(): void {
    this.subscriptions.forEach((subscription: Subscription) =>
      subscription.unsubscribe()
    );
  }

  initForm() {
    // TODO add static values as constants in constants file (like 8 for maxLength)
    this.formObj = this.formBuilder.group(
      {
        oldPassword: new FormControl(
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(36),
          ])
        ),
        newPassword: new FormControl(
          null,
          Validators.compose([
            Validators.required,
            Validators.pattern(this.utilsHelper.regex.password),
            Validators.minLength(8),
            Validators.maxLength(36),
          ])
        ),
        confirmPassword: new FormControl(
          null,
          Validators.compose([Validators.required])
        ),
      },
      {
        validators: [
          matchValues('newPassword', 'confirmPassword'),
          notEqual('oldPassword', 'newPassword'),
        ],
      }
    );
  }

  /**
   * changePassword function
   */
  async changePassword() {}

  /**
   * alertEnabled function
   */
  async alert() {
    const alert = await this.alertController.create({
      mode: 'md',
      header: this.langService.getTranslate('ALERT.header.success'),
      message: this.langService.getTranslate('ALERT.message.updatePassword'),
      buttons: [
        {
          text: this.langService.getTranslate('BUTTON.return'),
          handler: () => {
            this.continue();
            // this.appEvents.sendEvent({action: 'logout', opts: {clear: true}});
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Continue Function
   */
  async continue() {
    await this.modalCtrl.dismiss();
  }
}
