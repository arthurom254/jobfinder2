// app/page.js
"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { fetchFeaturedJobs, fetchCategories } from './lib/api';

export default function Home() {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    keywords: '',
    location: '',
    category: ''
  });

  useEffect(() => {
    async function loadData() {
      try {
        const jobsData = await fetchFeaturedJobs();
        const categoriesData = await fetchCategories();
        
        setFeaturedJobs(jobsData.featured_jobs || []);
        setCategories(categoriesData.categories || []);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Redirect to jobs page with search parameters
    const params = new URLSearchParams();
    if (searchParams.keywords) params.append('keyword', searchParams.keywords);
    if (searchParams.location) params.append('location', searchParams.location);
    if (searchParams.category) params.append('category', searchParams.category);
    
    window.location.href = `/jobs?${params.toString()}`;
  };

  return (
    <>
      <main className="flex-grow">
        <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
                Find Your Dream Developer Job
              </h1>
              <p className="mt-3 max-w-md mx-auto text-lg sm:text-xl md:mt-5 md:max-w-3xl">
                Connect with top tech companies and startups looking for talented developers like you.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/jobs" className="px-8 py-3 bg-white text-primary font-medium rounded-md shadow hover:bg-gray-100">
                  Browse Jobs
                </Link>
                <Link href="/post-job" className="px-8 py-3 bg-primary-dark text-white font-medium rounded-md shadow border border-white hover:bg-primary">
                  Post a Job
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Job search form */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" onSubmit={handleSearchSubmit}>
              <div>
                <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">Keywords</label>
                <input 
                  type="text" 
                  name="keywords" 
                  id="keywords" 
                  value={searchParams.keywords}
                  onChange={handleInputChange}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" 
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                <input 
                  type="text" 
                  name="location" 
                  id="location" 
                  value={searchParams.location}
                  onChange={handleInputChange}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" 
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                <select 
                  id="category" 
                  name="category" 
                  value={searchParams.category}
                  onChange={handleInputChange}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                >
                  <option value="">All Categories</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button type="submit" className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  Search Jobs
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Featured jobs section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-gray-900">Featured Jobs</h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredJobs.length > 0 ? (
                featuredJobs.map(job => (
                  <div key={job.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        {job.is_remote && (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Remote</span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm mt-1">{job.company_name}</p>
                      <p className="text-gray-600 mt-3 line-clamp-3">{job.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        {(job.min_salary || job.max_salary) && (
                          <span className="text-primary font-medium">
                            {job.min_salary && `$${job.min_salary.toLocaleString()}`}
                            {job.min_salary && job.max_salary && ' - '}
                            {job.max_salary && `$${job.max_salary.toLocaleString()}`}
                          </span>
                        )}
                        <span className="text-gray-500 text-sm">
                          Posted {new Date(job.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="px-6 py-3 bg-gray-50 flex justify-between items-center">
                      <div className="flex flex-wrap gap-2">
                        {job.skills.slice(0, 2).map((skill, index) => (
                          <span key={index} className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 2 && (
                          <span className="inline-flex items-center bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded">
                            +{job.skills.length - 2}
                          </span>
                        )}
                      </div>
                      <Link href={`/jobs/${job.id}`} className="text-primary hover:text-primary-dark font-medium">
                        View Job
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No featured jobs available at the moment.
                </div>
              )}
            </div>
          )}
          <div className="mt-8 text-center">
            <Link href="/jobs" className="inline-flex items-center px-4 py-2 border border-primary text-primary bg-white hover:bg-primary hover:text-white rounded-md">
              View All Jobs
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>
        
        {/* How it works section */}
        <section className="bg-gray-100 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900">How It Works</h2>
            <div className="mt-10 grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-12 h-12 mx-auto bg-primary-light rounded-full flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-medium text-gray-900">Find Jobs</h3>
                <p className="mt-2 text-gray-600">Search and filter through thousands of developer job listings that
                  match your skills and preferences.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-12 h-12 mx-auto bg-primary-light rounded-full flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z">
                    </path>
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-medium text-gray-900">Apply</h3>
                <p className="mt-2 text-gray-600">Submit your application confidentially and get noticed for your
                  skills, not your background.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-12 h-12 mx-auto bg-primary-light rounded-full flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-medium text-gray-900">Get Hired</h3>
                <p className="mt-2 text-gray-600">Connect with employers who value your skills and land your dream
                  developer position.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}