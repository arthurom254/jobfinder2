import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const apiUrl = process.env.API_URL || 'http://localhost:5000';
    
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      );
    }
    
    let formData;
    try {
      formData = await request.formData();
      
      console.log('Form data keys:', Array.from(formData.keys()));
    } catch (error) {
      console.error('Error parsing form data:', error);
      return NextResponse.json(
        { error: 'Invalid form data' }, 
        { status: 400 }
      );
    }
    
    try {
      const response = await fetch(`${apiUrl}/api/jobs/${id}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
        },
        // Pass the FormData object directly
        body: formData,
      });
      
      // Get response data
      const contentType = response.headers.get('content-type');
      let result;
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        // Handle non-JSON responses
        const text = await response.text();
        result = { message: text };
      }
      
      // Return appropriate response
      if (!response.ok) {
        return NextResponse.json(
          { error: result.message || 'Application submission failed' }, 
          { status: response.status }
        );
      }
      
      return NextResponse.json(result);
      
    } catch (error) {
      console.error('Error sending request to backend:', error);
      return NextResponse.json(
        { error: 'Failed to communicate with application server' }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unhandled application error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' }, 
      { status: 500 }
    );
  }
}
