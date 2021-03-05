import React, {
  FunctionComponent, useEffect, useMemo, useState,
} from 'react';
import { Blog } from '@components/ui-common/blog';
import { SignInAndUp } from '@components/ui-common/sign-in-and-up';
import { User } from '@supabase/supabase-js';
import { supabase } from '@utils/init-supabase';
import { definitions } from 'src/types/supabase';

function faunaPostToElement(posts: definitions['blog'][]) {
  const postEl = posts.reverse().map((postItem) => {
    const postTextEl = postItem.post.map((val) => <p key={`${val.id}`}>{val.text}</p>);
    const ts = new Date(postItem.updated_at);
    const date = `${ts.getFullYear()}.${
      ts.getMonth() + 1
    }.${ts.getDate()} ${ts.getHours()}:${ts.getMinutes()}`;

    return (
      <li className="my-4" key={postItem.id}>
        <div className="text-xs">{date}</div>
        <div className="text-base">{postTextEl}</div>
      </li>
    );
  });
  return <ul>{postEl}</ul>;
}

// mail: kk.saito.1985@gmail.com
// pass: pass
const BlogPage: FunctionComponent = () => {
  const [isError, setIsError] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [posts, setPosts] = useState<definitions['blog'][]>([]);
  const [user, setUser] = useState<User>();
  const postsEl = useMemo(() => faunaPostToElement(posts), [posts]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const fetchBlog = async () => {
    const { data, error } = await supabase.from('blog').select('*');
    // console.log(data);

    if (!error) {
      setPosts(data as definitions['blog'][]);
    } else {
      console.error({ error });
    }
  };

  useEffect(() => {
    if (user) {
      fetchBlog();
    }
  }, [user]);

  function postFunc(post: { id: string; text: string }[]) {
    if (!user) {
      return new Promise((resolve) => {
        resolve(123);
      });
    }

    const p = supabase
      .from('blog')
      .insert({ post, user_id: user.id })
      .single();

    return p;
  }

  function callback(res: { data: definitions['blog'] }) {
    setPosts([...posts, res.data]);
  }

  const clickHandler = () => {
    (async () => {
      const authS = await supabase.auth.signIn({
        email: username,
        password,
      });
      if (authS.user) {
        setIsError(false);
        setIsLogin(true);
        setUser(authS.user);
      } else {
        setIsError(true);
      }
    })();
  };

  return (
    <>
      {isLogin && <Blog postsEl={postsEl} postFunc={postFunc} callback={callback} />}
      {!isLogin && (
        <SignInAndUp
          titleText="Sign in to your account in supabase"
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

export default BlogPage;
