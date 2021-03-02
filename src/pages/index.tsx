import React, { FunctionComponent } from 'react';
import { Main } from '@components/main';
import { Meta } from '@layout/meta';
import Link from 'next/link';

const Index: FunctionComponent = () => (
  <Main
    meta={(
      <Meta
        title="Next.js Boilerplate Presentation"
        description="Next js Boilerplate is the perfect starer code for your project. Build your React application with Next.js framework."
      />
    )}
  >
    <div className="relative py-16 bg-white overflow-hidden">
      <h1>
        <a href="">FaunaDB</a>
      </h1>
      <ul>
        <li>
          <Link href="/fauna/signup">SignUp</Link>
        </li>
        <li>
          <Link href="/fauna/blog">blog</Link>
        </li>
      </ul>
    </div>
  </Main>
);

export default Index;
