'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

function JobDetailPage({ params }) {
  const { id } = React.use(params);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`/api/jobs/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch job details');
        }
        
        const data = await response.json();
        setJob(data.job);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchJobDetails();
  }, [id]);

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Not disclosed';
    if (min && !max) return `$${min}k+`;
    if (!min && max) return `Up to $${max}k`;
    return `$${min}k - $${max}k`;
  };
  
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return 'Recently';
    }
  };

  const handleApply = () => {
    if (job?.application_url) {
      window.open(job.application_url, '_blank');
    } else {
      // Handle application through the platform
      console.log('Applying through platform');
      // Could implement application modal or redirect to application form
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-red-50 p-4 rounded-md">
          <h2 className="text-lg font-medium text-red-800">Error loading job</h2>
          <p className="mt-2 text-sm text-red-700">{error}</p>
          <div className="mt-4">
            <button
              onClick={() => router.push('/jobs')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Back to all jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-yellow-50 p-4 rounded-md">
          <h2 className="text-lg font-medium text-yellow-800">Job not found</h2>
          <p className="mt-2 text-sm text-yellow-700">The job you're looking for doesn't exist or has been removed.</p>
          <div className="mt-4">
            <button
              onClick={() => router.push('/jobs')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Browse all jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-5" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="text-gray-700 hover:text-primary">Home</Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <Link href="/jobs" className="ml-1 text-gray-700 hover:text-primary md:ml-2">Jobs</Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-1 text-gray-500 md:ml-2">{job.title}</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Job Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                    <p className="text-gray-500 mt-1">{job.company_name}</p>
                  </div>
                  {job.is_remote && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Remote</span>
                  )}
                </div>

                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <h3 className="text-sm text-gray-500">Salary</h3>
                    <p className="font-medium text-primary">{formatSalary(job.min_salary, job.max_salary)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500">Job Type</h3>
                    <p className="font-medium">{job.job_type}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500">Experience</h3>
                    <p className="font-medium">{job.experience_level}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500">Posted</h3>
                    <p className="font-medium">{formatDate(job.created_at)}</p>
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="text-lg font-medium text-gray-900">Job Description</h2>
                  <div className="mt-3 text-gray-600 prose max-w-none">
                    {/* Use a sanitized HTML renderer or convert the description to Markdown */}
                    <div dangerouslySetInnerHTML={{ __html: job.description.replace(/\n/g, '<br />') }} />
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="text-lg font-medium text-gray-900">Skills &amp; Technologies</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {job.skills && job.skills.map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Apply for this job</h2>
              <p className="text-gray-600 mb-6">
                Applications are anonymous. Your profile information will only be
                shared if you're selected by the employer.
              </p>

              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleApply(); }}>
                <div>
                  <label htmlFor="resume" className="block text-sm font-medium text-gray-700">Resume/CV</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none">
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 5MB</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="cover-letter" className="block text-sm font-medium text-gray-700">
                    Cover Letter (optional)
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="cover-letter"
                      name="cover-letter"
                      rows={4}
                      className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Why are you a good fit for this role?"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark"
                  >
                    {job.application_url ? 'Apply on Company Website' : 'Apply Now'}
                  </button>
                </div>
              </form>

              <div className="mt-6 border-t border-gray-200 pt-4">
                <button
                  type="button"
                  className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                  Save Job
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default JobDetailPage;