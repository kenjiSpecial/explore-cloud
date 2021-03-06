import React, { FunctionComponent, useState } from 'react';
import { SignInAndUp } from '@components/ui-common/sign-in-and-up';
import { faunaSignUpAction } from '@utils/fauna-action';
import { client } from '@utils/init-fauna';

const SignUp: FunctionComponent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const clickHandler = () => {
    faunaSignUpAction(client, username, password)
      .then(() => {
        setIsOpen(true);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <SignInAndUp
      titleText="Sign up to your account in FaunaDB"
      buttonName="Sign Up"
      isError={false}
      isOpen={isOpen}
      username={username}
      password={password}
      setUsername={setUsername}
      setPassword={setPassword}
      setIsOpen={setIsOpen}
      clickHandler={clickHandler}
    />
  );
};

export default SignUp;
