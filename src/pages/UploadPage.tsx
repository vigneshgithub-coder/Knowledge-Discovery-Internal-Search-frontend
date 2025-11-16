import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { uploadDocument } from '../services/api';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useToast } from '../components/Toast';
import { validateProjectName, validateTags } from '../utils/validation';
import { formatFileSize } from '../utils/formatters';
import UserInfoModal from '../components/UserInfoModal';
import { userInfoExists } from '../utils/userInfo';

export function UploadPage() {
  const [projectName, setProjectName] = useState('');
  const [tags, setTags] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ projectName?: string; tags?: string; file?: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const handleFileSelect = (file: File) => {
    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      setErrors((e) => ({
        ...e,
        file: `File size must be less than ${formatFileSize(maxSize)}`,
      }));
      return;
    }

    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      setErrors((e) => ({
        ...e,
        file: 'Only PDF, DOCX, and TXT files are allowed',
      }));
      return;
    }

    setSelectedFile(file);
    setErrors((e) => ({ ...e, file: undefined }));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};

    const projectValidation = validateProjectName(projectName);
    if (!projectValidation.valid) {
      newErrors.projectName = projectValidation.error;
    }

    const tagsValidation = validateTags(tags);
    if (!tagsValidation.valid) {
      newErrors.tags = tagsValidation.error;
    }

    if (!selectedFile) {
      newErrors.file = 'Please select a file to upload';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);

    try {
      await uploadDocument(selectedFile!, projectName, tags);

      addToast(`Document "${selectedFile!.name}" uploaded successfully!`, 'success');
      setProjectName('');
      setTags('');
      setSelectedFile(null);
      setUploadProgress(0);
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Upload failed. Please try again.';
      addToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Block UI until user info is provided
  if (!userInfoExists()) {
    return <UserInfoModal />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Documents</h1>
        <p className="text-gray-600">Upload PDF, DOCX, or TXT files for semantic search and analysis.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
          <Input
            value={projectName}
            onChange={(e) => {
              setProjectName(e.target.value);
              setErrors((err) => ({ ...err, projectName: undefined }));
            }}
            placeholder="e.g., Financial Analysis Q4"
            error={errors.projectName}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags (optional)</label>
          <Input
            value={tags}
            onChange={(e) => {
              setTags(e.target.value);
              setErrors((err) => ({ ...err, tags: undefined }));
            }}
            placeholder="e.g., finance, Q4, 2024"
            error={errors.tags}
          />
          <p className="text-xs text-gray-500 mt-1">Separate tags with commas. Max 10 tags.</p>
        </div>

        <div className="mb-6">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
              selectedFile
                ? 'border-green-300 bg-green-50'
                : 'border-gray-300 bg-gray-50 hover:border-gray-400'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            {selectedFile ? (
              <div className="flex items-center justify-center gap-3">
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-sm text-gray-600">{formatFileSize(selectedFile.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="font-medium text-gray-900 mb-1">Drop file here or click to select</p>
                <p className="text-sm text-gray-600">Supports PDF, DOCX, and TXT (max 10MB)</p>
              </>
            )}
          </div>
          {errors.file && <p className="text-sm text-red-600 mt-2">{errors.file}</p>}
        </div>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">{uploadProgress}% uploaded</p>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          loading={isLoading}
          className="w-full"
        >
          Upload Document
        </Button>
      </form>
    </div>
  );
}
