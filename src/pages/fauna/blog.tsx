import React, {
  FunctionComponent, useEffect, useMemo, useState,
} from 'react';
import { Blog } from '@components/ui-common/blog';
import { SignInAndUp } from '@components/ui-common/sign-in-and-up';
import {
  faunaGetPostsAction, faunaSignInAction, FPost, isSignIn,
} from '@utils/fauna-action';
import { Client } from 'faunadb';

function faunaPostToElement(posts: FPost[]) {
  const postEl = posts.map((post) => {
    const postTextEl = post.data.post.map((val) => <p>{val}</p>);
    return <li key={post.ref.id}>{postTextEl}</li>;
  });
  return <ul>{postEl}</ul>;
}

// mail: kk.saito.1985@gmail.com
// pass: pass
const SignIn: FunctionComponent = () => {
  const [isError, setIsError] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [client, setClient] = useState<Client>();
  const [posts, setPosts] = useState<FPost[]>([]);
  const postsEl = useMemo(() => faunaPostToElement(posts), [posts]);

  const onCallback = (val: any) => {
    // console.log({ val });
    if (isSignIn(val)) {
      setIsError(false);
      setIsLogin(true);
      setClient(new Client({ secret: val.secret }));
    } else {
      setIsError(true);
    }
  };

  useEffect(() => {
    if (client) {
      faunaGetPostsAction(client).then((val) => setPosts(val));
    }
  }, [client]);

  return (
    <>
      {isLogin && <Blog client={client} postsEl={postsEl} />}
      {!isLogin && (
        <SignInAndUp
          titleText="Sign in to your account"
          buttonName="Sign In"
          signAction={faunaSignInAction}
          isModal={false}
          callback={onCallback}
          isError={isError}
        />
      )}
    </>
  );
};

export default SignIn;
