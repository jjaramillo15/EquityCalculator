import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      const targetUrl = new URL(url, baseUrl);
      const allowedOrigins = new Set([
        new URL(baseUrl).origin,
        "http://127.0.0.1:3000",
        "http://localhost:3000",
      ]);

      if (allowedOrigins.has(targetUrl.origin)) {
        return targetUrl.toString();
      }

      return baseUrl;
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
      }

      return token;
    },
  },
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
      },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string"
            ? credentials.email.trim().toLowerCase()
            : "";

        if (!email) {
          return null;
        }

        const name = email.split("@")[0] || "Player";

        return db.user.upsert({
          where: { email },
          update: { name },
          create: { email, name },
        });
      },
    }),
  ],
});
