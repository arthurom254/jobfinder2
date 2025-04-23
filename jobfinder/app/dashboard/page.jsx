"use client"
import React, { useState, useEffect } from 'react';

function page() {
    const [stats, setStats] = useState({
        active_jobs: 0,
        new_applications: 0,
        application_stats: {
            pending: 0,
            reviewed: 0,
            shortlisted: 0,
            rejected: 0
        }
    });
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem('token');
                
                if (!token) {
                    throw new Error('Not authenticated');
                }

                // Fetch stats
                const statsResponse = await fetch('/api/dashboard/stats', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!statsResponse.ok) {
                    throw new Error('Failed to fetch stats');
                }
                
                const statsData = await statsResponse.json();
                setStats(statsData);

                // Fetch recent jobs
                const jobsResponse = await fetch('/api/jobs?page=1&per_page=3', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!jobsResponse.ok) {
                    throw new Error('Failed to fetch jobs');
                }
                
                const jobsData = await jobsResponse.json();
                setJobs(jobsData.jobs);
                console.log(jobsData.jobs)
                // Fetch recent applications
                const applicationsResponse = await fetch('/api/applications?page=1&per_page=5', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!applicationsResponse.ok) {
                    throw new Error('Failed to fetch applications');
                }
                
                const applicationsData = await applicationsResponse.json();
                setApplications(applicationsData.applications);

            } catch (err) {
                setError(err.message);
                console.error('Error fetching dashboard data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Helper function to format date
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return new Intl.DateTimeFormat('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        }).format(date);
    };

    // Calculate days ago
    const getDaysAgo = (isoDate) => {
        const date = new Date(isoDate);
        const today = new Date();
        const diffTime = Math.abs(today - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return '1 day ago';
        return `${diffDays} days ago`;
    };

    // Status badge component
    const StatusBadge = ({ status }) => {
        const colors = {
            active: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            reviewed: 'bg-blue-100 text-blue-800',
            shortlisted: 'bg-purple-100 text-purple-800',
            rejected: 'bg-red-100 text-red-800'
        };
        
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-lg">Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-lg text-red-600">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex">
                {/* Main content */}
                <div className="flex flex-col flex-1">
                    <main className="flex-1">
                        <div className="py-6">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                            </div>
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                                {/* Stats */}
                                <div className="mt-6">
                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                        <div className="bg-white overflow-hidden shadow rounded-lg">
                                            <div className="px-4 py-5 sm:p-6">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 bg-primary rounded-md p-3">
                                                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-5 w-0 flex-1">
                                                        <dl>
                                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                                Active Job Listings
                                                            </dt>
                                                            <dd className="flex items-baseline">
                                                                <div className="text-2xl font-semibold text-gray-900">
                                                                    {stats?.active_jobs}
                                                                </div>
                                                            </dd>
                                                        </dl>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 px-4 py-4 sm:px-6">
                                                <div className="text-sm">
                                                    <a href="/jobs" className="font-medium text-primary hover:text-primary/50">
                                                        View all<span className="sr-only"> Active Job Listings</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white overflow-hidden shadow rounded-lg">
                                            <div className="px-4 py-5 sm:p-6">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 bg-primary rounded-md p-3">
                                                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-5 w-0 flex-1">
                                                        <dl>
                                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                                New Applications
                                                            </dt>
                                                            <dd className="flex items-baseline">
                                                                <div className="text-2xl font-semibold text-gray-900">
                                                                    {stats?.new_applications}
                                                                </div>
                                                            </dd>
                                                        </dl>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 px-4 py-4 sm:px-6">
                                                <div className="text-sm">
                                                    <a href="/applications" className="font-medium text-primary hover:text-primary/50">
                                                        View all<span className="sr-only"> New Applications</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white overflow-hidden shadow rounded-lg">
                                            <div className="px-4 py-5 sm:p-6">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 bg-primary rounded-md p-3">
                                                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-5 w-0 flex-1">
                                                        <dl>
                                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                                Shortlisted Candidates
                                                            </dt>
                                                            <dd className="flex items-baseline">
                                                                <div className="text-2xl font-semibold text-gray-900">
                                                                    {stats?.application_stats?.shortlisted}
                                                                </div>
                                                            </dd>
                                                        </dl>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 px-4 py-4 sm:px-6">
                                                <div className="text-sm">
                                                    <a href="/applications?status=shortlisted" className="font-medium text-primary hover:text-primary/50">
                                                        View all<span className="sr-only"> Shortlisted Candidates</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Recent Jobs */}
                                <div className="mt-8">
                                    <h2 className="text-lg font-medium text-gray-900">Recent Jobs</h2>
                                    <div className="mt-4 bg-white shadow overflow-hidden rounded-md">
                                        <ul className="divide-y divide-gray-200">
                                            {jobs?.length > 0 ? (
                                                jobs.map(job => (
                                                    <li key={job.id}>
                                                        <div className="px-6 py-4">
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <h3 className="text-sm font-medium text-gray-900">
                                                                        {job.title}
                                                                    </h3>
                                                                    <p className="text-sm text-gray-500">
                                                                        Posted {getDaysAgo(job.created_at)}
                                                                    </p>
                                                                </div>
                                                                <div className="flex space-x-2">
                                                                    <StatusBadge status="active" />
                                                                    {job.applications_count !== undefined && (
                                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                            {job.applications_count} Applications
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="mt-2 flex justify-end">
                                                                <a href={`/jobs/${job.id}`} className="text-xs text-primary hover:text-primary/50">
                                                                    View Details
                                                                </a>
                                                                <span className="mx-2 text-gray-300">|</span>
                                                                <a href={`/jobs/${job.id}/edit`} className="text-xs text-primary hover:text-primary/50">
                                                                    Edit
                                                                </a>
                                                                <span className="mx-2 text-gray-300">|</span>
                                                                <button className="text-xs text-red-600 hover:text-red-800">
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="px-6 py-4 text-center text-gray-500">
                                                    No jobs posted yet
                                                </li>
                                            )}
                                        </ul>
                                        <div className="bg-gray-50 px-6 py-3 flex justify-center">
                                            <a href="/jobs" className="text-sm font-medium text-primary hover:text-primary/50">
                                                View All Jobs
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Recent Applications */}
                                <div className="mt-8">
                                    <h2 className="text-lg font-medium text-gray-900">Recent Applications</h2>
                                    <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
                                        <ul className="divide-y divide-gray-200">
                                            {applications.length > 0 ? (
                                                applications.map(application => (
                                                    <li key={application.id}>
                                                        <div className="px-6 py-4">
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <h3 className="text-sm font-medium text-gray-900">
                                                                        Application for {application.job_title}
                                                                    </h3>
                                                                    <p className="text-sm text-gray-500">
                                                                        Applied {getDaysAgo(application.created_at)}
                                                                    </p>
                                                                </div>
                                                                <StatusBadge status={application.status} />
                                                            </div>
                                                            <div className="mt-2 flex justify-end">
                                                                <a href={`/applications/${application.id}`} className="text-xs text-primary hover:text-primary/50">
                                                                    View Application
                                                                </a>
                                                                {application.status === 'pending' && (
                                                                    <>
                                                                        <span className="mx-2 text-gray-300">|</span>
                                                                        <button className="text-xs text-primary hover:text-primary/50">
                                                                            Mark as Reviewed
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="px-6 py-4 text-center text-gray-500">
                                                    No applications yet
                                                </li>
                                            )}
                                        </ul>
                                        <div className="bg-gray-50 px-6 py-3 flex justify-center">
                                            <a href="/applications" className="text-sm font-medium text-primary hover:text-primary/50">
                                                View All Applications
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Application Status Overview */}
                                <div className="mt-8">
                                    <h2 className="text-lg font-medium text-gray-900">Application Status Overview</h2>
                                    <div className="mt-4 bg-white shadow overflow-hidden rounded-lg">
                                        <div className="px-6 py-5">
                                            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <p className="text-sm font-medium text-gray-500">Pending</p>
                                                    <p className="mt-1 text-3xl font-semibold text-yellow-600">
                                                        {stats?.application_stats?.pending}
                                                    </p>
                                                </div>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <p className="text-sm font-medium text-gray-500">Reviewed</p>
                                                    <p className="mt-1 text-3xl font-semibold text-primary">
                                                        {stats?.application_stats?.reviewed}
                                                    </p>
                                                </div>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <p className="text-sm font-medium text-gray-500">Shortlisted</p>
                                                    <p className="mt-1 text-3xl font-semibold text-green-600">
                                                        {stats?.application_stats?.shortlisted}
                                                    </p>
                                                </div>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <p className="text-sm font-medium text-gray-500">Rejected</p>
                                                    <p className="mt-1 text-3xl font-semibold text-red-600">
                                                        {stats?.application_stats?.rejected}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default page;