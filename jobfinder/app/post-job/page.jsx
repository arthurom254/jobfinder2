import React from 'react'

function page() {
    return (
        <div>
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
                <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="job-title" className="block text-sm font-medium text-gray-700">Job Title</label>
                                <input type="text" name="job-title" id="job-title" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="company-name" className="block text-sm font-medium text-gray-700">Company
                                    Name</label>
                                <input type="text" name="company-name" id="company-name" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                                <input type="text" name="location" id="location" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" placeholder="City, Country or Remote" />
                            </div>
                            <div>
                                <label htmlFor="job-type" className="block text-sm font-medium text-gray-700">Job Type</label>
                                <select id="job-type" name="job-type" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm">
                                    <option value="full-time">Full-time</option>
                                    <option value="part-time">Part-time</option>
                                    <option value="contract">Contract</option>
                                    <option value="freelance">Freelance</option>
                                    <option value="internship">Internship</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                                <select id="category" name="category" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm">
                                    <option value="frontend">Frontend Development</option>
                                    <option value="backend">Backend Development</option>
                                    <option value="fullstack">Full Stack Development</option>
                                    <option value="mobile">Mobile Development</option>
                                    <option value="devops">DevOps</option>
                                    <option value="data">Data Science / Analytics</option>
                                    <option value="design">UI/UX Design</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Experience
                                    Level</label>
                                <select id="experience" name="experience" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm">
                                    <option value="entry">Entry Level</option>
                                    <option value="mid">Mid Level</option>
                                    <option value="senior">Senior Level</option>
                                    <option value="lead">Lead / Manager</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="salary-range" className="block text-sm font-medium text-gray-700">Salary Range</label>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="min-salary" className="sr-only">Minimum Salary</label>
                                    <input type="number" name="min-salary" id="min-salary" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" placeholder="Min (USD)" />
                                </div>
                                <div>
                                    <label htmlFor="max-salary" className="sr-only">Maximum Salary</label>
                                    <input type="number" name="max-salary" id="max-salary" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" placeholder="Max (USD)" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Job Description</label>
                            <div className="mt-1">
                                <textarea id="description" name="description" rows={8} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" defaultValue={""} />
                            </div>
                            <p className="mt-2 text-sm text-gray-500">Detail the role, responsibilities, requirements, and
                                benefits.</p>
                        </div>
                        <div>
                            <label htmlFor="skills" className="block text-sm font-medium text-gray-700">Required Skills</label>
                            <div className="mt-1">
                                <input type="text" name="skills" id="skills" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" placeholder="e.g. JavaScript, React, Node.js (comma separated)" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="application-url" className="block text-sm font-medium text-gray-700">Application URL
                                (Optional)</label>
                            <div className="mt-1">
                                <input type="url" name="application-url" id="application-url" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" placeholder="https://..." />
                            </div>
                            <p className="mt-2 text-sm text-gray-500">If provided, applicants will be redirected to this URL
                                instead of applying on DiscoderJobs.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Job Posting Options</h3>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="relative border rounded-lg p-4 flex flex-col">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">Basic</h4>
                                            <p className="text-sm text-gray-500">30 days listing</p>
                                        </div>
                                        <span className="text-lg font-medium text-gray-900">$99</span>
                                    </div>
                                    <ul className="mt-4 space-y-2 flex-grow">
                                        <li className="flex items-center text-sm text-gray-600">
                                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Standard job listing
                                        </li>
                                        <li className="flex items-center text-sm text-gray-600">
                                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Email notifications
                                        </li>
                                    </ul>
                                    <div className="mt-6">
                                        <input type="radio" id="plan-basic" name="plan" defaultValue="basic" className="h-4 w-4 text-primary focus:ring-primary border-gray-300" defaultChecked />
                                        <label htmlFor="plan-basic" className="ml-2 text-sm text-gray-700">Select</label>
                                    </div>
                                </div>
                                <div className="relative border rounded-lg p-4 flex flex-col border-primary">
                                    <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-primary text-white text-xs font-medium px-2 py-0.5 rounded">
                                        Popular</div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">Premium</h4>
                                            <p className="text-sm text-gray-500">30 days featured listing</p>
                                        </div>
                                        <span className="text-lg font-medium text-gray-900">$199</span>
                                    </div>
                                    <ul className="mt-4 space-y-2 flex-grow">
                                        <li className="flex items-center text-sm text-gray-600">
                                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Featured on homepage
                                        </li>
                                        <li className="flex items-center text-sm text-gray-600">
                                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Highlighted in search results
                                        </li>
                                        <li className="flex items-center text-sm text-gray-600">
                                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Email notifications
                                        </li>
                                    </ul>
                                    <div className="mt-6">
                                        <input type="radio" id="plan-premium" name="plan" defaultValue="premium" className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                                        <label htmlFor="plan-premium" className="ml-2 text-sm text-gray-700">Select</label>
                                    </div>
                                </div>
                                <div className="relative border rounded-lg p-4 flex flex-col">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">Enterprise</h4>
                                            <p className="text-sm text-gray-500">60 days featured listing</p>
                                        </div>
                                        <span className="text-lg font-medium text-gray-900">$399</span>
                                    </div>
                                    <ul className="mt-4 space-y-2 flex-grow">
                                        <li className="flex items-center text-sm text-gray-600">
                                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            All Premium features
                                        </li>
                                        <li className="flex items-center text-sm text-gray-600">
                                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Social media promotion
                                        </li>
                                        <li className="flex items-center text-sm text-gray-600">
                                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Priority candidate access
                                        </li>
                                    </ul>
                                    <div className="mt-6">
                                        <input type="radio" id="plan-enterprise" name="plan" defaultValue="enterprise" className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                                        <label htmlFor="plan-enterprise" className="ml-2 text-sm text-gray-700">Select</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="pt-5">
                            <div className="flex justify-end">
                                <button type="button" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                    Save as Draft
                                </button>
                                <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                    Post Job
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </div>


    )
}

export default page