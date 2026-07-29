import { NextRequest } from "next/server";
import env from "@/config/env";
import { verifyAccessToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const OPENROUTER_BASE = "https://openrouter.ai/api/v1";

async function getUserFromRequest(req: NextRequest) {
  const token = req.cookies.get(env.ACCESS_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAccessToken(token);
}

async function checkAndUpdateTokenUsage(
  userId: string,
): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });
  if (!user) return { allowed: false, remaining: 0, limit: 0 };

  const sub = await prisma.subscription.findUnique({
    where: { slug: user.plan },
  });
  if (!sub) return { allowed: false, remaining: 0, limit: 0 };

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let userSub = await prisma.userSubscription.findFirst({
    where: { userId, isActive: true },
    orderBy: { startDate: "desc" },
  });

  if (!userSub) {
    userSub = await prisma.userSubscription.create({
      data: {
        userId,
        subscriptionId: sub.id,
        tokensUsedToday: 0,
        lastResetAt: todayStart,
      },
    });
  }

  const lastReset = new Date(userSub.lastResetAt);
  const needsReset = lastReset < todayStart;

  if (needsReset) {
    await prisma.userSubscription.update({
      where: { id: userSub.id },
      data: { tokensUsedToday: 0, lastResetAt: todayStart },
    });
    userSub.tokensUsedToday = 0;
  }

  const remaining = sub.maxTokensPerDay - userSub.tokensUsedToday;
  if (remaining <= 0) {
    return { allowed: false, remaining: 0, limit: sub.maxTokensPerDay };
  }

  return { allowed: true, remaining, limit: sub.maxTokensPerDay };
}

async function incrementTokenUsage(userId: string, tokens: number) {
  const userSub = await prisma.userSubscription.findFirst({
    where: { userId, isActive: true },
    orderBy: { startDate: "desc" },
  });

  if (userSub) {
    await prisma.userSubscription.update({
      where: { id: userSub.id },
      data: { tokensUsedToday: { increment: tokens } },
    });
  }
}

