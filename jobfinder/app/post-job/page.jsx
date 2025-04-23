'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function JobPostingPage() {
  const router = useRouter();
  
  // State Management
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [notification, setNotification] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    job_title: '',
    company_name: '',
    location: '',
    job_type: 'full-time',
    category: 'Frontend Development',
    experience: 'entry',
    min_salary: '',
    max_salary: '',
    description: '',
    skills: '',
    application_url: '',
    plan: 'basic'
  });

  // Check authentication and load user data
  useEffect(() => {
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem('user');
        const userToken = localStorage.getItem('token');
        if (!userData) {
            router.push('/login?redirect=/jobs/post');
            console.log("404!")
            return;
        }
        
        const parsedUser = JSON.parse(userData);
        parsedUser.token = userToken;
        setUser(parsedUser);
        // Check if user is an employer
        if (!parsedUser.isEmployer) {
          showNotification('Only employers can post jobs', 'error');
          setTimeout(() => {
            router.push('/');
          }, 3000);
          return;
        }
        
        // Load saved draft if available
        loadDraft();
        
        // If company name is available from user data, set it
        if (parsedUser.company_name) {
          setFormData(prev => ({
            ...prev,
            company_name: parsedUser.company_name || ''
          }));
        }
      } catch (error) {
        console.error('Authentication error:', error);
        showNotification('Session error. Please log in again.', 'error');
      }
    };
    
    checkAuth();
  }, [router]);

  // Load draft from local storage
  const loadDraft = () => {
    try {
      const savedDraft = localStorage.getItem('jobDraft');
      if (savedDraft) {
        const parsedDraft = JSON.parse(savedDraft);
        setFormData(parsedDraft);
        showNotification('Draft loaded successfully', 'info', 3000);
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  };

  // Save draft to local storage
  const saveDraft = () => {
    try {
      localStorage.setItem('jobDraft', JSON.stringify(formData));
      setIsDraftSaved(true);
      showNotification('Draft saved successfully', 'success', 3000);
      
      // Reset saved flag after 3 seconds
      setTimeout(() => {
        setIsDraftSaved(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving draft:', error);
      showNotification('Failed to save draft', 'error');
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Clear validation error when field is changed
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
    
    setFormData({
      ...formData,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    });
  };

  // Validate form data
  const validateForm = () => {
    const errors = {};
    
    // Required fields
    if (!formData.job_title.trim()) errors.job_title = 'Job title is required';
    if (!formData.company_name.trim()) errors.company_name = 'Company name is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.description.trim()) errors.description = 'Job description is required';
    
    // Salary validation
    if (formData.min_salary && formData.max_salary && 
        Number(formData.min_salary) > Number(formData.max_salary)) {
      errors.min_salary = 'Minimum salary cannot be greater than maximum salary';
    }
    
    // URL validation
    if (formData.application_url && 
        !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(formData.application_url)) {
      errors.application_url = 'Please enter a valid URL';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      showNotification('Please fix the errors in the form', 'error');
      // Scroll to first error
      const firstErrorField = document.querySelector('.error-message');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    // Check authentication
    console.log(user)
    if (!user || !user.token) {
      showNotification('You must be logged in to post a job', 'error');
      router.push('/login?redirect=/jobs/post');
      console.log("403!")
      return;
    }
    
    setIsLoading(true);
    showNotification('Submitting your job posting...', 'info');
    
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Error posting job');
      }
      
      // Clear draft after successful submission
      localStorage.removeItem('jobDraft');
      
      showNotification('Job posted successfully!', 'success');
      
      // Redirect to the job detail page
      setTimeout(() => {
        router.push(`/jobs/${data.job_id}`);
      }, 2000);
    } catch (error) {
      console.error('Error posting job:', error);
      showNotification(error.message || 'Failed to post job', 'error');
      setIsLoading(false);
    }
  };

  // Display notification
  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type });
    
    if (duration) {
      setTimeout(() => {
        setNotification(null);
      }, duration);
    }
  };

  // Helper to render form field with error message
  const renderField = (label, name, type = 'text', options = null, placeholder = '', required = true) => {
    const hasError = formErrors[name];
    
    return (
      <div>
        <label 
          htmlFor={name} 
          className="block text-sm font-medium text-gray-700"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="mt-1">
          {type === 'select' ? (
            <select
              id={name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className={`block w-full rounded-md border ${hasError ? 'border-red-300' : 'border-gray-300'} 
                         px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm`}
              required={required}
            >
              {options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : type === 'textarea' ? (
            <textarea
              id={name}
              name={name}
              rows={8}
              value={formData[name]}
              onChange={handleChange}
              placeholder={placeholder}
              className={`block w-full rounded-md border ${hasError ? 'border-red-300' : 'border-gray-300'} 
                        px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm`}
              required={required}
            />
          ) : (
            <input
              type={type}
              id={name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              placeholder={placeholder}
              className={`block w-full rounded-md border ${hasError ? 'border-red-300' : 'border-gray-300'} 
                        px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm`}
              required={required}
            />
          )}
        </div>
        {hasError && (
          <p className="mt-1 text-sm text-red-600 error-message">{hasError}</p>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
          <p className="mt-2 text-gray-600">
            Connect with top talent by creating a detailed job posting
          </p>
        </div>
        
        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-md ${
            notification.type === 'success' ? 'bg-green-50 text-green-800' :
            notification.type === 'error' ? 'bg-red-50 text-red-800' :
            'bg-blue-50 text-blue-800'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {notification.type === 'success' && (
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {notification.type === 'error' && (
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                {notification.type === 'info' && (
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 sm:p-8">
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Job Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderField('Job Title', 'job_title', 'text', null, 'e.g. Senior Frontend Developer')}
                  {renderField('Company Name', 'company_name', 'text', null, 'e.g. Acme Inc.')}
                  {renderField('Location', 'location', 'text', null, 'City, Country or Remote')}
                  {renderField('Job Type', 'job_type', 'select', [
                    { value: 'full-time', label: 'Full-time' },
                    { value: 'part-time', label: 'Part-time' },
                    { value: 'contract', label: 'Contract' },
                    { value: 'freelance', label: 'Freelance' },
                    { value: 'internship', label: 'Internship' }
                  ])}
                  {renderField('Category', 'category', 'select', [
                    { value: 'Frontend Development', label: 'Frontend Development' },
                    { value: 'Backend Development', label: 'Backend Development' },
                    { value: 'Full Stack Development', label: 'Full Stack Development' },
                    { value: 'Mobile Development', label: 'Mobile Development' },
                    { value: 'DevOps', label: 'DevOps' },
                    { value: 'Data Science / Analytics', label: 'Data Science / Analytics' },
                    { value: 'UI/UX Design', label: 'UI/UX Design' },
                    { value: 'Other', label: 'Other' }
                  ])}
                  {renderField('Experience Level', 'experience', 'select', [
                    { value: 'entry', label: 'Entry Level' },
                    { value: 'mid', label: 'Mid Level' },
                    { value: 'senior', label: 'Senior Level' },
                    { value: 'lead', label: 'Lead / Manager' }
                  ])}
                </div>
              </div>
              
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Salary & Requirements</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Salary Range (USD)
                    </label>
                    <div className="mt-1 grid grid-cols-2 gap-4">
                      <div>
                        <input 
                          type="number"
                          name="min_salary"
                          id="min_salary"
                          placeholder="Min (e.g. 40000)"
                          value={formData.min_salary}
                          onChange={handleChange}
                          className={`block w-full rounded-md border ${formErrors.min_salary ? 'border-red-300' : 'border-gray-300'} 
                                   px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm`}
                        />
                        {formErrors.min_salary && (
                          <p className="mt-1 text-sm text-red-600 error-message">{formErrors.min_salary}</p>
                        )}
                      </div>
                      <div>
                        <input 
                          type="number"
                          name="max_salary"
                          id="max_salary"
                          placeholder="Max (e.g. 80000)"
                          value={formData.max_salary}
                          onChange={handleChange}
                          className={`block w-full rounded-md border ${formErrors.max_salary ? 'border-red-300' : 'border-gray-300'} 
                                   px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm`}
                        />
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Providing a salary range increases applications by up to 30%
                    </p>
                  </div>
                  
                  {renderField('Required Skills', 'skills', 'text', null, 'e.g. JavaScript, React, Node.js (comma separated)', false)}
                  
                  {renderField('Job Description', 'description', 'textarea', null, 'Detail the role, responsibilities, requirements, and benefits')}
                  
                  {renderField('External Application URL', 'application_url', 'text', null, 'https://...', false)}
                  <p className="text-sm text-gray-500 -mt-4">
                    If provided, applicants will be redirected to this URL instead of applying through our platform
                  </p>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Posting Plan</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Choose a plan that helps your job get the right visibility
                </p>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Basic Plan */}
                  <div className={`relative rounded-lg border ${formData.plan === 'basic' ? 'border-primary-dark ring-2 ring-primary' : 'border-gray-300'} p-5`}>
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="plan-basic"
                          name="plan"
                          type="radio"
                          value="basic"
                          checked={formData.plan === 'basic'}
                          onChange={handleChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                        />
                      </div>
                      <div className="ml-3 flex-grow">
                        <label htmlFor="plan-basic" className="text-sm font-medium text-gray-900 flex justify-between">
                          <span>Basic</span> 
                          <span>$99</span>
                        </label>
                        <p className="text-sm text-gray-500">30 days listing</p>
                      </div>
                    </div>
                    <ul className="mt-4 space-y-2">
                      <li className="flex items-center text-sm text-gray-600">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Standard job listing
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Email notifications
                      </li>
                    </ul>
                  </div>
                  
                  {/* Premium Plan */}
                  <div className={`relative rounded-lg border ${formData.plan === 'premium' ? 'border-primary-dark ring-2 ring-primary' : 'border-gray-300'} p-5`}>
                    {formData.plan === 'premium' && (
                      <div className="absolute -top-2 -right-2 bg-primary text-white text-xs font-medium px-2 py-0.5 rounded">
                        Selected
                      </div>
                    )}
                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-medium px-2 py-0.5 rounded">
                      Popular
                    </div>
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="plan-premium"
                          name="plan"
                          type="radio"
                          value="premium"
                          checked={formData.plan === 'premium'}
                          onChange={handleChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                        />
                      </div>
                      <div className="ml-3 flex-grow">
                        <label htmlFor="plan-premium" className="text-sm font-medium text-gray-900 flex justify-between">
                          <span>Premium</span> 
                          <span>$199</span>
                        </label>
                        <p className="text-sm text-gray-500">30 days featured listing</p>
                      </div>
                    </div>
                    <ul className="mt-4 space-y-2">
                      <li className="flex items-center text-sm text-gray-600">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Featured on homepage
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Highlighted in search results
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Email notifications
                      </li>
                    </ul>
                  </div>
                  
                  {/* Enterprise Plan */}
                  <div className={`relative rounded-lg border ${formData.plan === 'enterprise' ? 'border-primary-dark ring-2 ring-primary' : 'border-gray-300'} p-5`}>
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="plan-enterprise"
                          name="plan"
                          type="radio"
                          value="enterprise"
                          checked={formData.plan === 'enterprise'}
                          onChange={handleChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                        />
                      </div>
                      <div className="ml-3 flex-grow">
                        <label htmlFor="plan-enterprise" className="text-sm font-medium text-gray-900 flex justify-between">
                          <span>Enterprise</span> 
                          <span>$399</span>
                        </label>
                        <p className="text-sm text-gray-500">60 days featured listing</p>
                      </div>
                    </div>
                    <ul className="mt-4 space-y-2">
                      <li className="flex items-center text-sm text-gray-600">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        All Premium features
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Social media promotion
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Priority candidate access
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={saveDraft}
                  disabled={isLoading}
                  className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium 
                           ${isDraftSaved ? 'bg-green-50 text-green-700' : 'bg-white text-gray-700 hover:bg-gray-50'} 
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
                >
                  {isDraftSaved ? (
                    <>
                      <svg className="mr-1.5 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Saved
                    </>
                  ) : (
                    'Save as Draft'
                  )}
                </button>
                <Link
                  href="/jobs"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Posting Job...
                    </>
                  ) : (
                    'Post Job'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
               