export const runtime = "nodejs"

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import WriteEditor from "./editor";

export default async function WritePage() {
  const session = await getSession();

  if (!session) {
    redirect("/behind");
  }

  return <WriteEditor />;
}
