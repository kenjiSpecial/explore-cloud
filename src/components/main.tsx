import React, { ReactNode } from 'react';
import { AboutIcon } from '@components/icons/about';
import HomeSvg from '@components/icons/home.svg';
import { Config } from '@utils/Config';
import Link from 'next/link';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => (
  <div className="antialiased w-full text-gray-700">
    {props.meta}

    <div className="max-w-screen-md mx-auto">
      <div className="border-b border-gray-300">
        <div className="pt-16 pb-8">
          <div className="font-bold text-3xl text-gray-900">{Config.title}</div>
          <div className="text-xl">{Config.description}</div>
        </div>
        <div>
          <ul className="flex flex-wrap text-xl">
            <li className="mr-6">
              <Link href="/">
                <a className="text-gray-700 border-none hover:text-gray-900">
                  <div className="relative inline-block w-6 h-6 align-middle -top-1 mr-1">
                    <HomeSvg />
                  </div>
                  Home
                </a>
              </Link>
            </li>
            <li className="mr-6">
              <Link href="/about/">
                <a className="text-gray-700 border-none hover:text-gray-900">
                  <div className="relative inline-block w-6 h-6 align-middle -top-1">
                    <AboutIcon />
                  </div>
                  {' '}
                  About
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="py-5 text-xl content">{props.children}</div>

      <div className="border-t border-gray-300 text-center py-8 text-sm" />
    </div>
  </div>
);

export { Main };
