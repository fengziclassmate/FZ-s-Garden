import { redirect } from "next/navigation";

export default function ResearchRedirect() {
  redirect("/blogs?type=research");
}
