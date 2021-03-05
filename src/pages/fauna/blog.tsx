import React, {
  FunctionComponent, useEffect, useMemo, useState,
} from 'react';
import { Blog } from '@components/ui-common/blog';
import { SignInAndUp } from '@components/ui-common/sign-in-and-up';
import {
  faunaCreatePostAction,
  faunaGetPostsAction,
  faunaSignInAction,
  FPost,
  isSignIn,
} from '@utils/fauna-action';
import { client as adminClient } from '@utils/init-fauna';
import { Client } from 'faunadb';

function faunaPostToElement(posts: FPost[]) {
  const postEl = posts.reverse().map((post) => {
    const postTextEl = post.data.post.map((val) => <p key={`${val.id}`}>{val.text}</p>);
    const ts = new Date(Math.floor(post.ts / 1000));
    const date = `${ts.getFullYear()}.${
      ts.getMonth() + 1
    }.${ts.getDate()} ${ts.getHours()}:${ts.getMinutes()}`;

    return (
      <li className="my-4" key={post.ref.id}>
        <div className="text-xs">{date}</div>
        <div className="text-base">{postTextEl}</div>
      </li>
    );
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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (client) {
      faunaGetPostsAction(client).then((val) => setPosts(val));
    }
  }, [client]);

  function postFunc(post: { id: string; text: string }[]) {
    if (!client) {
      return new Promise((resolve) => {
        resolve(123);
      });
    }
    const res = faunaCreatePostAction(client, post);
    return res;
  }

  function callback(res: FPost) {
    setPosts([...posts, res]);
  }

  const clickHandler = () => {
    faunaSignInAction(adminClient, username, password)
      .then((val) => {
        if (isSignIn(val)) {
          setIsError(false);
          setIsLogin(true);
          setClient(new Client({ secret: val.secret }));
        } else {
          setIsError(true);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <>
      {isLogin && <Blog postsEl={postsEl} postFunc={postFunc} callback={callback} />}
      {!isLogin && (
        <SignInAndUp
          titleText="Sign in to your account"
          buttonName="Sign In"
          isError={isError}
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          clickHandler={clickHandler}
        />
      )}
    </>
  );
};

export default SignIn;
