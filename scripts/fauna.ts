/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/comma-dangle */

import * as dotenv from 'dotenv';
import faunadb, { query as q } from 'faunadb';
import { createPost } from './fauna/functions/create-post';
import { getPosts } from './fauna/functions/get-posts';
import { signin } from './fauna/functions/sign-in';
import { signup } from './fauna/functions/sign-up';

dotenv.config({ path: '.env.local' });

function CreateOrUpdateFunction(obj: {
  name: string;
  body: faunadb.Expr;
  role?: faunadb.values.Ref | faunadb.Expr;
}) {
  return q.If(
    q.Exists(q.Function(obj.name)),
    q.Update(q.Function(obj.name), { body: obj.body, role: obj.role }),
    q.CreateFunction({ name: obj.name, body: obj.body, role: obj.role })
  );
}

function CreateOrUpdateRole(obj: any) {
  return q.If(
    q.Exists(q.Role(obj.name)),
    q.Update(q.Role(obj.name), { membership: obj.membership, privileges: obj.privileges }),
    q.CreateRole(obj)
  );
}

const CreateSignUp = CreateOrUpdateFunction({
  name: 'signUp',
  body: q.Query(q.Lambda(['mail', 'password'], signup(q.Var('mail'), q.Var('password')))),
});

const CreateSignIn = CreateOrUpdateFunction({
  name: 'signIn',
  body: q.Query(q.Lambda(['mail', 'password'], signin(q.Var('mail'), q.Var('password')))),
});

const CreatePost = CreateOrUpdateFunction({
  name: 'createPost',
  body: q.Query(q.Lambda(['post'], createPost(q.Var('post')))),
});

const GetPosts = CreateOrUpdateFunction({
  name: 'getPosts',
  body: q.Query(q.Lambda([], getPosts())),
});

const CreateLoggedInRole = CreateOrUpdateRole({
  name: 'logged_in_role',
  membership: [{ resource: q.Collection('accounts') }],
  privileges: [
    {
      resource: q.Function('createPost'),
      actions: {
        call: true,
      },
    },
    {
      resource: q.Function('getPosts'),
      actions: {
        call: true,
      },
    },
    {
      resource: q.Index('posts_by_account'),
      actions: {
        read: true,
      },
    },
    {
      resource: q.Collection('posts'),
      actions: { read: true, write: true, create: true },
    },
  ],
});

async function main() {
  const secret = process.env.NEXT_PUBLIC_FAUNA_SECRET as string;
  const client = new faunadb.Client({ secret });

  console.log('create or update function');
  console.log('signup:start');
  await client.query(CreateSignUp).catch((e) => {
    console.error(e);
  });
  console.log('signup:end');

  console.log('signin:start');
  await client.query(CreateSignIn).catch((e) => {
    console.log(e);
  });
  console.log('signin:end');

  console.log('createPost:start');
  await client.query(CreatePost).catch((e) => {
    console.log(e);
  });
  console.log('createPost:end');

  console.log('getPosts:start');
  await client.query(GetPosts).catch((e) => {
    console.log(e);
  });
  console.log('getPosts:end');

  console.log('create or update role');
  await client.query(CreateLoggedInRole).catch((e) => {
    console.error(e);
  });

  process.exit();
}

main();
