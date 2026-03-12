/**
 * Parse SSE (Server-Sent Events) stream and yield JSON data chunks.
 */
export async function* readSSE(
  reader: ReadableStreamDefaultReader<Uint8Array>,
): AsyncGenerator<string, void, unknown> {
  const decoder = new TextDecoder()
  let buffer = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n\n')
    buffer = lines.pop() ?? ''
    for (const block of lines) {
      const dataMatch = block.match(/^data: (.+)$/m)
      if (dataMatch) {
        const data = dataMatch[1]
        if (data === '[DONE]') return
        yield data
      }
    }
  }
}
