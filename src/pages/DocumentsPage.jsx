import React, { useState, useEffect } from 'react';
import { 
  SearchIcon, 
  Filter, 
  Grid, 
  List, 
  X, 
  Calendar, 
  User, 
  FileText, 
  Download, 
  Folder, 
  Tag,
  Eye,
  Trash2,
  Plus,
  Upload
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Modal } from '../components/ui/modal';
import { useToast } from '../hooks/use-toast';
import { getDocuments, deleteDocument, getProjects } from '../services/api';
import { userStorage } from '../utils/userStorage';
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
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'size', label: 'File Size' }
];

// Utility functions
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFileType, setSelectedFileType] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    loadDocuments();
    loadProjects();
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [selectedProject, selectedCategory, selectedFileType, sortBy]);

  const loadDocuments = async () => {
    try {
      const userId = userStorage.getUserInfo()?.userId;
      const documentList = await getDocuments(null, userId);
      setDocuments(Array.isArray(documentList) ? documentList : []);
    } catch (error) {
      console.error('Failed to load documents:', error);
      addToast('Failed to load documents', 'error');
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const projectList = await getProjects();
      setProjects(projectList);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const handleDelete = async (documentId) => {
    try {
      await deleteDocument(documentId);
      setDocuments((prevDocuments || []).filter(doc => doc.id !== documentId));
      addToast('Document deleted successfully', 'success');
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete document:', error);
      addToast('Failed to delete document', 'error');
    }
  };

  const handleDownload = (document) => {
    if (document.fileUrl) {
      window.open(document.fileUrl, '_blank');
    }
  };

  const handleViewDocument = (document) => {
    setSelectedDocument(document);
  };

  const handlePreview = (document) => {
    // Navigate to document preview page
    window.location.href = `/documents/${document.id}`;
  };

  const clearFilters = () => {
    setSelectedProject('');
    setSelectedCategory('');
    setSelectedFileType('');
    setSortBy('newest');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedProject || selectedCategory || selectedFileType || sortBy !== 'newest' || searchQuery;

  const filteredDocuments = (documents || []).filter(doc => {
    if (searchQuery && !doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !doc.content?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedProject && doc.project !== selectedProject) return false;
    if (selectedCategory && doc.category !== selectedCategory) return false;
    if (selectedFileType && doc.fileType !== selectedFileType) return false;
    return true;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortBy === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    if (sortBy === 'name') {
      return a.fileName.localeCompare(b.fileName);
    }
    if (sortBy === 'name-desc') {
      return b.fileName.localeCompare(a.fileName);
    }
    if (sortBy === 'size') {
      return b.fileSize - a.fileSize;
    }
    return 0;
  });

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Library</h1>
            <p className="text-gray-600">Browse and manage all your uploaded documents</p>
          </div>

          {/* Search and Actions Bar */}
          <div className="max-w-4xl mx-auto mb-6">
            <div className="flex gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search documents by name or content..."
                  className="pl-12 pr-4 h-12 text-base shadow-sm border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
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
                      {[selectedProject, selectedCategory, selectedFileType].filter(Boolean).length}
                    </span>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'text-blue-600' : 'text-gray-500'}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'text-blue-600' : 'text-gray-500'}
                >
                  <List className="h-4 w-4" />
                </Button>

                <Button
                  onClick={() => window.location.href = '/upload'}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Document Filters</h3>
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
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Projects</option>
                  {(projects || []).map((project) => (
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
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
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
                  value={selectedFileType}
                  onChange={(e) => setSelectedFileType(e.target.value)}
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

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
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
        <div>
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="font-medium">
                  {searchQuery ? `Search results for "${searchQuery}"` : 'All Documents'}
                </span>
                {filteredDocuments.length > 0 && (
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {filteredDocuments.length} documents
                  </span>
                )}
              </div>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading documents...</p>
            </div>
          )}

          {/* No Results */}
          {!loading && filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery ? 'Try adjusting your search terms or filters' : 'Upload some documents to get started'}
              </p>
              {!searchQuery && (
                <Button onClick={() => window.location.href = '/upload'}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Documents
                </Button>
              )}
              {hasActiveFilters && (
                <div className="mt-4">
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Documents Grid/List */}
          {!loading && filteredDocuments.length > 0 && (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sortedDocuments.map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      document={doc}
                      onPreview={handlePreview}
                      onDownload={handleDownload}
                      onView={handleViewDocument}
                      onDelete={setDeleteConfirm}
                      highlightText={searchQuery}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 p-6"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {doc.fileName}
                            </h3>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {doc.category && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <Tag className="h-3 w-3 mr-1" />
                                {doc.category}
                              </span>
                            )}
                            {doc.project && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                <Folder className="h-3 w-3 mr-1" />
                                {doc.project}
                              </span>
                            )}
                            {doc.team && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <User className="h-3 w-3 mr-1" />
                                {doc.team}
                              </span>
                            )}
                          </div>

                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {doc.content?.substring(0, 200)}...
                          </p>

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(doc.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="font-medium">{doc.fileType?.toUpperCase()}</span>
                              <span>•</span>
                              <span>{formatFileSize(doc.fileSize)}</span>
                            </span>
                            {doc.uploadedByName && (
                              <span className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {doc.uploadedByName}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePreview(doc)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(doc)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteConfirm(doc)}
                            className="text-red-600 hover:text-red-700 hover:border-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Document View Modal */}
        {selectedDocument && (
          <Modal
            isOpen={!!selectedDocument}
            onClose={() => setSelectedDocument(null)}
            title={selectedDocument.fileName}
            size="large"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {selectedDocument.category && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      <Tag className="h-4 w-4 mr-1" />
                      {selectedDocument.category}
                    </span>
                  )}
                  {selectedDocument.project && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                      <Folder className="h-4 w-4 mr-1" />
                      {selectedDocument.project}
                    </span>
                  )}
                  {selectedDocument.team && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                      <User className="h-4 w-4 mr-1" />
                      {selectedDocument.team}
                    </span>
                  )}
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleDownload(selectedDocument)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedDocument.content}
                </p>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                  <div>
                    <span className="font-medium">Type:</span>
                    <p>{selectedDocument.fileType?.toUpperCase()}</p>
                  </div>
                  <div>
                    <span className="font-medium">Size:</span>
                    <p>{formatFileSize(selectedDocument.fileSize)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Uploaded:</span>
                    <p>{formatDate(selectedDocument.createdAt)}</p>
                  </div>
                  {selectedDocument.uploadedByName && (
                    <div>
                      <span className="font-medium">By:</span>
                      <p>{selectedDocument.uploadedByName}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Modal>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <Modal
            isOpen={!!deleteConfirm}
            onClose={() => setDeleteConfirm(null)}
            title="Delete Document"
            size="small"
          >
            <div className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to delete "{deleteConfirm.fileName}"? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleDelete(deleteConfirm.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Delete
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
