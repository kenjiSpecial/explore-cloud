import { Client, query as q, values } from 'faunadb';

const SIGN_UP = 'signUp';
const SIGN_IN = 'signIn';

type SignIn =
  {
    account: {
      ref: values.Ref;
      data: {
        email: string;
      };
    };
    secret: string;
  };

// function
//    type Check
function isSignIn(obj: unknown): obj is SignIn {
  return (
    obj != null
     && (typeof (obj as SignIn).secret === 'string')
  );
}

function isBoolean(obj: unknown): obj is boolean {
  return typeof obj === 'boolean';
}

// function
//    action
export async function faunaSignUpAction(client: Client, email: string, password: string) {
  const res = await client.query(q.Call(q.Function(SIGN_UP), [email, password]));

  return res;
}

export async function faunaSignInAction(client: Client, email: string, password: string) {
  const res: unknown = await client.query(q.Call(q.Function(SIGN_IN), [email, password]));

  if (isBoolean(res)) {
    return res;
  }

  if (!isSignIn(res)) {
    throw new TypeError('Received malformed products API response');
  }
  return res;
}
