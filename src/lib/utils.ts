import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculate word count from text content
 */
export function getWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length
}

/**
 * Calculate estimated reading time in minutes
 * Based on average reading speed of 200-250 words per minute
 */
export function getReadingTime(text: string): number {
  const wordCount = getWordCount(text)
  const wordsPerMinute = 200 // Average reading speed
  return Math.ceil(wordCount / wordsPerMinute)
}

/**
 * Format reading time for display
 */
export function formatReadingTime(minutes: number): string {
  if (minutes < 1) return '< 1 min read'
  if (minutes === 1) return '1 min read'
  return `${minutes} min read`
}