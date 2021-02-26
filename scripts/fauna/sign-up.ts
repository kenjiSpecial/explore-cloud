import faunadb, { query as q } from 'faunadb';

export function signup(email: faunadb.Expr, password: faunadb.Expr) {
  return q.Create(q.Collection('accounts'), {
    credentials: { password },
    data: {
      email,
    },
  });
}
