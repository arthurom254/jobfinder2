import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const apiUrl = process.env.API_URL || 'http://localhost:5000';
    
    // Get authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      );
    }
    
    const jobData = await request.json();
    
    if (!jobData.job_title || !jobData.company_name || !jobData.location || !jobData.description) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }
    
    try {
      const response = await fetch(`${apiUrl}/api/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
        body: JSON.stringify(jobData),
      });
      
      const contentType = response.headers.get('content-type');
      let result;
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const text = await response.text();
        result = { message: text };
      }
      
      if (!response.ok) {
        return NextResponse.json(
          { error: result.message || 'Failed to create job' }, 
          { status: response.status }
        );
      }
      
      return NextResponse.json(result);
      
    } catch (error) {
      console.error('Error sending request to backend:', error);
      return NextResponse.json(
        { error: 'Failed to communicate with job server' }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unhandled job posting error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' }, 
      { status: 500 }
    );
  }
}


export async function GET(request) {
  try {
    const apiUrl = process.env.API_URL || 'http://localhost:5000';
    
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const per_page = searchParams.get('per_page') || '10';
    const keyword = searchParams.get('keyword') || '';
    const location = searchParams.get('location') || '';
    const category = searchParams.get('category') || '';
    const job_type = searchParams.getAll('job_type') || [];
    const experience = searchParams.getAll('experience') || [];
    const skills = searchParams.getAll('skills') || [];
    
    let queryString = `?page=${page}&per_page=${per_page}`;
    if (keyword) queryString += `&keyword=${encodeURIComponent(keyword)}`;
    if (location) queryString += `&location=${encodeURIComponent(location)}`;
    if (category) queryString += `&category=${encodeURIComponent(category)}`;
    
    job_type.forEach(type => {
      queryString += `&job_type=${encodeURIComponent(type)}`;
    });
    
    experience.forEach(level => {
      queryString += `&experience=${encodeURIComponent(level)}`;
    });
    
    skills.forEach(skill => {
      queryString += `&skills=${encodeURIComponent(skill)}`;
    });
    
    const response = await fetch(`${apiUrl}/api/jobs${queryString}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText || 'Failed to fetch jobs' }, 
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching jobs' }, 
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}