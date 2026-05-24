import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  callbacks: {
    // 只允许你的 GitHub 账号登录
    async signIn({ user }) {
      // 替换成你的 GitHub 用户 ID 或邮箱
      const allowedUsers = ["fengziclassmate"]
      return allowedUsers.includes(user.name ?? "")
    },
  },
  pages: {
    signIn: "/behind",
  },
})
