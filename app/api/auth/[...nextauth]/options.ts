import prismadb from "@/lib/prismadb";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"

import { GithubProfile } from 'next-auth/providers/github'
import GitHubProvider from 'next-auth/providers/github'
import * as bcrypt from 'bcrypt';

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const user = await prismadb.user.findFirst({
          where: {
            email: credentials?.username
          }
        })
        if (user != null && credentials?.password != null && await bcrypt.compare(credentials.password, user.password,)) {
          const { password, ...userWithOutPassword } = user;
          return userWithOutPassword;
        } else {
          return null;
        }
      }
    })
  ],
  //refer to next-auth.d.ts file in parent hirecy of this app, here we had to define some next auth interface
  callbacks:{
    //https://authjs.dev/guides/basics/role-based-access-control
    async jwt({ token, user }) {
      if(user) token.role = user.role
      return token
    },
    //session is to use role in client componenets, that is front end use sessions
    // this is needed to add role to suer, jwt and sessions
    async session({ session, token }) {
      if(session?.user) session.user.role = token.role
      return session
    }
  }
}