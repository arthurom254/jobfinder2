'use client'

import Link from 'next/link'
import React, { useState, useEffect } from 'react'

function page() {
    // State for jobs data
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [totalJobs, setTotalJobs] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    
    // State for filters
    const [searchParams, setSearchParams] = useState({
        keyword: '',
        location: '',
        job_type: [],
        experience: [],
        skills: []
    })
    
    // State for form inputs
    const [keywordInput, setKeywordInput] = useState('')
    const [locationInput, setLocationInput] = useState('')

    // Fetch jobs from API
    const fetchJobs = async (page = 1) => {
        try {
            setLoading(true)
            
            // Build query parameters
            const params = new URLSearchParams()
            params.append('page', page)
            
            if (searchParams.keyword) params.append('keyword', searchParams.keyword)
            if (searchParams.location) params.append('location', searchParams.location)
            
            searchParams.job_type.forEach(type => {
                params.append('job_type', type)
            })
            
            searchParams.experience.forEach(exp => {
                params.append('experience', exp)
            })
            
            searchParams.skills.forEach(skill => {
                params.append('skills', skill)
            })
            
            const response = await fetch(`/api/jobs?${params.toString()}`)
            
            if (!response.ok) {
                throw new Error('Failed to fetch jobs')
            }
            
            const data = await response.json()
            setJobs(data.jobs)
            setTotalJobs(data.total)
            setTotalPages(data.pages)
            setCurrentPage(data.current_page)
            setLoading(false)
        } catch (err) {
            setError(err.message)
            setLoading(false)
        }
    }

    // Handle search form submission
    const handleSearch = (e) => {
        e.preventDefault()
        setSearchParams({
            ...searchParams,
            keyword: keywordInput,
            location: locationInput
        })
    }

    // Handle checkbox changes for filters
    const handleFilterChange = (filterType, value) => {
        setSearchParams(prevParams => {
            const currentValues = [...prevParams[filterType]]
            
            if (currentValues.includes(value)) {
                // Remove if already selected
                return {
                    ...prevParams,
                    [filterType]: currentValues.filter(item => item !== value)
                }
            } else {
                // Add if not selected
                return {
                    ...prevParams,
                    [filterType]: [...currentValues, value]
                }
            }
        })
    }

    // Apply all filters
    const applyFilters = () => {
        fetchJobs(1) // Reset to first page when applying filters
    }

    // Handle pagination
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage)
        }
    }

    // Initial data fetch
    useEffect(() => {
        fetchJobs(currentPage)
    }, [currentPage])

    // Refetch when search params change
    useEffect(() => {
        fetchJobs(1)
    }, [searchParams])

    return (
        <div>
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900">Browse Jobs</h1>
                {/* Search and Filter */}
                <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                    <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleSearch}>
                        <div>
                            <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">Keywords</label>
                            <input 
                                type="text" 
                                name="keywords" 
                                id="keywords" 
                                value={keywordInput}
                                onChange={(e) => setKeywordInput(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" 
                            />
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                            <input 
                                type="text" 
                                name="location" 
                                id="location" 
                                value={locationInput}
                                onChange={(e) => setLocationInput(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" 
                            />
                        </div>
                        <div className="flex items-end">
                            <button type="submit" className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                Search
                            </button>
                        </div>
                    </form>
                </div>
                {/* Filter Sidebar + Job Listings */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="font-medium text-lg text-gray-900 mb-4">Filters</h2>
                            {/* Job Type Filter */}
                            <div className="mb-6">
                                <h3 className="font-medium text-gray-700 mb-2">Job Type</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <input 
                                            id="full-time" 
                                            name="job-type" 
                                            type="checkbox" 
                                            checked={searchParams.job_type.includes('Full-time')}
                                            onChange={() => handleFilterChange('job_type', 'Full-time')}
                                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" 
                                        />
                                        <label htmlFor="full-time" className="ml-2 text-sm text-gray-700">Full-time</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input 
                                            id="part-time" 
                                            name="job-type" 
                                            type="checkbox" 
                                            checked={searchParams.job_type.includes('Part-time')}
                                            onChange={() => handleFilterChange('job_type', 'Part-time')}
                                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" 
                                        />
                                        <label htmlFor="part-time" className="ml-2 text-sm text-gray-700">Part-time</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input 
                                            id="contract" 
                                            name="job-type" 
                                            type="checkbox" 
                                            checked={searchParams.job_type.includes('Contract')}
                                            onChange={() => handleFilterChange('job_type', 'Contract')}
                                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" 
                                        />
                                        <label htmlFor="contract" className="ml-2 text-sm text-gray-700">Contract</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input 
                                            id="freelance" 
                                            name="job-type" 
                                            type="checkbox" 
                                            checked={searchParams.job_type.includes('Freelance')}
                                            onChange={() => handleFilterChange('job_type', 'Freelance')}
                                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" 
                                        />
                                        <label htmlFor="freelance" className="ml-2 text-sm text-gray-700">Freelance</label>
                                    </div>
                                </div>
                            </div>
                            {/* Experience Level Filter */}
                            <div className="mb-6">
                                <h3 className="font-medium text-gray-700 mb-2">Experience Level</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <input 
                                            id="entry" 
                                            name="experience" 
                                            type="checkbox" 
                                            checked={searchParams.experience.includes('Entry')}
                                            onChange={() => handleFilterChange('experience', 'Entry')}
                                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" 
                                        />
                                        <label htmlFor="entry" className="ml-2 text-sm text-gray-700">Entry Level</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input 
                                            id="mid" 
                                            name="experience" 
                                            type="checkbox" 
                                            checked={searchParams.experience.includes('Mid')}
                                            onChange={() => handleFilterChange('experience', 'Mid')}
                                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" 
                                        />
                                        <label htmlFor="mid" className="ml-2 text-sm text-gray-700">Mid Level</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input 
                                            id="senior" 
                                            name="experience" 
                                            type="checkbox" 
                                            checked={searchParams.experience.includes('Senior')}
                                            onChange={() => handleFilterChange('experience', 'Senior')}
                                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" 
                                        />
                                        <label htmlFor="senior" className="ml-2 text-sm text-gray-700">Senior Level</label>
                                    </div>
                                </div>
                            </div>
                            {/* Skills Filter */}
                            <div>
                                <h3 className="font-medium text-gray-700 mb-2">Skills</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <input 
                                            id="javascript" 
                                            name="skills" 
                                            type="checkbox" 
                                            checked={searchParams.skills.includes('javascript')}
                                            onChange={() => handleFilterChange('skills', 'javascript')}
                                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" 
                                        />
                                        <label htmlFor="javascript" className="ml-2 text-sm text-gray-700">JavaScript</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input 
                                            id="python" 
                                            name="skills" 
                                            type="checkbox" 
                                            checked={searchParams.skills.includes('python')}
                                            onChange={() => handleFilterChange('skills', 'python')}
                                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" 
                                        />
                                        <label htmlFor="python" className="ml-2 text-sm text-gray-700">Python</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input 
                                            id="react" 
                                            name="skills" 
                                            type="checkbox" 
                                            checked={searchParams.skills.includes('react')}
                                            onChange={() => handleFilterChange('skills', 'react')}
                                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" 
                                        />
                                        <label htmlFor="react" className="ml-2 text-sm text-gray-700">React</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input 
                                            id="nodejs" 
                                            name="skills" 
                                            type="checkbox" 
                                            checked={searchParams.skills.includes('nodejs')}
                                            onChange={() => handleFilterChange('skills', 'nodejs')}
                                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" 
                                        />
                                        <label htmlFor="nodejs" className="ml-2 text-sm text-gray-700">Node.js</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input 
                                            id="sql" 
                                            name="skills" 
                                            type="checkbox" 
                                            checked={searchParams.skills.includes('sql')}
                                            onChange={() => handleFilterChange('skills', 'sql')}
                                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" 
                                        />
                                        <label htmlFor="sql" className="ml-2 text-sm text-gray-700">SQL</label>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6">
                                <button 
                                    type="button" 
                                    className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark"
                                    onClick={applyFilters}
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Job Listings */}
                    <div className="lg:col-span-3 space-y-6">
                        {loading ? (
                            <div className="bg-white rounded-lg shadow-md p-6 text-center">
                                <p>Loading jobs...</p>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 rounded-lg shadow-md p-6 text-center">
                                <p className="text-red-600">Error: {error}</p>
                            </div>
                        ) : jobs.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-md p-6 text-center">
                                <p>No jobs found matching your criteria.</p>
                            </div>
                        ) : (
                            jobs.map(job => (
                                <div key={job.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="p-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                                            {job.is_remote && (
                                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Remote</span>
                                            )}
                                        </div>
                                        <p className="text-gray-500 text-sm mt-1">{job.company_name}</p>
                                        <p className="text-gray-600 mt-3">{job.description}</p>
                                        <div className="mt-4 flex items-center justify-between">
                                            {job.min_salary && job.max_salary ? (
                                                <span className="text-primary font-medium">${job.min_salary}k - ${job.max_salary}k</span>
                                            ) : (
                                                <span className="text-gray-500">Salary not specified</span>
                                            )}
                                            <span className="text-gray-500 text-sm">
                                                Posted {new Date(job.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="px-6 py-3 bg-gray-50 flex justify-between items-center">
                                        <div className="flex space-x-2">
                                            {job.skills.slice(0, 2).map((skill, index) => (
                                                <span key={index} className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                                                    {skill}
                                                </span>
                                            ))}
                                            {job.skills.length > 2 && (
                                                <span className="inline-flex items-center bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded">
                                                    +{job.skills.length - 2} more
                                                </span>
                                            )}
                                        </div>
                                        <Link href={`/jobs/${job.id}`} className="text-primary hover:text-primary-dark font-medium">View Job</Link>
                                    </div>
                                </div>
                            ))
                        )}
                        
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-8">
                                <nav className="inline-flex rounded-md shadow">
                                    <button 
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`py-2 px-4 bg-white border border-gray-300 text-sm font-medium ${currentPage === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        Previous
                                    </button>
                                    
                                    {/* Generate page numbers */}
                                    {[...Array(totalPages).keys()].map(pageNum => (
                                        <button 
                                            key={pageNum + 1}
                                            onClick={() => handlePageChange(pageNum + 1)}
                                            className={`py-2 px-4 border text-sm font-medium ${
                                                currentPage === pageNum + 1 
                                                ? 'bg-primary border-primary text-white' 
                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            {pageNum + 1}
                                        </button>
                                    ))}
                                    
                                    <button 
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`py-2 px-4 bg-white border border-gray-300 text-sm font-medium ${currentPage === totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default page