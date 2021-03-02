import { Client, query as q, values } from 'faunadb';

const SIGN_UP = 'signUp';
const SIGN_IN = 'signIn';
const CREATE_POST = 'createPost';
const GET_POSTS = 'getPosts';

export type SignIn = {
  account: {
    ref: values.Ref;
    data: {
      email: string;
    };
  };
  secret: string;
};

export type FPost = {
  ref: values.Ref;
  ts: number;
  data: {
    post: string[];
    account: values.Ref;
  };
};

// function
//    type Check
export function isSignIn(obj: unknown): obj is SignIn {
  return obj != null && typeof (obj as SignIn).secret === 'string';
}

export function isBoolean(obj: unknown): obj is boolean {
  return typeof obj === 'boolean';
}

export function isString(obj: unknown): obj is string {
  return typeof obj === 'string';
}

export function isRef(obj: unknown): obj is values.Ref {
  return obj != null && typeof (obj as values.Ref).id === 'string';
}

export function isFPost(obj: unknown): obj is FPost[] {
  return obj != null && Array.isArray(obj);
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
    throw new TypeError('Received malformed signIn API response');
  }
  return res;
}

export async function faunaCreatePostAction(client: Client, post: string[]) {
  const res: unknown = await client.query(q.Call(q.Function(CREATE_POST), [post]));

  if (!isRef(res)) {
    throw new TypeError('Received malformed createPost API response');
  }

  return res;
}

export async function faunaGetPostsAction(client: Client) {
  const res: unknown = await client.query(q.Call(q.Function(GET_POSTS)));
  if (!isFPost(res)) {
    throw new TypeError(`Received malformed ${GET_POSTS} API response`);
  }

  return res;
}
