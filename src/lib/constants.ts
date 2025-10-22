// Application constants

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
} as const

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
} as const

// Post Configuration
export const POST_CONFIG = {
  MAX_TITLE_LENGTH: 200,
  MAX_EXCERPT_LENGTH: 500,
  MAX_CONTENT_LENGTH: 50000,
  MIN_TITLE_LENGTH: 1,
  MIN_CONTENT_LENGTH: 1,
  DEFAULT_EXCERPT_LENGTH: 150,
} as const

// Category Configuration
export const CATEGORY_CONFIG = {
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MIN_NAME_LENGTH: 1,
} as const

// File Upload Configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  UPLOAD_DIR: 'public/uploads',
} as const

// UI Configuration
export const UI_CONFIG = {
  DEBOUNCE_DELAY: 300, // milliseconds
  TOAST_DURATION: 5000, // 5 seconds
  ANIMATION_DURATION: 200, // milliseconds
  SKELETON_COUNT: 6, // Number of skeleton items to show
} as const

// Search Configuration
export const SEARCH_CONFIG = {
  MIN_QUERY_LENGTH: 2,
  MAX_QUERY_LENGTH: 100,
  DEBOUNCE_DELAY: 500, // milliseconds
} as const

// Database Configuration
export const DB_CONFIG = {
  CONNECTION_TIMEOUT: 30000, // 30 seconds
  QUERY_TIMEOUT: 10000, // 10 seconds
  MAX_CONNECTIONS: 10,
} as const

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  VALIDATION: 'Please check your input and try again.',
  NOT_FOUND: 'The requested resource was not found.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  CONFLICT: 'This resource already exists.',
  SERVER_ERROR: 'Internal server error. Please try again later.',
  FILE_TOO_LARGE: 'File size exceeds the maximum allowed limit.',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload a valid image.',
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  WEAK_PASSWORD: 'Password must be at least 8 characters long.',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  POST_CREATED: 'Post created successfully!',
  POST_UPDATED: 'Post updated successfully!',
  POST_DELETED: 'Post deleted successfully!',
  CATEGORY_CREATED: 'Category created successfully!',
  CATEGORY_UPDATED: 'Category updated successfully!',
  CATEGORY_DELETED: 'Category deleted successfully!',
  FILE_UPLOADED: 'File uploaded successfully!',
  SETTINGS_SAVED: 'Settings saved successfully!',
} as const

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  SLUG_REGEX: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  HEX_COLOR_REGEX: /^#[0-9A-F]{6}$/i,
  URL_REGEX: /^https?:\/\/.+/,
} as const

// Theme Configuration
export const THEME_CONFIG = {
  DEFAULT_THEME: 'light',
  THEMES: ['light', 'dark'] as const,
  STORAGE_KEY: 'blog-theme',
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'blog-theme',
  USER_PREFERENCES: 'blog-user-preferences',
  DRAFT_POST: 'blog-draft-post',
  SEARCH_HISTORY: 'blog-search-history',
} as const

// Route Paths
export const ROUTES = {
  HOME: '/',
  BLOG: '/blog',
  DASHBOARD: '/dashboard',
  NEW_POST: '/dashboard/posts/new',
  NEW_CATEGORY: '/dashboard/categories/new',
  EDIT_POST: (id: string) => `/dashboard/posts/${id}/edit`,
  BLOG_POST: (slug: string) => `/blog/${slug}`,
} as const

// Feature Flags
export const FEATURES = {
  ENABLE_COMMENTS: false,
  ENABLE_LIKES: false,
  ENABLE_SHARING: true,
  ENABLE_SEARCH: true,
  ENABLE_CATEGORIES: true,
  ENABLE_TAGS: false,
  ENABLE_DRAFTS: true,
  ENABLE_SCHEDULING: false,
} as const

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM d, yyyy',
  DISPLAY_WITH_TIME: 'MMM d, yyyy h:mm a',
  ISO: 'yyyy-MM-dd',
  RELATIVE: 'relative',
} as const

// Reading Time Configuration
export const READING_TIME = {
  WORDS_PER_MINUTE: 200,
  MIN_READING_TIME: 1, // minutes
} as const

// SEO Configuration
export const SEO_CONFIG = {
  DEFAULT_TITLE: 'BlogHub',
  DEFAULT_DESCRIPTION: 'A modern BlogHub built with Next.js, tRPC, and Tailwind CSS',
  DEFAULT_KEYWORDS: ['blog', 'writing', 'content', 'articles'],
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
} as const

// Social Media Configuration
export const SOCIAL_CONFIG = {
  TWITTER_HANDLE: '@blogplatform',
  FACEBOOK_APP_ID: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
  GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GA_ID,
} as const

// Development Configuration
export const DEV_CONFIG = {
  ENABLE_LOGGING: process.env.NODE_ENV === 'development',
  ENABLE_DEBUG: process.env.NODE_ENV === 'development',
  MOCK_DATA: process.env.NODE_ENV === 'development',
} as const

// Export all constants as a single object for easy access
export const CONSTANTS = {
  API_CONFIG,
  PAGINATION,
  POST_CONFIG,
  CATEGORY_CONFIG,
  UPLOAD_CONFIG,
  UI_CONFIG,
  SEARCH_CONFIG,
  DB_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION_RULES,
  THEME_CONFIG,
  STORAGE_KEYS,
  ROUTES,
  FEATURES,
  DATE_FORMATS,
  READING_TIME,
  SEO_CONFIG,
  SOCIAL_CONFIG,
  DEV_CONFIG,
} as const

// Type definitions for better TypeScript support
export type Theme = typeof THEME_CONFIG.THEMES[number]
export type FeatureFlag = keyof typeof FEATURES
export type StorageKey = keyof typeof STORAGE_KEYS
export type RouteKey = keyof typeof ROUTES
export type ErrorMessageKey = keyof typeof ERROR_MESSAGES
export type SuccessMessageKey = keyof typeof SUCCESS_MESSAGES
