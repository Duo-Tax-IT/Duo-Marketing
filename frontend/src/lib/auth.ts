import { NextAuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";

export const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Add access token to the session
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
};

// Extend the NextAuth session type with our custom properties
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface JWT {
    accessToken?: string;
  }
}
