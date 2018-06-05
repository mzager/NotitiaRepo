import { INSERT_ANNOTATION } from './../../../action/graph.action';
import { StatsInterface } from './../../../model/stats.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GraphConfig } from './../../../model/graph-config.model';
import {
  Component, ComponentFactoryResolver, Input, Output, ViewContainerRef,
  ChangeDetectionStrategy, EventEmitter, AfterViewInit, ElementRef, ViewChild, ViewEncapsulation, ChangeDetectorRef
} from '@angular/core';
import { UserPanelFormEnum, PanelEnum } from '../../../model/enum.model';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-workspace-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class UserPanelComponent {

  user: any;
  activeForm: UserPanelFormEnum = UserPanelFormEnum.BLANK;
  errorMessage = '';
  formGroupSignUp: FormGroup;
  formGroupSignUpConfirm: FormGroup;
  formGroupSignIn: FormGroup;
  formGroupSignInConfirm: FormGroup;
  formGroupForgotPassword: FormGroup;
  formGroupUpdatePassword: FormGroup;

  @Output() showPanel = new EventEmitter<PanelEnum>();

  addDataSet(): void {
    this.showPanel.emit(PanelEnum.UPLOAD);
  }
  setForm(form: UserPanelFormEnum): void {
    this.activeForm = form;
    this.cd.detectChanges();
  }
  signIn(): void {
    const form = this.formGroupSignIn;
    if (form.status === 'INVALID') { return; }

    Auth.signIn(form.get('username').value, form.get('password').value)
      .then(user => {
        this.user = user;
        if (user.challengeName === 'SMS_MFA' || user.challengeName === 'SOFTWARE_TOKEN_MFA') {
          // this.amplifyService.setAuthState({ state: 'confirmSignIn', user: user });
        } else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
          // this.amplifyService.setAuthState({ state: 'requireNewPassword', user: user });
        } else {
          // this.amplifyService.setAuthState({ state: 'signedIn', user: user });
          this.setForm(UserPanelFormEnum.PROJECT_LIST);
        }
      }).catch(err => {
        this.errorMessage = err.message;
        this.cd.detectChanges();
      });
  }
  signInConfirm(): void {
    // const form = this.formGroupSignInConfirm;
    // const mfaType = this.user === 'SOFTWARE_TOKEN_MFA' ? 'SOFTWARE_TOKEN_MFA' : null;
    // this.amplifyService.auth()
    //   .confirmSignIn(
    //     this.user,
    //     form.get('code').value,
    //     mfaType
    //   )
    //   .then(() => {
    //     this.amplifyService.setAuthState({ state: 'signedIn', user: this.user });
    //   }).catch(err => {
    //     this.errorMessage = err.messsage;
    //     this.cd.detectChanges();
    //   });
  }
  signUp(): void {
    const form = this.formGroupSignUp;
    if (form.status === 'INVALID') { return; }
    Auth.signUp({
      username: form.get('username').value,
      password: form.get('password').value,
      attributes: {
        email: form.get('email').value,
        phone_number: form.get('phone').value, // +12069481992
        given_name: form.get('firstName').value,
        family_name: form.get('lastName').value
      }
    }).then(user => {
      this.setForm(UserPanelFormEnum.SIGN_UP_CONFIRM);
      this.cd.detectChanges();
    }).catch(err => {
      this.errorMessage = err.message;
      this.cd.detectChanges();
    });
  }
  signUpConfirm(): void {
    const form = this.formGroupSignUpConfirm;
    if (form.status === 'INVALID') { return; }
    Auth.confirmSignUp(form.get('username').value, form.get('code').value)
      .then(data => {
        this.activeForm = UserPanelFormEnum.PROJECT_LIST;
        this.cd.detectChanges();
      })
      .catch(err => {
        this.errorMessage = err.message;
        this.cd.detectChanges();
      });
  }


  forgotPassword(): void {
    const form = this.formGroupForgotPassword;
    if (form.status === 'INVALID') { return; }
    Auth.forgotPasswordSubmit(form.get('username').value, form.get('code').value, form.get('password').value)
      .then(data => {
        alert('Password sent');
        const user = { username: form.get('username').value };
        this.setForm(UserPanelFormEnum.SIGN_IN);
        this.cd.detectChanges();
      })
      .catch(err => {
        this.errorMessage = err.message;
        this.cd.detectChanges();
      });
  }

  updatePassword(): void {
    // const form = this.formGroupForgotPassword;
    // if (form.status === 'INVALID') { return; }
    // Auth.completeNewPassword(this.user, form.get('password').value, this.user.challengeParam)
    //   .then(() => {
    //     this.amplifyService.setAuthState({ state: 'signIn', user: this.user });
    //   })
    //   .catch(err => {
    //     this.errorMessage = err.message;
    //     this.cd.detectChanges();
    //   });
  }

  constructor(public fb: FormBuilder, public cd: ChangeDetectorRef) {

    this.formGroupSignIn = fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
    });
    this.formGroupSignInConfirm = fb.group({
      username: [null, Validators.required],
      code: [null, Validators.required]
    });
    // Validators.compose([Validators.required, Validators.pattern(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)])],
    this.formGroupSignUp = fb.group({
      username: [null, Validators.compose([Validators.required, Validators.minLength(5)])],
      password: [null, Validators.compose([Validators.required, Validators.minLength(8)])],
      email: [null, Validators.compose([Validators.required, Validators.email])],
      phone: [null, Validators.compose([Validators.required, Validators.pattern(
        // tslint:disable-next-line:max-line-length
        /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/
      )])],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required]
    });
    this.formGroupSignUpConfirm = fb.group({
      username: [null, Validators.required],
      code: [null, Validators.required]
    });
    this.formGroupForgotPassword = fb.group({
      username: [null, Validators.required]
    });
    this.formGroupUpdatePassword = fb.group({
      password: [null, Validators.compose([Validators.required, Validators.minLength(8)])]
    });

    // Check If User Is Logged In

    // this.amplifyService.authStateChange$
    //   .subscribe(state => {
    //     console.log(state);
    //     this.activeForm =
    //       (state.state === 'signIn') ? UserPanelFormEnum.SIGN_IN :
    //         (state.state === 'requireNewPassword') ? UserPanelFormEnum.CHANGE_PASSWORD :
    //           (state.state === 'signedIn') ? UserPanelFormEnum.PROJECT_LIST :
    //             (state.state === 'confirmSignUp') ? UserPanelFormEnum.SIGN_UP_CONFIRM :
    //               (state.state === 'confirmSignIn') ? UserPanelFormEnum.SIGN_IN_CONFIRM :
    //                 UserPanelFormEnum.BLANK;
    //     if (this.activeForm === UserPanelFormEnum.BLANK) {

    //     }
    //     this.user = state.user;
    //     this.cd.detectChanges();
    //   });

    this.activeForm = UserPanelFormEnum.SIGN_IN;
  }
}
