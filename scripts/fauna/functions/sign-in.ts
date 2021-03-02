import faunadb, { query as q } from 'faunadb';

export function signin(email: faunadb.Expr, password: faunadb.Expr) {
  return q.If(
    q.Identify(q.Match(q.Index('users_by_email'), email), password),
    q.Let(
      {
        res: q.Login(q.Match(q.Index('users_by_email'), email), {
          password,
        }),
        account: q.Get(q.Select(['instance'], q.Var('res'))),
        secret: q.Select(['secret'], q.Var('res')),
      },
      { account: q.Var('account'), secret: q.Var('secret') },
    ),
    false,
  );
}
