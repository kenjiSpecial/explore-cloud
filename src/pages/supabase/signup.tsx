import React, { FunctionComponent, useState } from 'react';
import { SignInAndUp } from '@components/ui-common/sign-in-and-up';
import { supabase } from '@utils/init-supabase';

const SignUp: FunctionComponent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const clickHandler = () => {
    (async () => {
      const { user, error } = await supabase.auth.signUp({
        email: username,
        password,
      });

      if (user) {
        setIsOpen(true);
      } else {
        console.error(error);
      }
    })();
  };

  return (
    <SignInAndUp
      titleText="Sign up to your account in supabase database"
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
