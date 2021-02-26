import { Client } from 'faunadb';

export const client = new Client({ secret: process.env.NEXT_PUBLIC_FAUNA_SECRET as string });
