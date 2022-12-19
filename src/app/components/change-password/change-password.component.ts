import { Component, ViewChild } from '@angular/core';
import {
  AlertController,
  IonBackButtonDelegate,
  ModalController,
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
import { LanguageProxy } from '@services/proxy/languages.proxy';

const logContent = (data) =>
  Object.assign({ service: 'app:setting:change-password' }, data);

@Component({
  selector: 'app-setting-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
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
    private languageProxy: LanguageProxy,
    public utilsHelper: UtilsHelper,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    public toastService: ToastService,
    private alertController: AlertController
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

  /**
   * changePassword function
   */
  public async changePassword() {}

  public submit() {}

  /**
   * alertEnabled function
   */
  public async alert() {
    const alert = await this.alertController.create({
      mode: 'md',
      header: this.languageProxy.getTranslate('ALERT.header.success'),
      message: this.languageProxy.getTranslate('ALERT.message.updatePassword'),
      buttons: [
        {
          text: this.languageProxy.getTranslate('BUTTON.return'),
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
  public async continue() {
    await this.modalCtrl.dismiss();
  }

  private initForm() {
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
}
