import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";

export default async function WritePage() {
  let session;
  try {
    session = await auth();
  } catch (e) {
    // auth() 初始化失败时，也显示登录页面
    console.error("Auth error:", e);
    session = null;
  }

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/behind/write");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-[#2d2a24]">写文章</h1>
      <p className="text-[#7a756c]">发布功能即将到来 — 调试中...</p>
      <pre className="mt-4 rounded-lg bg-[#f0ede6] p-4 text-sm text-[#7a756c]">
        {JSON.stringify(session.user, null, 2)}
      </pre>
    </div>
  );
}
