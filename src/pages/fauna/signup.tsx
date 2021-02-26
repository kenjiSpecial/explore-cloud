import React, { FunctionComponent } from 'react';
import { SignInAndUp } from '@components/ui-common/sign-in-and-up';
import { faunaSignUpAction } from '@utils/fauna-action';

const SignUp: FunctionComponent = () => (
  <SignInAndUp
    titleText="Sign up to your account"
    buttonName="Sign Up"
    signAction={faunaSignUpAction}
    isModal
  />
);

export default SignUp;
