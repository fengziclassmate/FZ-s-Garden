import { redirect } from "next/navigation";

export default function ReadingRedirect() {
  redirect("/blogs?type=reading");
}
