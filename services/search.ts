"use server"

export async function searchWeb(query: string): Promise<{ success: boolean; data: string; error?: string }> {
  try {
    const response = await fetch(
      `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`,
      { headers: { "User-Agent": "Mozilla/5.0 (compatible; FreeAIChat/1.0)" } }
    )

    if (!response.ok) {
      return { success: false, data: "", error: "Failed to search" }
    }

    const html = await response.text()

    const results: string[] = []
    const resultRegex = /<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g
    let match

    while ((match = resultRegex.exec(html)) !== null && results.length < 5) {
      const title = match[2].replace(/<[^>]*>/g, "").trim()
      results.push(`${title}\n${match[1]}`)
    }

    return {
      success: true,
      data: results.length > 0
        ? `Search results for "${query}":\n\n${results.join("\n\n")}`
        : `No results found for "${query}".`,
    }
  } catch (error) {
    return { success: false, data: "", error: error instanceof Error ? error.message : "Search failed" }
  }
}
