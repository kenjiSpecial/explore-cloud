import faunadb, { query as q } from 'faunadb';

export function createPost(post: faunadb.Expr) {
  return q.Let(
    {
      identity: q.CurrentIdentity(),
      post: q.Create(q.Collection('posts'), {
        data: { post, account: q.Var('identity') },
      }),
    },
    q.Select(['ref'], q.Var('post')),
  );
}
