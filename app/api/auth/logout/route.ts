import { removeSessionCookie } from "@/lib/auth"

export async function POST() {
  await removeSessionCookie()
  return Response.json({ success: true })
}
