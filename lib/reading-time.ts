export interface ReadingTimeResult {
  text: string
  minutes: number
  time: number
  words: number
}

export function calculateReadingTime(content: string): ReadingTimeResult {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  const time = minutes * 60 * 1000 // in milliseconds

  return {
    text: `${minutes} min read`,
    minutes,
    time,
    words,
  }
}
