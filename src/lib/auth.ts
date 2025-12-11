import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { getD1, db } from "./d1";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const d1 = getD1();
        const user = await db.user.findByEmail(d1, credentials.email as string);

        if (!user || !user.password) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!passwordMatch) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const d1 = getD1();
          const googleId = account.providerAccountId;

          // Check if user exists by googleId
          let existingUser = await db.user.findByGoogleId(d1, googleId);

          if (!existingUser && user.email) {
            // Check if user exists by email
            existingUser = await db.user.findByEmail(d1, user.email);

            if (existingUser) {
              // Link existing account with Google
              await db.user.updateGoogleId(d1, existingUser.id, {
                googleId,
                image: user.image || undefined,
                name: existingUser.name ? undefined : user.name || undefined,
              });
            } else {
              // Create new user with Google account
              existingUser = await db.user.create(d1, {
                email: user.email,
                name: user.name || undefined,
                image: user.image || undefined,
                googleId,
              });
            }
          }

          if (existingUser) {
            user.id = existingUser.id;
          }
        } catch (error) {
          // D1 not available in local development, allow sign in without DB operations
          console.warn("D1 database not available, skipping user creation/linking:", error);
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      if (account?.provider === "google" && user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
