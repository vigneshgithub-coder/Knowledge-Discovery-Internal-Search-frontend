import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Search, FileText, Calendar, User, Folder, Tag, ExternalLink, Share2 } from 'lucide-react';
import { getDocumentById } from '../services/api';
import { formatDate, formatNumber } from '../utils/formatters';
import { useToast } from '../components/Toast';
import { Button } from '../components/Button';
import DocumentCard from '../components/DocumentCard';

const DocumentPreviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [relatedDocs, setRelatedDocs] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  useEffect(() => {
    if (id) {
      loadDocument();
    }
  }, [id]);

  const loadDocument = async () => {
    try {
      setLoading(true);
      const doc = await getDocumentById(id);
      setDocument(doc);
      
      // Load related documents
      if (doc.project || (doc.tags && doc.tags.length > 0)) {
        loadRelatedDocuments(doc);
      }
    } catch (error) {
      console.error('Failed to load document:', error);
      addToast('Failed to load document', 'error');
      navigate('/search');
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedDocuments = async (doc) => {
    try {
      setLoadingRelated(true);
      // TODO: Implement related documents API call
      // For now, we'll use a placeholder
      setRelatedDocs([]);
    } catch (error) {
      console.error('Failed to load related documents:', error);
    } finally {
      setLoadingRelated(false);
    }
  };

  const handleDownload = () => {
    if (document?.fileUrl) {
      window.open(document.fileUrl, '_blank');
    }
  };

  const handleShare = async () => {
    if (navigator.share && document) {
      try {
        await navigator.share({
          title: document.fileName,
          text: `Check out this document: ${document.fileName}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      addToast('Link copied to clipboard', 'success');
    }
  };

  const filteredContent = () => {
    if (!document?.content || !searchQuery) return document?.content || '';
    
    const query = searchQuery.toLowerCase();
    const content = document.content.toLowerCase();
    
    if (content.includes(query)) {
      // Highlight matching text
      const regex = new RegExp(`(${searchQuery})`, 'gi');
      return document.content.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
    }
    
    return document.content;
  };

  const renderPreview = () => {
    if (!document) return null;

    switch (document.fileType?.toLowerCase()) {
      case 'pdf':
        return (
          <div className="w-full h-[600px] border border-gray-200 rounded-lg overflow-hidden">
            <embed
              src={document.fileUrl}
              type="application/pdf"
              className="w-full h-full"
              title={document.fileName}
            />
          </div>
        );
      
      case 'txt':
        return (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-mono">
                {document.content || 'No content available'}
              </pre>
            </div>
          </div>
        );
      
      case 'docx':
      case 'pptx':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <FileText className="w-12 h-12 text-blue-500 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-blue-900 mb-2">Preview Not Available</h3>
              <p className="text-blue-700 mb-4">
                {document.fileType?.toUpperCase()} files cannot be previewed directly.
              </p>
              <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in New Tab
              </Button>
            </div>
            
            {document.content && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-3">Extracted Text Content</h4>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                    {document.content}
                  </pre>
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        return (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <p className="text-gray-500">Preview not available for this file type.</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Document not found</p>
          <Button onClick={() => navigate('/search')} className="mt-4">
            Back to Search
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 truncate max-w-md">
                  {document.fileName}
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium">
                    {document.fileType?.toUpperCase()}
                  </span>
                  {document.autoCategory && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-medium">
                      {document.autoCategory}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Share document"
              >
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
              <Button onClick={handleDownload} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Document Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {document.project && (
                  <div className="flex items-center gap-2 text-sm">
                    <Folder className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500">Project</p>
                      <p className="font-medium text-gray-900">{document.project}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-500">Uploaded by</p>
                    <p className="font-medium text-gray-900">{document.uploadedByName || 'Unknown'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">{formatDate(document.uploadedAt || document.createdAt)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-500">Size</p>
                    <p className="font-medium text-gray-900">{formatNumber(document.fileSize)} bytes</p>
                  </div>
                </div>
              </div>
              
              {document.tags && document.tags.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-500">Tags</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {document.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Search in Document */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search within this document..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Document Preview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Document Preview</h2>
              {renderPreview()}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Documents */}
            {relatedDocs.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Related Documents</h3>
                <div className="space-y-3">
                  {relatedDocs.map((doc) => (
                    <div key={doc._id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <h4 className="font-medium text-gray-900 text-sm truncate">{doc.fileName}</h4>
                      <p className="text-xs text-gray-600">{doc.project}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewPage;
