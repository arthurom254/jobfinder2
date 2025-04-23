'use client';

import Link from 'next/link';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

export default function JobDetailPage({ params }) {
  const router = useRouter();
  const { id } = React.use(params);
  const fileInputRef = useRef(null);
  const fileNameRef = useRef(null);
  
  // State management
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationResult, setApplicationResult] = useState(null);
  
  // Fetch job details on component mount
  useEffect(() => {
    // Check if user is logged in
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      const userToken = localStorage.getItem('token');
      if (userData) {
        const parsedUser = JSON.parse(userData)
        parsedUser.token = userToken;
        setUser(parsedUser);
      }
    }
    
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/jobs/${id}`);
        
        if (!response.ok) {
          throw new Error(response.status === 404 
            ? 'Job not found' 
            : 'Failed to fetch job details');
        }
        
        const data = await response.json();
        setJob(data.job);
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobDetails();
  }, [id]);
  
  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume(file);
      if (fileNameRef.current) {
        fileNameRef.current.textContent = file.name;
      }
    }
  };
  
  // Handle application form submission
  const handleApply = async (e) => {
    e.preventDefault();
    
    if (!user) {
      // Redirect to login page with return URL
      const returnUrl = encodeURIComponent(`/jobs/${id}`);
      router.push(`/login?redirect=${returnUrl}`);
      return;
    }
    
    if (user.is_employer) {
      setApplicationResult({
        success: false,
        message: 'Employers cannot apply for jobs. Please use a job seeker account.'
      });
      return;
    }
    
    setIsSubmitting(true);
    setApplicationResult(null);
    
    try {
      const formData = new FormData();
      
      if (resume) {
        formData.append('resume', resume);
      }
      
      formData.append('cover_letter', coverLetter);
      
      const response = await fetch(`/api/jobs/${id}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error submitting application');
      }
      
      setApplicationResult({
        success: true,
        message: 'Your application has been submitted successfully!'
      });
      
      // Reset form
      setCoverLetter('');
      setResume(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (fileNameRef.current) fileNameRef.current.textContent = '';
      
    } catch (error) {
      console.error('Error applying for job:', error);
      setApplicationResult({
        success: false,
        message: error.message || 'Failed to submit application. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle external application
  const handleExternalApply = () => {
    if (job?.application_url) {
      window.open(job.application_url, '_blank');
    }
  };
  
  // Format salary for display
  const formatSalary = (min, max) => {
    if (!min && !max) return 'Not disclosed';
    if (min && !max) return `$${min.toLocaleString()}+`;
    if (!min && max) return `Up to $${max.toLocaleString()}`;
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };
  
  // Format date with relative time
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return 'Recently';
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-red-50 p-4 rounded-md">
          <h2 className="text-lg font-medium text-red-800">Error</h2>
          <p className="mt-2 text-sm text-red-700">{error}</p>
          <div className="mt-4">
            <button
              onClick={() => router.push('/jobs')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              View All Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Job not found state
  if (!job) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-yellow-50 p-4 rounded-md">
          <h2 className="text-lg font-medium text-yellow-800">Job Not Found</h2>
          <p className="mt-2 text-sm text-yellow-700">
            This job posting may have been removed or is no longer available.
          </p>
          <div className="mt-4">
            <button
              onClick={() => router.push('/jobs')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Browse All Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <main className="bg-gray-50">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="text-gray-700 hover:text-primary">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <Link href="/jobs" className="ml-1 text-gray-700 hover:text-primary md:ml-2">
                  Jobs
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-1 text-gray-500 md:ml-2 truncate max-w-xs">
                  {job.title}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Job Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Job Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                    <p className="text-gray-600 mt-1">{job.company_name}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-gray-500 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {job.location}
                      </span>
                      {job.is_remote && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Remote
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {job.is_featured && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
              </div>
              
              {/* Job Details */}
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Salary</h3>
                    <p className="mt-1 text-base font-medium text-primary">
                      {formatSalary(job.min_salary, job.max_salary)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Job Type</h3>
                    <p className="mt-1 text-base font-medium text-gray-900">
                      {job.job_type.charAt(0).toUpperCase() + job.job_type.slice(1)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Experience</h3>
                    <p className="mt-1 text-base font-medium text-gray-900">
                      {job.experience_level.charAt(0).toUpperCase() + job.experience_level.slice(1)} Level
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Posted</h3>
                    <p className="mt-1 text-base font-medium text-gray-900">
                      {formatDate(job.created_at)}
                    </p>
                  </div>
                </div>
                
                {/* Job Description */}
                <div className="mb-8">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Job Description</h2>
                  <div className="prose max-w-none text-gray-600">
                    <div dangerouslySetInnerHTML={{ 
                      __html: job.description.replace(/\n/g, '<br />') 
                    }} />
                  </div>
                </div>
                
                {/* Skills & Technologies */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Skills &amp; Technologies</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills && job.skills.map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                    {(!job.skills || job.skills.length === 0) && (
                      <p className="text-gray-500 italic">No specific skills listed</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Company Section */}
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">About {job.company_name}</h2>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-500">
                    {job.company_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{job.company_name}</h3>
                  <p className="text-gray-500">
                    {job.location}
                  </p>
                </div>
              </div>
              
              <div className="flex mt-6 space-x-4">
                <Link 
                  href={`/companies/${job.employer_id}`}
                  className="text-primary hover:text-primary-dark font-medium"
                >
                  View all jobs from this company
                </Link>
              </div>
            </div>
          </div>
          
          {/* Application Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Apply for this job</h2>
              
              {/* Application Result Message */}
              {applicationResult && (
                <div className={`mb-6 p-4 rounded-md ${
                  applicationResult.success ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <p className={`text-sm ${
                    applicationResult.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {applicationResult.message}
                  </p>
                </div>
              )}
              
              <p className="text-gray-600 mb-6">
                Your application will be sent directly to the employer. Make sure your 
                resume is up-to-date before applying.
              </p>
              
              {/* External Application Button */}
              {job.application_url ? (
                <div>
                  <button
                    onClick={handleExternalApply}
                    className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-primary-dark transition-colors font-medium flex items-center justify-center"
                  >
                    <span>Apply on Company Website</span>
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                  <p className="mt-2 text-xs text-center text-gray-500">
                    You'll be redirected to the company's application page
                  </p>
                </div>
              ) : (
                /* Direct Application Form */
                <form className="space-y-6" onSubmit={handleApply}>
                  {!user && (
                    <div className="bg-yellow-50 p-4 rounded-md mb-4">
                      <p className="text-sm text-yellow-700 font-medium">
                        You need to be logged in to apply
                      </p>
                      <div className="mt-3 flex flex-col sm:flex-row gap-2">
                        <Link 
                          href={`/login?redirect=/jobs/${id}`}
                          className="inline-block text-center bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark flex-1"
                        >
                          Login
                        </Link>
                        <Link 
                          href="/register"
                          className="inline-block text-center border border-gray-300 bg-white text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 flex-1"
                        >
                          Register
                        </Link>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
                      Resume/CV
                    </label>
                    <div className="mt-1 border-2 border-gray-300 border-dashed rounded-md px-6 pt-5 pb-6">
                      <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-600 justify-center">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none">
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              accept=".pdf,.doc,.docx"
                              onChange={handleFileChange}
                              ref={fileInputRef}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 5MB</p>
                        <p className="text-sm text-gray-800 font-medium mt-2" ref={fileNameRef}></p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="cover-letter" className="block text-sm font-medium text-gray-700 mb-1">
                      Cover Letter (optional)
                    </label>
                    <textarea
                      id="cover-letter"
                      name="cover-letter"
                      rows={4}
                      className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Why are you interested in this position?"
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting || !user}
                    className={`w-full py-3 px-4 rounded-md font-medium flex items-center justify-center transition-colors
                      ${!user 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-primary text-white hover:bg-primary-dark'}`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                </form>
              )}
              
              {/* Save Job Button */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                  Save Job
                </button>
              </div>
              
              {/* Share Job */}
              <div className="mt-4">
                <button
                  type="button"
                  className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                  Share Job
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Similar Jobs Section */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Similar Jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary">
              <p className="text-gray-500 text-sm mb-1">Similar jobs coming soon</p>
              <h3 className="text-lg font-medium text-gray-900">Browse more jobs</h3>
              <div className="mt-4">
                <Link 
                  href="/jobs" 
                  className="text-primary hover:text-primary-dark font-medium"
                >
                  View all jobs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}