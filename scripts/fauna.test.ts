import * as dotenv from 'dotenv';
import faunadb, { query as q } from 'faunadb';
import { faunaSignInAction, faunaSignUpAction } from '../src/utils/fauna-action';

dotenv.config({ path: '.env.local' });

let client: faunadb.Client;
const refArr: faunadb.values.Ref[] = [];

beforeAll(async () => {
  const secret = process.env.NEXT_PUBLIC_FAUNA_SECRET as string;
  client = new faunadb.Client({ secret });

  // make test user
  const { ref } = (await faunaSignUpAction(client, 'hoge@hoge.hoge', 'foofoo')) as {
    ref: faunadb.values.Ref;
    data: {
      email: string;
    };
  };
  refArr.push(ref);
});

// only onetime
it('signup user', async () => {
  const { ref, data } = (await faunaSignUpAction(client, 'k.saito.1985@gmail.com', 'kpass')) as {
    ref: faunadb.values.Ref;
    data: {
      email: string;
    };
  };
  refArr.push(ref);

  expect(data.email).toBe('k.saito.1985@gmail.com');
});

it('signin user', async () => {
  const resA = (await faunaSignInAction(client, 'hoge@hoge.hoge', 'foofoo'));
  if (typeof resA !== 'boolean') {
    expect(typeof resA.secret).toBe('string');
  }

  const resB = (await faunaSignInAction(client, 'hogehoge@hoge.hoge', 'foofoo'));
  expect(typeof resB).toBe('boolean');
});

afterAll(async () => {
  // delete all
  refArr.forEach((ref) => {
    client.query(q.Delete(ref));
  });
});