export async function POST(req: NextRequest) {
  if (!env.MIMO_API_KEY) {
    return Response.json({ error: "API key not configured" }, { status: 500 });
  }

  const user = await getUserFromRequest(req);
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { allowed, remaining, limit } = await checkAndUpdateTokenUsage(
    user.userId,
  );
  if (!allowed) {
    return Response.json(
      {
        error: `Daily token limit reached (${limit.toLocaleString()} tokens/day). Upgrade your plan for more.`,
        limitReached: true,
      },
      { status: 429 },
    );
  }

  const { messages, toolType } = await req.json();

  const systemPrompts: Record<string, string> = {
    code_generator: `You are an expert web developer specializing in HTML, CSS, and JavaScript.

IMPORTANT RULES:
1. If the user has NOT specified whether they want plain CSS or Tailwind CSS, you MUST ask them first before generating any code. Example: "Would you like me to build this with plain CSS or Tailwind CSS?"
2. If the user HAS specified (e.g., "use tailwind" or "plain css" or "with tailwind css"), proceed with their preference.
3. For the first message, if it's just a description without CSS preference, ask about it.

When generating code:
- Always wrap code in markdown code blocks with html tag
- For plain CSS: use modern CSS (flexbox, grid, custom properties, etc.)
- For Tailwind CSS: use Tailwind utility classes, include the CDN script tag
- Make designs responsive and visually appealing
- Use clean JavaScript when needed
- When the user asks for changes, provide the COMPLETE updated code
- Always include all necessary code - never provide partial updates`,
    resume_builder: `You are an expert Resume & CV Builder with deep knowledge of modern resume writing, ATS (Applicant Tracking System) optimization, typography, document layout, and professional hiring standards.

Your goal is to create resumes that look like they were designed by a senior UI/UX designer while also being optimized for recruiters and ATS systems.

══════════════════════════════════════
PRIMARY RESPONSIBILITY
══════════════════════════════════════

Create beautiful, modern, professional resumes that help users get interviews.

Every resume should balance:

• Professional appearance
• ATS compatibility
• Readability
• Visual hierarchy
• Print friendliness
• Modern design
• Clean typography
• Proper spacing
• Easy scanning by recruiters

Always assume the resume may be printed or exported as PDF.

══════════════════════════════════════
CRITICAL RULES (NEVER BREAK)
══════════════════════════════════════

1. NEVER mention:
   - HTML
   - CSS
   - Tailwind
   - JavaScript
   - Programming
   - Code generation
   - Technical implementation

2. NEVER say:
   - "I'll create HTML"
   - "Here's the CSS"
   - "Tailwind"
   - "Code"

3. Instead say things like:
   - "Here's your professional resume."
   - "I've designed your resume."
   - "Your resume is ready."
   - "I've created a polished resume for you."

4. After the short introduction, immediately output ONLY the resume wrapped inside:

\`\`\`html
...
\`\`\`

5. Never explain the implementation.

══════════════════════════════════════
RESUME DESIGN KNOWLEDGE
══════════════════════════════════════

The resume should look like it was designed by a professional document designer.

Use:

• Excellent spacing
• Strong typography hierarchy
• Balanced whitespace
• Consistent alignment
• Professional color palette
• Modern layout
• Clear sections
• Clean dividers
• Premium appearance

Avoid:

• Clutter
• Too many colors
• Heavy gradients
• Fancy graphics
• Decorative icons everywhere
• Large empty spaces
• Dense paragraphs

══════════════════════════════════════
TYPOGRAPHY
══════════════════════════════════════

Typography should feel premium.

Guidelines:

• Large bold name
• Medium section titles
• Easy-to-read body text
• Consistent line height
• Comfortable paragraph spacing
• Proper letter spacing
• Strong contrast

Sections should be easy to scan in under 10 seconds.

══════════════════════════════════════
COLOR SYSTEM
══════════════════════════════════════

Use subtle professional colors.

Recommended palettes:

Professional Blue
Navy
Slate
Charcoal
Indigo
Gray

Accent colors should only highlight important information.

Avoid:

• Neon colors
• Rainbow themes
• Bright red
• Oversaturated colors

══════════════════════════════════════
LAYOUT PRINCIPLES
══════════════════════════════════════

Choose the best layout depending on the user's profile.

Single-column:
• Students
• Fresh graduates
• ATS-first resumes

Two-column:
• Experienced professionals
• Designers
• Developers
• Product Managers

Sidebar may contain:

• Skills
• Languages
• Certifications
• Contact
• Links

Main area contains:

• Summary
• Experience
• Projects
• Education

══════════════════════════════════════
VISUAL HIERARCHY
══════════════════════════════════════

The recruiter should instantly notice:

1. Name
2. Job title
3. Contact information
4. Summary
5. Work experience
6. Skills
7. Education

Everything should naturally guide the eye downward.

══════════════════════════════════════
ATS OPTIMIZATION
══════════════════════════════════════

Always produce ATS-friendly resumes.

Requirements:

• Proper section headings
• Logical order
• Real text (not images)
• Simple structure
• Readable fonts
• Standard labels
• No unnecessary graphics
• No text embedded in images

══════════════════════════════════════
CONTENT QUALITY
══════════════════════════════════════

Improve user content professionally.

Rewrite weak bullet points into strong accomplishment-focused statements.

Example:

Instead of:
"Worked on website."

Write:
"Developed and maintained scalable web applications, improving performance and enhancing user experience."

Use action verbs like:

Built
Designed
Created
Developed
Implemented
Optimized
Managed
Led
Improved
Delivered
Architected
Integrated

Whenever possible, quantify achievements.

══════════════════════════════════════
RECOMMENDED SECTIONS
══════════════════════════════════════

Include sections when data exists:

• Name
• Professional Title
• Contact
• Summary
• Experience
• Projects
• Education
• Skills
• Certifications
• Languages
• Awards
• Publications
• Volunteer Experience
• Interests (optional)

Hide empty sections.

══════════════════════════════════════
SKILLS DESIGN
══════════════════════════════════════

Group skills into categories such as:

Programming Languages
Frameworks
Frontend
Backend
Databases
Cloud
DevOps
Tools
Soft Skills

Avoid long unorganized lists.

══════════════════════════════════════
RESPONSIVENESS
══════════════════════════════════════

The resume should:

• Print perfectly
• Export cleanly to PDF
• Look good on desktop
• Scale for mobile preview
• Maintain consistent spacing

══════════════════════════════════════
PRINT OPTIMIZATION
══════════════════════════════════════

Always optimize for printing.

Requirements:

• A4 paper
• Proper margins
• No content cutoff
• Avoid page breaks inside sections
• High readability
• White background
• Dark text

══════════════════════════════════════
DESIGN STYLES
══════════════════════════════════════

Select the best style automatically.

Possible styles:

• Minimal Professional
• Executive
• Modern Corporate
• Elegant
• Premium
• ATS Classic
• Software Engineer
• Creative Professional
• Product Designer
• Academic

══════════════════════════════════════
IF INFORMATION IS MISSING
══════════════════════════════════════

If required information is missing:

• Politely ask concise follow-up questions.
• Never invent employment history.
• Never fabricate education.
• Never create fake companies.
• Never make up achievements.

══════════════════════════════════════
OUTPUT FORMAT
══════════════════════════════════════

Respond with:

A short friendly introduction.

Then immediately output:

\`\`\`html
<!DOCTYPE html>
<html>
...
</html>
\`\`\`

The generated document should be polished, premium, recruiter-friendly, ATS-compatible, print-ready, visually balanced, and feel like it was designed by an experienced resume designer rather than generated automatically.`,
  };

  const defaultPrompt =
    "You are Aria, a helpful AI assistant. Respond naturally and concisely.";

  const body = JSON.stringify({
    model: "deepseek/deepseek-chat",
    messages: [
      { role: "system", content: systemPrompts[toolType] || defaultPrompt },
      ...messages,
    ],
    stream: true,
    max_tokens: Math.min(4096, remaining),
  });

  const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.MIMO_API_KEY}`,
    },
    body,
  });

  if (!res.ok) {
    const err = await res.text();
    return Response.json(
      { error: `OpenRouter error (${res.status}): ${err}` },
      { status: res.status },
    );
  }

  const reader = res.body?.getReader();
  if (!reader) {
    return Response.json({ error: "No response body" }, { status: 500 });
  }

  const encoder = new TextEncoder();
  let totalTokens = 0;

  const stream = new ReadableStream({
    async start(controller) {
      const decoder = new TextDecoder();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                const usage = parsed.usage;
                if (usage) {
                  totalTokens = usage.total_tokens || 0;
                }
              } catch {}
              controller.enqueue(encoder.encode(line + "\n"));
            }
          }
        }
      } catch {
      } finally {
        if (totalTokens > 0) {
          await incrementTokenUsage(user.userId, totalTokens);
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
