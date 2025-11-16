import React, { useState, useEffect } from 'react';
import { Trash2, Eye } from 'lucide-react';
import { getDocuments, deleteDocument, getProjects } from '../services/api';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';
import { formatDate, formatFileSize, truncateText } from '../utils/formatters';
import UserInfoModal from '../components/UserInfoModal';
import { userInfoExists } from '../utils/userInfo';

interface Document {
  id: string;
  filename: string;
  project_name: string;
  tags: string[];
  file_size: number;
  upload_date: string;
  processed: boolean;
}

export function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [projectFilter, setProjectFilter] = useState('');
  const [projects, setProjects] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    loadProjects();
    loadDocuments();
  }, []);

  useEffect(() => {
    // Check if user info is present, show modal if not
    if (!userInfoExists()) {
      setShowUserInfoModal(true);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [projectFilter]);

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data.projects);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const data = await getDocuments(projectFilter || undefined);
      setDocuments(data.documents);
    } catch (error) {
      addToast('Failed to load documents', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, filename: string) => {
    if (!confirm(`Are you sure you want to delete "${filename}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteDocument(id);
      setDocuments((docs) => docs.filter((d) => d.id !== id));
      addToast(`"${filename}" deleted successfully`, 'success');
    } catch (error) {
      addToast('Failed to delete document', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewDetails = (doc: Document) => {
    setSelectedDoc(doc);
    setIsModalOpen(true);
  };

  // Block UI until user info is provided
  if (!userInfoExists()) {
    return <UserInfoModal />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Documents</h1>
        <p className="text-gray-600">View and manage your uploaded documents.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
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
          <p className="text-sm text-gray-600">{documents.length} document(s)</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
          <p className="mt-2 text-gray-600">Loading documents...</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600 mb-4">No documents found</p>
          <a href="/upload" className="text-blue-600 hover:text-blue-700 font-medium">
            Upload your first document →
          </a>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Filename</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Project</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Size</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Uploaded</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900 truncate">{doc.filename}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{doc.project_name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{formatFileSize(doc.file_size)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{formatDate(doc.upload_date)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          doc.processed
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {doc.processed ? 'Processed' : 'Processing'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleViewDetails(doc)}
                        className="inline-flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id, doc.filename)}
                        disabled={deletingId === doc.id}
                        className="inline-flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedDoc?.filename || 'Document Details'}
      >
        {selectedDoc && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Project</p>
              <p className="font-medium text-gray-900">{selectedDoc.project_name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">File Size</p>
              <p className="font-medium text-gray-900">{formatFileSize(selectedDoc.file_size)}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Uploaded</p>
              <p className="font-medium text-gray-900">{formatDate(selectedDoc.upload_date)}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-medium">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    selectedDoc.processed
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {selectedDoc.processed ? 'Processed' : 'Processing'}
                </span>
              </p>
            </div>

            {selectedDoc.tags.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {selectedDoc.tags.map((tag, index) => (
                    <span key={`${tag}-${index}`} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={() => handleDelete(selectedDoc.id, selectedDoc.filename)}
              variant="danger"
              className="w-full mt-6"
            >
              Delete Document
            </Button>
          </div>
        )}
      </Modal>

      {showUserInfoModal && (
        <UserInfoModal
          onClose={() => setShowUserInfoModal(false)}
          onSubmit={() => setShowUserInfoModal(false)}
        />
      )}
    </div>
  );
}
