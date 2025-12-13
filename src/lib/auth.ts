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
          let isNewUser = false;

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
              isNewUser = true;
            }
          }

          if (existingUser) {
            user.id = existingUser.id;

            // Assign role to new users
            if (isNewUser) {
              try {
                const userCount = await db.user.count(d1);
                const roleName = userCount === 1 ? "admin" : "user";
                const role = await db.role.findByName(d1, roleName);
                if (role) {
                  await db.userRole.assign(d1, existingUser.id, role.id);
                }
              } catch (roleError) {
                console.warn("Failed to assign role to new user:", roleError);
              }
            }
          }
        } catch (error) {
          // D1 not available in local development, allow sign in without DB operations
          console.warn("D1 database not available, skipping user creation/linking:", error);
        }
      }
      return true;
    },
    async jwt({ token, user, account, trigger }) {
      if (user) {
        token.id = user.id;
      }
      if (account?.provider === "google" && user) {
        token.id = user.id;
      }

      // Load roles and permissions on sign in or session update
      if (trigger === "signIn" || trigger === "update" || !token.roles) {
        try {
          const d1 = getD1();
          const userId = token.id as string;

          // Get user's roles
          const roles = await db.userRole.findByUserId(d1, userId);
          token.roles = roles.map((r) => r.name);

          // Get permissions from roles
          const roleIds = roles.map((r) => r.id);
          const permissions = await db.permission.findByRoleIds(d1, roleIds);
          token.permissions = permissions.map((p) => p.name);
        } catch (error) {
          console.warn("Failed to load roles/permissions:", error);
          token.roles = token.roles || [];
          token.permissions = token.permissions || [];
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.roles = (token.roles as string[]) || [];
        session.user.permissions = (token.permissions as string[]) || [];
      }
      return session;
    },
  },
});
