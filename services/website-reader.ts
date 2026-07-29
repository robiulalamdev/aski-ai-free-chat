"use server"

export async function fetchWebsite(url: string): Promise<{ success: boolean; data: string; error?: string }> {
  try {
    const cleanUrl = url.startsWith("http") ? url : `https://${url}`
    const response = await fetch(cleanUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; FreeAIChat/1.0)" },
    })

    if (!response.ok) {
      return { success: false, data: "", error: `Failed to fetch: ${response.status}` }
    }

    const html = await response.text()

    const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() || "No title"

    const metaMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)
    const description = metaMatch?.[1]?.trim() || ""

    const bodyText = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[\s\S]*?<\/nav>/gi, "")
      .replace(/<header[\s\S]*?<\/header>/gi, "")
      .replace(/<footer[\s\S]*?<\/footer>/gi, "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 5000)

    return {
      success: true,
      data: `Title: ${title}\nDescription: ${description}\n\nContent:\n${bodyText}`,
    }
  } catch (error) {
    return { success: false, data: "", error: error instanceof Error ? error.message : "Failed to fetch website" }
  }
}
