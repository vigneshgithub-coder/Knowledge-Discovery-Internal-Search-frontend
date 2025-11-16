import React, { useState, useRef } from 'react';
import { Upload, X, FileText, AlertCircle, CheckCircle, Plus, FolderOpen, Tag, Users, Loader2 } from 'lucide-react';
import { uploadDocument, getProjects } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';
import { validateProjectName, validateTags } from '../utils/validation';
import { formatFileSize } from '../utils/formatters';
import UserInfoModal from '../components/UserInfoModal';
import { userStorage } from '../utils/userStorage';

const CATEGORIES = [
  'marketing',
  'sales', 
  'product',
  'research',
  'strategy'
];

const TEAMS = [
  'marketing',
  'sales',
  'product',
  'research',
  'executive'
];

export function UploadPage() {
  const [file, setFile] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [category, setCategory] = useState('');
  const [team, setTeam] = useState('');
  const [tags, setTags] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tagList, setTagList] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [projects, setProjects] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const fileInputRef = useRef(null);
  const { addToast } = useToast();

  React.useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const projectList = await getProjects();
      setProjects(projectList);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const handleFileSelect = (selectedFile) => {
    if (selectedFile) {
      // Check file type
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        addToast('Please select a PDF, Word, Text, Excel, or PowerPoint file', 'error');
        return;
      }

      // Check file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        addToast('File size must be less than 10MB', 'error');
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !tagList.includes(tagInput.trim())) {
      setTagList([...tagList, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTagList(tagList.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(e);
    }
  };

  const validateForm = () => {
    if (!file) {
      addToast('Please select a file', 'error');
      return false;
    }

    if (!projectName.trim()) {
      addToast('Project name is required', 'error');
      return false;
    }

    if (!category) {
      addToast('Please select a category', 'error');
      return false;
    }

    if (!team) {
      addToast('Please select a team', 'error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const userInfo = userStorage.getUserInfo();
      if (!userInfo) {
        addToast('User information required', 'error');
        return;
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 300);

      const tagString = tagList.join(', ');
      const result = await uploadDocument(file, projectName.trim(), tagString, {
        category,
        team,
        userId: userInfo.id
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Show success state
      setUploadSuccess({
        fileName: file.name,
        projectName: projectName,
        tags: tagList,
        category: category,
        team: team
      });

      addToast('Document uploaded successfully!', 'success');

      // Reset form after delay
      setTimeout(() => {
        resetForm();
        setUploadSuccess(null);
      }, 3000);

    } catch (error) {
      console.error('Upload failed:', error);
      addToast('Upload failed. Please try again.', 'error');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const resetForm = () => {
    setFile(null);
    setProjectName('');
    setCategory('');
    setTeam('');
    setTagList([]);
    setTagInput('');
    setUploadProgress(0);
    setUploadSuccess(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const userInfo = userStorage.getUserInfo();
  if (!userInfo) {
    return <UserInfoModal />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Upload Document</h1>
          <p className="text-lg text-gray-600">Add documents to the knowledge base</p>
        </div>

        {/* Success State */}
        {uploadSuccess && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
              <div className="flex-1">
                <h3 className="font-semibold text-green-900 mb-2">Upload Successful!</h3>
                <div className="text-sm text-green-800 space-y-1">
                  <p><strong>Document:</strong> {uploadSuccess.fileName}</p>
                  <p><strong>Project:</strong> {uploadSuccess.projectName}</p>
                  {uploadSuccess.tags.length > 0 && (
                    <p><strong>Tags:</strong> {uploadSuccess.tags.join(', ')}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* File Upload Area */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div
              className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
                dragActive
                  ? 'border-blue-500 bg-blue-50 scale-[1.02]'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              } ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => !isUploading && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.docx,.txt,.xlsx,.pptx"
                className="hidden"
                disabled={isUploading}
              />

              {file ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="bg-blue-100 rounded-full p-4">
                      <FileText size={48} className="text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">{file.name}</p>
                    <p className="text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    disabled={isUploading}
                    className="mt-4"
                  >
                    <X size={16} className="mr-2" />
                    Remove File
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="bg-gray-100 rounded-full p-4">
                      <Upload size={48} className="text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold text-lg">
                      Drop your document here, or{' '}
                      <span className="text-blue-600 hover:text-blue-700 underline">
                        browse
                      </span>
                    </p>
                    <p className="text-gray-500 mt-2">
                      Supports PDF, Word, Text, Excel, and PowerPoint files (max 10MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Document Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <FolderOpen className="h-5 w-5 mr-2 text-gray-600" />
              Document Details
            </h2>
            
            <div className="space-y-6">
              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name"
                  disabled={isUploading}
                  required
                  className="text-base py-3"
                />
              </div>

              {/* Category and Team */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                    disabled={isUploading}
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="marketing">Marketing</option>
                    <option value="sales">Sales</option>
                    <option value="product">Product</option>
                    <option value="research">Research</option>
                    <option value="strategy">Strategy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={team}
                    onChange={(e) => setTeam(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                    disabled={isUploading}
                    required
                  >
                    <option value="">Select a team</option>
                    <option value="marketing">Marketing Team</option>
                    <option value="sales">Sales Team</option>
                    <option value="product">Product Team</option>
                    <option value="research">Research Team</option>
                    <option value="executive">Executive Team</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="h-4 w-4 inline mr-1" />
                  Tags
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagInputKeyDown}
                      placeholder="Add tags (press Enter or comma to add)"
                      disabled={isUploading}
                      className="flex-1 text-base py-3"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddTag}
                      disabled={isUploading || !tagInput.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {tagList.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tagList.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-blue-600 hover:text-blue-800"
                            disabled={isUploading}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Add tags to help organize and find documents easily
                </p>
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                    <span className="text-gray-700 font-medium">Uploading document...</span>
                  </div>
                  <span className="text-gray-900 font-bold text-lg">{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  >
                    <div className="h-full bg-white bg-opacity-30 animate-pulse"></div>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Processing and extracting content from your document...
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isUploading || !file}
              className="px-12 py-4 text-lg font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Document
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Info Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
          <div className="flex items-start">
            <div className="bg-blue-100 rounded-full p-2 mr-4">
              <AlertCircle className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-3 text-lg">Document Processing</h3>
              <div className="text-blue-800 space-y-2">
                <p>
                  After upload, your document will be automatically processed to extract text content
                  and made searchable in the knowledge base.
                </p>
                <div className="bg-white bg-opacity-70 rounded-lg p-4 mt-3">
                  <h4 className="font-medium text-blue-900 mb-2">What happens next:</h4>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Text extraction and content analysis</li>
                    <li>Automatic categorization and tagging</li>
                    <li>Full-text search indexing</li>
                    <li>Available in search results within minutes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
