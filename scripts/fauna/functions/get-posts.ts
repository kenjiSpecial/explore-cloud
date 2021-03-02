import { query as q } from 'faunadb';

export function getPosts() {
  return q.Let(
    {
      postRefs: q.Paginate(q.Match(q.Index('posts_by_account'), q.CurrentIdentity())),
      posts: q.Map(q.Select('data', q.Var('postRefs')), q.Lambda('post', q.Get(q.Var('post')))),
    },
    q.Var('posts'),
  );
}
