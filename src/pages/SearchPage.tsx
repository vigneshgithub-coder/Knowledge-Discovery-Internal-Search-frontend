import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Download } from 'lucide-react';
import { searchDocuments, getProjects } from '../services/api';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { useDebounce } from '../hooks/useDebounce';
import { useToast } from '../components/Toast';
import { validateSearch } from '../utils/validation';

interface SearchResult {
  id: string;
  documentId: string;
  filename: string;
  projectName: string;
  tags: string[];
  content: string;
  similarity: number;
  snippet: string;
}

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [projects, setProjects] = useState<string[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const { addToast } = useToast();

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (debouncedQuery.trim().length > 0) {
      handleSearch();
    } else {
      setResults([]);
      setError('');
    }
  }, [debouncedQuery, projectFilter]);

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data.projects);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const handleSearch = async () => {
    const validation = validateSearch(debouncedQuery);
    if (!validation.valid) {
      setError(validation.error || '');
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = await searchDocuments(debouncedQuery, projectFilter || undefined);
      setResults(data.results);

      if (data.results.length === 0) {
        setError('No results found');
      }
    } catch (err: any) {
      const message = err.response?.data?.error?.message || 'Search failed. Please try again.';
      setError(message);
      addToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setSelectedResult(result);
    setIsModalOpen(true);
  };

  const handleDownload = (filename: string) => {
    addToast(`Download link for ${filename} opened`, 'info');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Documents</h1>
        <p className="text-gray-600">Find relevant information across your uploaded documents using semantic search.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <div className="absolute left-3 top-3 text-gray-400">
              <SearchIcon className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search documents..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="">All Projects</option>
            {projects.map((project) => (
              <option key={project} value={project}>
                {project}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="text-center py-8">
            <p className="text-gray-600">{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
            <p className="mt-2 text-gray-600">Searching...</p>
          </div>
        )}

        {!isLoading && results.length > 0 && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600">Found {results.length} result(s)</div>
            {results.map((result) => (
              <div
                key={result.id}
                onClick={() => handleResultClick(result)}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{result.filename}</p>
                    <p className="text-sm text-gray-600">{result.projectName}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm font-semibold text-blue-600">
                      {Math.round(result.similarity * 100)}% match
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-3 line-clamp-2">{result.snippet}</p>

                <div className="flex flex-wrap gap-2">
                  {result.tags.map((tag) => (
                    <span key={tag} className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && query.trim().length > 0 && results.length === 0 && !error && (
          <div className="text-center py-8 text-gray-500">
            <p>No results found. Try a different search term.</p>
          </div>
        )}

        {query.trim().length === 0 && results.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <SearchIcon className="w-12 h-12 mx-auto mb-4" />
            <p>Enter a search query to find relevant documents</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedResult?.filename || 'Document Preview'}
      >
        {selectedResult && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Project</p>
              <p className="font-medium text-gray-900">{selectedResult.projectName}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Similarity Score</p>
              <p className="font-medium text-gray-900">{Math.round(selectedResult.similarity * 100)}%</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {selectedResult.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Content</p>
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <p className="text-sm text-gray-700 leading-relaxed">{selectedResult.content}</p>
              </div>
            </div>

            <Button
              onClick={() => handleDownload(selectedResult.filename)}
              className="w-full flex items-center justify-center gap-2"
              variant="secondary"
            >
              <Download className="w-4 h-4" />
              Download Original File
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
