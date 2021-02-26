/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/comma-dangle */

import * as dotenv from 'dotenv';
import faunadb, { query as q } from 'faunadb';
import { signin } from './fauna/sign-in';
import { signup } from './fauna/sign-up';

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

const CreateSignUp = CreateOrUpdateFunction({
  name: 'signUp',
  body: q.Query(q.Lambda(['mail', 'password'], signup(q.Var('mail'), q.Var('password')))),
});

const CreateSignIn = CreateOrUpdateFunction({
  name: 'signIn',
  body: q.Query(q.Lambda(['mail', 'password'], signin(q.Var('mail'), q.Var('password')))),
});

async function main() {
  const secret = process.env.NEXT_PUBLIC_FAUNA_SECRET as string;
  const client = new faunadb.Client({ secret });

  console.log('create function');
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

  process.exit();
}

main();
