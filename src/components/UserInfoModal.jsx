import React, { useState } from 'react';
import { X, User, Mail, Phone } from 'lucide-react';
import { apiClient } from '../services/api';
import { userStorage } from '../utils/userStorage';

const UserInfoModal = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation - ensure fields are not empty
    if (!formData.name.trim() || !formData.email.trim() || !formData.mobile.trim()) {
      setError('All fields are required');
      return;
    }

    setIsSubmitting(true);

    try {
      // Send to backend using apiClient
      console.log('API_BASE_URL:', apiClient.defaults.baseURL);
      const response = await apiClient.post('/users/register', formData);
      const result = response.data;

      if (response.status === 200 && result.user) {
        // Save to localStorage with user ID
        const userInfoWithId = {
          ...formData,
          id: result.user.id,
          userId: result.user.id
        };
        
        userStorage.saveUserInfo(userInfoWithId);
        
        // Reload page to hide modal and allow access
        window.location.reload();
      } else {
        setError(result.error?.message || result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">User Information</h2>
          <button
            className="text-gray-400 hover:text-gray-600"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your full name"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email address"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your mobile number"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Information'}
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          This information is required to access the knowledge base
        </p>
      </div>
    </div>
  );
};

export default UserInfoModal;
