import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import type { NextAuthConfig } from "next-auth"

// 单独导出配置，方便 middleware 复用
export const authConfig: NextAuthConfig = {
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID ?? "",
      clientSecret: process.env.AUTH_GITHUB_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const allowedUsers = ["fengziclassmate"]
      return allowedUsers.includes(user.name ?? "")
    },
  },
  pages: {
    signIn: "/behind",
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
}

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig)
