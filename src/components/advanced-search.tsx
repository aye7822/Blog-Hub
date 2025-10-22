'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Calendar, Clock, User, Tag } from 'lucide-react'
import { 
  debounce, 
  throttle, 
  formatDate, 
  formatRelativeTime, 
  extractExcerpt, 
  highlightSearchTerm,
  getErrorMessage,
  isNetworkError,
  getFromStorage,
  setToStorage,
  removeFromStorage,
  calculatePagination
} from '@/lib/helpers'

interface SearchResult {
  id: string
  title: string
  content: string
  excerpt?: string
  createdAt: string
  updatedAt: string
  author: string
  tags: string[]
  category: string
}

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void
  results: SearchResult[]
  loading: boolean
  error: unknown
}

interface SearchFilters {
  category?: string
  dateRange?: {
    start: Date
    end: Date
  }
  tags?: string[]
  author?: string
}

export function AdvancedSearch({ onSearch, results, loading, error }: AdvancedSearchProps) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({})
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Load search history from localStorage
  useEffect(() => {
    const history = getFromStorage<string[]>('search-history', [])
    setSearchHistory(history)
  }, [])

  // Debounced search to avoid too many API calls
  const debouncedSearch = debounce((searchQuery: string, searchFilters: SearchFilters) => {
    onSearch(searchQuery, searchFilters)
  }, 300)

  // Throttled filter updates
  const throttledFilterUpdate = throttle((newFilters: SearchFilters) => {
    setFilters(newFilters)
    debouncedSearch(query, newFilters)
  }, 500)

  // Handle search input
  const handleSearchChange = (value: string) => {
    setQuery(value)
    debouncedSearch(value, filters)
  }

  // Handle filter changes
  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    throttledFilterUpdate(newFilters)
  }

  // Save search to history
  const handleSearch = () => {
    if (query.trim()) {
      const newHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 10)
      setSearchHistory(newHistory)
      setToStorage('search-history', newHistory)
      onSearch(query, filters)
    }
  }

  // Clear search history
  const clearHistory = () => {
    setSearchHistory([])
    removeFromStorage('search-history')
  }

  // Pagination
  const paginationPages = calculatePagination(currentPage, totalPages, 5)

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          placeholder="Search posts, authors, or content..."
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-12 pr-4 h-12 text-base"
        />
        <Button 
          onClick={handleSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
          size="sm"
        >
          Search
        </Button>
      </div>

      {/* Search History */}
      {searchHistory.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Recent Searches</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearHistory}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((item, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSearchChange(item)}
                className="text-xs"
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <Input
            placeholder="Filter by category"
            value={filters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
          <Input
            placeholder="Filter by author"
            value={filters.author || ''}
            onChange={(e) => handleFilterChange('author', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
          <Input
            placeholder="Filter by tags (comma separated)"
            value={filters.tags?.join(', ') || ''}
            onChange={(e) => handleFilterChange('tags', e.target.value.split(',').map(t => t.trim()))}
          />
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Search Error</h3>
              <p className="text-red-600 mb-4">
                {isNetworkError(error) 
                  ? 'Network error. Please check your connection.'
                  : getErrorMessage(error)
                }
              </p>
              <Button onClick={() => onSearch(query, filters)}>
                Try Again
              </Button>
            </div>
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="text-sm text-gray-600 mb-4">
              Found {results.length} results
            </div>
            <div className="space-y-4">
              {results.map((result) => (
                <Card key={result.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      <span 
                        dangerouslySetInnerHTML={{ 
                          __html: highlightSearchTerm(result.title, query) 
                        }} 
                      />
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(result.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatRelativeTime(result.updatedAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {result.author}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">
                      <span 
                        dangerouslySetInnerHTML={{ 
                          __html: highlightSearchTerm(
                            extractExcerpt(result.content, 200), 
                            query
                          ) 
                        }} 
                      />
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{result.category}</Badge>
                      {result.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {paginationPages.map((page, index) => (
                  <Button
                    key={index}
                    variant={page === currentPage ? "default" : "outline"}
                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                    disabled={page === '...'}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : query && (
          <div className="text-center py-8">
            <div className="text-gray-500">
              No results found for "{query}"
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
