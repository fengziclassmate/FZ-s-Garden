export const runtime = "nodejs"

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function WritePage() {
  const session = await getSession();

  if (!session) {
    redirect("/behind");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-[#2d2a24]">写文章</h1>
      <p className="text-[#7a756c]">发布功能即将到来 — 调试中...</p>
      <p className="mt-4 text-sm text-[#7a756c]">
        已登录为: {session.name}
      </p>
    </div>
  );
}
