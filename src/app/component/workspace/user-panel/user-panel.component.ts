import { getUserDataSets } from './../../../reducer/user.reducer';
import { DataService } from './../../../service/data.service';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { API, Auth } from 'aws-amplify';
import { PanelEnum, UserPanelFormEnum } from '../../../model/enum.model';
import { S3, CognitoIdentityCredentials } from 'aws-sdk';

@Component({
  selector: 'app-workspace-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class UserPanelComponent {
  // Public variables that can be referenced in the template
  public datasets: Array<any>;
  public user: any;
  public activeForm = UserPanelFormEnum.BLANK.toString();
  public errorMessage = '';
  public formGroupSignUp: FormGroup;
  public formGroupSignUpConfirm: FormGroup;
  public formGroupSignIn: FormGroup;
  public formGroupSignInConfirm: FormGroup;
  public formGroupResendCode: FormGroup;
  public formGroupForgotPassword: FormGroup;
  public formGroupUpdatePassword: FormGroup;
  public token: string;

  @Output()
  showPanel = new EventEmitter<PanelEnum>();

  @Output()
  loadPrivate = new EventEmitter<{ bucket: string; token: string }>();

  // Call this method to change the form
  setForm(form: UserPanelFormEnum): void {
    this.activeForm = form.toString();
    this.cd.detectChanges();
  }

  addDataSet(): void {
    this.showPanel.emit(PanelEnum.UPLOAD);
  }

  resendCode(): void {
    const form = this.formGroupResendCode;
    if (form.status === 'INVALID') {
      return;
    }
    Auth.resendSignUp(form.get('email').value).then(user => {
      this.setForm(UserPanelFormEnum.SIGN_UP_CONFIRM);
      this.cd.detectChanges();
    });
  }

  signIn(): void {
    const form = this.formGroupSignIn;
    if (form.status === 'INVALID') {
      return;
    }

    Auth.signIn(form.get('email').value, form.get('password').value)
      .then(user => {
        this.user = user;
        const a = Auth.currentSession().then(v => {
          this.fetchDatasets(v.getIdToken().getJwtToken());
          this.setForm(UserPanelFormEnum.PROJECT_LIST);

          const auth = Auth;
          const s3 = S3;

          const c = new s3();
          c.config.update({
            credentials: new CognitoIdentityCredentials(
              {
                IdentityPoolId: 'us-west-2:109beda4-7960-4451-8697-bbbbfb0278ea',
                Logins: {
                  'cognito-idp.us-west-2.amazonaws.com/us-west-2_09KsqtrrT': v.getIdToken().getJwtToken()
                }
              },
              { region: 'us-west-2' }
            )
          });
          c.config.credentials['get'](v => {
            // debugger;
          });

          // debugger;
          // const params = {
          //   Bucket: 'oncoquery',
          //   Key: 'test.parquet',
          //   ExpressionType: 'SQL',
          //   Expression: 'SELECT * FROM S3Object LIMIT 5',
          //   InputSerialization: {
          //     CSV: {
          //       FileHeaderInfo: 'USE',
          //       RecordDelimiter: '\n',
          //       FieldDelimiter: ','
          //     }
          //   },
          //   OutputSerialization: {
          //     CSV: {}
          //   }
          // };

          // c.selectObjectContent(params, (err, data) => {
          //   // debugger;
          //   if (err) {
          //     console.log(err.name);
          //     return;
          //   }
          //   const events = data.Payload;
          //   console.log(events);
          // });
        });
      })
      .catch(err => {
        // alert(err.message);
        this.errorMessage = err.message;
        this.cd.detectChanges();
      });
  }

  signUp(): void {
    const form = this.formGroupSignUp;
    if (form.status === 'INVALID') {
      return;
    }
    Auth.signUp({
      username: form.get('email').value,
      password: form.get('password').value,
      attributes: {
        'custom:mailinglist': form.get('mailinglist').value.toString(),
        'custom:firstname': form.get('firstName').value,
        'custom:lastname': form.get('lastName').value
      }
    })
      .then(user => {
        this.setForm(UserPanelFormEnum.SIGN_UP_CONFIRM);
        this.cd.detectChanges();
      })
      .catch(err => {
        // alert(err.message);
        this.errorMessage = err.message;
        this.cd.detectChanges();
      });
  }
  signUpConfirm(): void {
    const form = this.formGroupSignUpConfirm;
    if (form.status === 'INVALID') {
      return;
    }
    Auth.confirmSignUp(form.get('email').value, form.get('code').value)
      .then(data => {
        this.activeForm = UserPanelFormEnum.PROJECT_LIST;
        this.cd.detectChanges();
      })
      .catch(err => {
        // alert(err.message);
        this.errorMessage = err.message;
        this.cd.detectChanges();
      });
  }

  forgotPassword(): void {
    const form = this.formGroupForgotPassword;
    if (form.status === 'INVALID') {
      return;
    }
    Auth.forgotPassword(form.get('email').value)
      .then(data => {
        // alert('Password sent');
        // const user = { username: form.get('email').value };
        this.setForm(UserPanelFormEnum.UPDATE_PASSWORD);
        this.cd.detectChanges();
      })
      .catch(err => {
        const errMsg = err.message.replace('Username', 'Email').replace('username', 'email');
        // alert(errMsg);
        this.errorMessage = errMsg;
        this.cd.detectChanges();
      });
  }

  updatePassword(): void {
    const form = this.formGroupUpdatePassword;
    Auth.forgotPasswordSubmit(form.get('email').value, form.get('code').value, form.get('password').value)
      .then(data => {
        this.setForm(UserPanelFormEnum.SIGN_IN);
      })
      .catch(err => {
        this.errorMessage = err.message;
        this.cd.detectChanges();
      });
  }


  loadDataset(option): void {
    const bucket = option.project.split('|')[0];
    const token = this.token;
    this.loadPrivate.emit({ bucket: 'zbd' + bucket, token: token });
  }

  fetchDatasets(token): void {
    this.dataService.getUserDatasets(token).then(v => {
      console.dir(v);
      this.token = v.token;
      this.datasets = v.datasets.datasets;
      this.cd.detectChanges();
    });
  }

  constructor(public fb: FormBuilder, public cd: ChangeDetectorRef, public dataService: DataService) {
    // Initialize All Forms
    this.formGroupSignIn = fb.group({
      email: [null, Validators.compose([Validators.required, Validators.email])],
      password: [
        null,
        Validators.compose([
          Validators.required
          // Validators.minLength(8)
          // Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
        ])
      ]
    });


    this.formGroupSignUp = fb.group({
      password: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}')
        ])
      ],

      email: [null, Validators.compose([Validators.required, Validators.email])],
      mailinglist: [null],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required]
    });

    this.formGroupSignUpConfirm = fb.group({
      email: [null, Validators.compose([Validators.required, Validators.email])],
      code: [null, Validators.required]
    });

    this.formGroupResendCode = fb.group({
      email: [null, Validators.compose([Validators.required, Validators.email])]
    });

    this.formGroupForgotPassword = fb.group({
      email: [null, Validators.compose([Validators.required, Validators.email])]
    });

    // Passwords Shold all be
    /*
    *** Create Custom Validator
    Minimum length - 8
    Require numbers
    Require special character
    Require uppercase letters
    Require lowercase letters
    SOLUTION FROM https://stackoverflow.com/questions/48350506/how-to-validate-password-strength-with-angular-5-validator-pattern
    */
    this.formGroupUpdatePassword = fb.group({
      email: [null, Validators.compose([Validators.required, Validators.email])],
      code: [null, Validators.required],
      password: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}')
        ])
      ]
    });

    // Set The Active Form To Sign In
    this.activeForm = UserPanelFormEnum.SIGN_IN;
  }
}
