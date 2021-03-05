import React, { FunctionComponent } from 'react';
import { Main } from '@components/main';
import { Meta } from '@layout/meta';
import Link from 'next/link';

const ListEl: FunctionComponent<{ name: string; urlBase: string; url: string }> = (props: {
  url: string;
  name: string;
  urlBase: string;
}) => (
  <div className="flex-1">
    <h1>
      <a href={props.url}>{props.name}</a>
    </h1>
    <ul>
      <li>
        <Link href={`/${props.urlBase}/signup`}>SignUp</Link>
      </li>
      <li>
        <Link href={`/${props.urlBase}/blog`}>blog</Link>
      </li>
    </ul>
  </div>
);

const Index: FunctionComponent = () => (
  <Main
    meta={(
      <Meta
        title="Next.js Boilerplate Presentation"
        description="Next js Boilerplate is the perfect starer code for your project. Build your React application with Next.js framework."
      />
    )}
  >
    <div className="relative flex flex-row py-4 bg-white overflow-hidden">
      {/* product */}
      <ListEl name="FaunaDB" url="https://fauna.com" urlBase="fauna" />
      <ListEl name="Supabase" url="https://supabase.io" urlBase="supabase" />
    </div>
  </Main>
);

export default Index;
