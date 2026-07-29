"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { requireFeature } from "@/lib/features-server";
import { FEATURES } from "@/lib/features";
import crypto from "crypto";

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 50);
  const hash = crypto.randomBytes(4).toString("hex");
  return `${base}-${hash}`;
}

export async function toggleShare(conversationId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const planCheck = await requireFeature(FEATURES.SHARE_CHAT);
  if (!planCheck.allowed) return { error: planCheck.error };

  const conv = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });
  if (!conv || conv.userId !== user.userId) return { error: "Not found" };

  if (conv.isShared) {
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { isShared: false, shareSlug: null },
    });
    return { success: true, shared: false };
  }

  const slug = generateSlug(conv.title);
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { isShared: true, shareSlug: slug },
  });

  return { success: true, shared: true, slug };
}

export async function getShareStatus(conversationId: string) {
  const user = await getCurrentUser();
  if (!user) return null;

  const conv = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { isShared: true, shareSlug: true, userId: true },
  });

  if (!conv || conv.userId !== user.userId) return null;
  return { isShared: conv.isShared, shareSlug: conv.shareSlug };
}

export async function getSharedConversation(slug: string) {
  const conv = await prisma.conversation.findUnique({
    where: { shareSlug: slug, isShared: true },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
      user: { select: { firstName: true, lastName: true } },
    },
  });

  if (!conv) return null;

  return {
    id: conv.id,
    title: conv.title,
    author: `${conv.user.firstName} ${conv.user.lastName}`,
    messages: conv.messages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      createdAt: m.createdAt.toISOString(),
    })),
    createdAt: conv.createdAt.toISOString(),
  };
}
