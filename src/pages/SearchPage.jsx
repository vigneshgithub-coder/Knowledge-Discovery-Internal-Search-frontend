import React, { useState, useEffect } from 'react';
import { SearchIcon, Filter, Grid, List, X, Calendar, User, FileText, Download, Folder, Tag } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Modal } from '../components/ui/modal';
import { useToast } from '../hooks/use-toast';
import { searchDocuments } from '../services/api';
import { getProjects } from '../services/api';
import { userStorage } from '../utils/userStorage';
import { validateSearch } from '../utils/validation';
import { useDebounce } from '../hooks/use-debounce';
import DocumentCard from '../components/DocumentCard';
import UserInfoModal from '../components/UserInfoModal';

const CATEGORIES = [
  'Technical Documentation',
  'User Guides', 
  'API Documentation',
  'Meeting Notes',
  'Project Plans',
  'Reports',
  'Other'
];

const FILE_TYPES = [
  { value: 'pdf', label: 'PDF' },
  { value: 'docx', label: 'Word Document' },
  { value: 'pptx', label: 'PowerPoint' },
  { value: 'txt', label: 'Text File' }
];

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' }
];

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [category, setCategory] = useState('');
  const [fileType, setFileType] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [resultsPerPage] = useState(10);
  const debouncedQuery = useDebounce(query, 300);
  const { addToast } = useToast();

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (debouncedQuery) {
      performSearch();
    } else {
      setResults([]);
      setTotalResults(0);
    }
  }, [debouncedQuery, selectedProject, category, fileType, sortBy]);

  const loadProjects = async () => {
    try {
      const projectList = await getProjects();
      setProjects(projectList);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const performSearch = async (page = 1) => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setTotalResults(0);
      return;
    }

    setLoading(true);
    try {
      const userId = userStorage.getUserInfo()?.userId;
      const searchResults = await searchDocuments(debouncedQuery, selectedProject, {
        category,
        fileType,
        sortBy,
        limit: resultsPerPage,
        skip: (page - 1) * resultsPerPage,
        userId
      });
      
      console.log('Search results received:', searchResults);
      console.log('Results array:', searchResults.results);
      
      setResults(searchResults.results || []);
      setTotalResults(searchResults.count || searchResults.results?.length || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error('Search failed:', error);
      addToast('Search failed. Please try again.', 'error');
      setResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (validateSearch(query)) {
      setCurrentPage(1);
      performSearch(1);
    }
  };

  const handleFilterChange = (filterType, value) => {
    switch (filterType) {
      case 'project':
        setSelectedProject(value);
        break;
      case 'category':
        setCategory(value);
        break;
      case 'fileType':
        setFileType(value);
        break;
      case 'sortBy':
        setSortBy(value);
        break;
    }
    setCurrentPage(1);
    if (debouncedQuery) {
      performSearch(1);
    }
  };

  const handlePageChange = (page) => {
    performSearch(page);
  };

  const handlePreview = (document) => {
    // Navigate to document preview page
    window.location.href = `/documents/${document._id}`;
  };

  const handleDownload = (document) => {
    if (document.fileUrl) {
      window.open(document.fileUrl, '_blank');
    }
  };

  const clearFilters = () => {
    setSelectedProject('');
    setCategory('');
    setFileType('');
    setSortBy('relevance');
    setCurrentPage(1);
    if (debouncedQuery) {
      performSearch(1);
    }
  };

  const totalPages = Math.ceil(totalResults / resultsPerPage);
  const hasActiveFilters = selectedProject || category || fileType || sortBy !== 'relevance';

  const userInfo = userStorage.getUserInfo();
  if (!userInfo) {
    return <UserInfoModal />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Search</h1>
            <p className="text-gray-600">Search through your documents instantly</p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search documents, projects, or content..."
                className="pl-12 pr-32 h-12 text-base shadow-sm border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 ${hasActiveFilters ? 'text-blue-600' : 'text-gray-500'}`}
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {hasActiveFilters && (
                    <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                      {[selectedProject, category, fileType].filter(Boolean).length}
                    </span>
                  )}
                </Button>
                <Button type="submit" disabled={loading} className="h-9">
                  {loading ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Search Filters</h3>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Project Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project
                </label>
                <select
                  value={selectedProject}
                  onChange={(e) => handleFilterChange('project', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Projects</option>
                  {projects.map((project) => (
                    <option key={project} value={project}>
                      {project}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* File Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File Type
                </label>
                <select
                  value={fileType}
                  onChange={(e) => handleFilterChange('fileType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Types</option>
                  {FILE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {query && (
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Search Results
                  {totalResults > 0 && (
                    <span className="text-gray-500 font-normal ml-2">
                      ({totalResults} documents)
                    </span>
                  )}
                </h2>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="p-2"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="p-2"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Searching...</span>
            </div>
          </div>
        )}

        {/* Results Grid/List */}
        {!loading && results.length > 0 && (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {results.map((document) => (
              <DocumentCard
                key={document._id}
                document={document}
                onPreview={handlePreview}
                onDownload={handleDownload}
                highlightText={query}
              />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && query && results.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <SearchIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && results.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!query && !loading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-6">
              <SearchIcon className="h-10 w-10 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Start Searching</h2>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Enter a search term above to find documents across all your projects. Use filters to narrow down your results.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">1000+</p>
                <p className="text-sm text-gray-600">Documents</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
                  <Folder className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                <p className="text-sm text-gray-600">Projects</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2">
                  <SearchIcon className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">Fast</p>
                <p className="text-sm text-gray-600">Search</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
